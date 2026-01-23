import pino from 'pino';
import type { TransportSingleOptions } from 'pino';
import { trace, context as otelContext } from '@opentelemetry/api';
import { dev } from '$app/environment';
import type { RequestContext } from '$lib/shared/types';
import { getRequestEvent } from '$app/server';
import {
	GRAFANA_CLOUD_LOKI_HOST,
	GRAFANA_CLOUD_LOKI_TOKEN,
	GRAFANA_CLOUD_LOKI_USER,
	NODE_ENV,
	OTEL_SERVICE_NAME
} from '$env/static/private';

function buildTransport(): TransportSingleOptions | undefined {
	if (dev) {
		return {
			target: 'pino-pretty',
			options: { colorize: true }
		};
	}

	const lokiHost = GRAFANA_CLOUD_LOKI_HOST;
	const lokiUser = GRAFANA_CLOUD_LOKI_USER;
	const lokiToken = GRAFANA_CLOUD_LOKI_TOKEN;

	const hasAnyLokiConfig = lokiHost || lokiUser || lokiToken;
	const hasAllLokiConfig = lokiHost && lokiUser && lokiToken;

	if (hasAnyLokiConfig && !hasAllLokiConfig) {
		console.warn(
			'[logger] Partial Loki configuration detected. All three env vars required: ' +
				'GRAFANA_CLOUD_LOKI_HOST, GRAFANA_CLOUD_LOKI_USER, GRAFANA_CLOUD_LOKI_TOKEN. ' +
				'Falling back to stdout.'
		);
	}

	if (hasAllLokiConfig) {
		return {
			target: 'pino-loki',
			options: {
				host: lokiHost,
				basicAuth: {
					username: lokiUser,
					password: lokiToken
				},
				labels: {
					app: OTEL_SERVICE_NAME || 'blob-app',
					env: NODE_ENV || 'production'
				}
			}
		};
	}

	return undefined;
}

/**
 * Creates the base pino logger with request context injection.
 * The mixin function automatically adds request context (requestId, userId, orgId)
 * and OpenTelemetry trace context (traceId, spanId) to every log message.
 */
export const logger = pino({
	level: dev ? 'debug' : 'info',
	mixin() {
		let requestContext: RequestContext | undefined;

		try {
			const event = getRequestEvent();
			requestContext = event.locals.context;
		} catch {
			// Expected outside request context - only warn once for unexpected errors
		}

		// Safely get OpenTelemetry span context - don't let tracing failures break logging
		let spanContext: { traceId?: string; spanId?: string } | undefined;
		try {
			const span = trace.getSpan(otelContext.active());
			spanContext = span?.spanContext();
		} catch {
			// Ignore OpenTelemetry errors - logging should continue to work
		}

		return {
			// Request context (from AsyncLocalStorage)
			...(requestContext?.requestId && { requestId: requestContext.requestId }),
			...(requestContext?.userId && { userId: requestContext.userId }),
			...(requestContext?.orgId && { orgId: requestContext.orgId }),
			// OpenTelemetry trace context
			...(spanContext?.traceId && { traceId: spanContext.traceId }),
			...(spanContext?.spanId && { spanId: spanContext.spanId })
		};
	},
	transport: buildTransport()
});

/**
 * Create a child logger with additional context.
 * Useful for feature-specific logging where you want consistent prefixes.
 */
export function createLogger(bindings: pino.Bindings) {
	return logger.child(bindings);
}
