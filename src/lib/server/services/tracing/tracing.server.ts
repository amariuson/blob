import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import { env } from '$lib/server/env.server';

import { logger } from '../logger';
import { onShutdown } from '../lifecycle';

let sdk: NodeSDK | null = null;

export function startTracing() {
	if (sdk) return;

	// Axiom is optional in dev — skip tracing when it isn't configured.
	if (!env.AXIOM_TOKEN || !env.AXIOM_DATASET_TRACES) {
		logger.warn('[tracing] AXIOM_TOKEN or AXIOM_DATASET_TRACES not set; skipping OTEL SDK start');
		return;
	}

	sdk = new NodeSDK({
		resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME }),
		traceExporter: new OTLPTraceExporter({
			url: 'https://api.axiom.co/v1/traces',
			headers: {
				Authorization: `Bearer ${env.AXIOM_TOKEN}`,
				'X-Axiom-Dataset': env.AXIOM_DATASET_TRACES
			}
		}),
		// Note: @kubiks/otel-{drizzle,polar,resend} are client-wrapping helpers
		// (e.g. instrumentDrizzleClient(db), instrumentPolar(client)), not OTEL
		// Instrumentation classes. They are applied where each client is
		// constructed, not registered here.
		instrumentations: [getNodeAutoInstrumentations()]
	});

	sdk.start();

	onShutdown('tracing', async () => {
		await sdk?.shutdown();
	});
}
