import {
	NODE_ENV,
	npm_package_version,
	OTEL_EXPORTER_OTLP_ENDPOINT,
	OTEL_EXPORTER_OTLP_HEADERS,
	OTEL_SERVICE_NAME
} from '$env/static/private';

import { onShutdown } from '$services/lifecycle';

import { createAddHookMessageChannel } from 'import-in-the-middle';
import { register } from 'node:module';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

// Read version from package.json at runtime
const version = npm_package_version || '0.0.1';
const environment = NODE_ENV || 'development';

function getTraceExporter() {
	const endpoint = OTEL_EXPORTER_OTLP_ENDPOINT;
	const headersEnv = OTEL_EXPORTER_OTLP_HEADERS;

	const headers: Record<string, string> = {};
	if (headersEnv) {
		// Parse "Key=Value,Key2=Value2" format
		for (const pair of headersEnv.split(',')) {
			const [key, ...valueParts] = pair.split('=');
			if (key && valueParts.length > 0) {
				headers[key.trim()] = valueParts.join('=').trim();
			}
		}
	}

	return new OTLPTraceExporter({
		url: endpoint ? `${endpoint}/v1/traces` : 'http://localhost:4318/v1/traces',
		headers: Object.keys(headers).length > 0 ? headers : undefined
	});
}

const sdk = new NodeSDK({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: OTEL_SERVICE_NAME,
		[ATTR_SERVICE_VERSION]: version,
		'deployment.environment.name': environment
	}),
	traceExporter: getTraceExporter(),
	instrumentations: [
		getNodeAutoInstrumentations({
			// Disable file system instrumentation (too noisy)
			'@opentelemetry/instrumentation-fs': { enabled: false },
			// Enable Redis/ioredis instrumentation for session/cache tracing
			'@opentelemetry/instrumentation-ioredis': { enabled: true },
			// Configure HTTP instrumentation
			'@opentelemetry/instrumentation-http': {
				// Ignore health checks and static assets
				ignoreIncomingRequestHook: (request) => {
					const url = request.url || '';
					const pathname = url.split('?')[0];
					return (
						// Healthcheck
						url.endsWith('/api/health') ||
						// Static file extensions
						pathname.endsWith('.js') ||
						pathname.endsWith('.css') ||
						pathname.endsWith('.png') ||
						pathname.endsWith('.svg') ||
						pathname.endsWith('.ico') ||
						pathname.endsWith('.woff') ||
						pathname.endsWith('.woff2') ||
						pathname.endsWith('.ttf') ||
						pathname.endsWith('.eot')
					);
				},
				// Rename spans to include the route path for better discoverability
				requestHook: (span, request) => {
					const method = request.method || 'GET';
					const url = 'url' in request ? request.url || '/' : '/';
					const pathname = url.split('?')[0];

					// Remote functions: /_app/remote/{hash}/{functionName}
					// Extract function name (last path segment) when path contains /remote/
					if (pathname.includes('/_app/') && pathname.includes('/remote/')) {
						const segments = pathname.split('/');
						const functionName = segments[segments.length - 1];
						if (functionName) {
							span.updateName(`${method} rf:${functionName}`);
							span.setAttribute('remote_function.name', functionName);
							return;
						}
					}

					span.updateName(`${method} ${pathname}`);
				}
			}
		})
	]
});

sdk.start();

onShutdown('OpenTelemetry', () => sdk.shutdown());
