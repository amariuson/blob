import { type Attributes, type Span, SpanStatusCode, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('blob-app');

/**
 * Wrap a plain async function to execute within a named span.
 * Use for standalone async functions, NOT for form/query (they have special properties
 * that would be lost when wrapped).
 *
 * @example
 * const processWebhook = traced('webhook.process', async (payload: WebhookPayload) => {
 *   setSpanAttributes({ 'webhook.type': payload.type });
 *   // ... processing logic
 * });
 */
export function traced<Args extends unknown[], R>(
	name: string,
	fn: (...args: Args) => Promise<R>
): (...args: Args) => Promise<R> {
	return async (...args: Args): Promise<R> => {
		return tracer.startActiveSpan(name, async (span) => {
			try {
				const result = await fn(...args);
				span.setStatus({ code: SpanStatusCode.OK });
				return result;
			} catch (error) {
				span.setStatus({
					code: SpanStatusCode.ERROR,
					message: error instanceof Error ? error.message : 'Unknown error'
				});
				span.recordException(error instanceof Error ? error : new Error(String(error)));
				throw error;
			} finally {
				span.end();
			}
		});
	};
}

/**
 * Execute a function within a custom OpenTelemetry span.
 * Use for inline wrapping of specific operations (e.g., a single 3rd-party call).
 *
 * @param name - The name of the span (e.g., 'polar.createCheckout', 'webhook.processEntitlements')
 * @param attributes - Initial attributes to set on the span
 * @param fn - The function to execute within the span
 */
export async function withSpan<T>(
	name: string,
	attributes: Attributes,
	fn: (span: Span) => Promise<T>
): Promise<T> {
	return tracer.startActiveSpan(name, { attributes }, async (span) => {
		try {
			const result = await fn(span);
			span.setStatus({ code: SpanStatusCode.OK });
			return result;
		} catch (error) {
			span.setStatus({
				code: SpanStatusCode.ERROR,
				message: error instanceof Error ? error.message : 'Unknown error'
			});
			span.recordException(error instanceof Error ? error : new Error(String(error)));
			throw error;
		} finally {
			span.end();
		}
	});
}

/**
 * Add an event to the current active span.
 * Safe to call even if no span is active.
 */
export function addSpanEvent(name: string, attributes?: Attributes): void {
	const span = trace.getActiveSpan();
	if (span) {
		span.addEvent(name, attributes);
	}
}

/**
 * Set attributes on the current active span.
 * Safe to call even if no span is active.
 */
export function setSpanAttributes(attributes: Attributes): void {
	const span = trace.getActiveSpan();
	if (span) {
		span.setAttributes(attributes);
	}
}
