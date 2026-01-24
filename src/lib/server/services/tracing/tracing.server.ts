import { trace, SpanStatusCode, type Span, type Attributes } from '@opentelemetry/api';

const tracer = trace.getTracer('blob-app');

/**
 * Error classification for better filtering in trace UI.
 * - user: Client errors (validation, auth, bad input)
 * - system: Internal errors (bugs, failed assertions)
 * - external: Third-party service failures (APIs, databases)
 */
export type ErrorKind = 'user' | 'system' | 'external';

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
	const wrapper = async function (...args: Args): Promise<R> {
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

	// Preserve original function name for stack traces
	Object.defineProperty(wrapper, 'name', { value: fn.name || name });
	return wrapper;
}

/**
 * Wrap a synchronous function to execute within a named span.
 * Use for CPU-intensive sync operations (parsing, validation, transforms).
 *
 * @example
 * const parseConfig = tracedSync('config.parse', (raw: string) => {
 *   return JSON.parse(raw);
 * });
 */
export function tracedSync<Args extends unknown[], R>(
	name: string,
	fn: (...args: Args) => R
): (...args: Args) => R {
	const wrapper = function (...args: Args): R {
		return tracer.startActiveSpan(name, (span) => {
			try {
				const result = fn(...args);
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

	// Preserve original function name for stack traces
	Object.defineProperty(wrapper, 'name', { value: fn.name || name });
	return wrapper;
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

/**
 * Record an error with classification on the current active span.
 * Useful for categorizing errors for better filtering and triage in trace UI.
 * Safe to call even if no span is active.
 *
 * @param error - The error to record
 * @param kind - Classification: 'user' (client errors), 'system' (bugs), 'external' (third-party failures)
 * @param attributes - Additional attributes to attach to the span
 *
 * @example
 * try {
 *   await stripeApi.createPayment(data);
 * } catch (error) {
 *   recordError(error, 'external', { 'api.name': 'stripe' });
 *   throw error;
 * }
 */
export function recordError(
	error: unknown,
	kind: ErrorKind = 'system',
	attributes?: Attributes
): void {
	const span = trace.getActiveSpan();
	if (!span) return;

	const err = error instanceof Error ? error : new Error(String(error));

	span.recordException(err);
	span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
	span.setAttributes({
		'error.kind': kind,
		'error.type': err.constructor.name,
		...attributes
	});
}
