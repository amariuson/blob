import { env as dynamicEnv } from '$env/dynamic/private';

// --- Required for boot ---------------------------------------------------
const REQUIRED = [
	'APP_NAME',
	'APP_SLUG',
	'COOKIE_PREFIX',
	'OTEL_SERVICE_NAME',
	'EMAIL_FROM',
	'DATABASE_URL',
	'BETTER_AUTH_SECRET',
	'BETTER_AUTH_URL',
	'REDIS_URL'
] as const;

// --- Optional, each service guards on its own presence -------------------
const OPTIONAL = [
	'GOOGLE_CLIENT_ID',
	'GOOGLE_CLIENT_SECRET',
	'RESEND_API_KEY',
	'POLAR_ACCESS_TOKEN',
	'POLAR_WEBHOOK_SECRET',
	'POLAR_SERVER',
	'AXIOM_TOKEN',
	'AXIOM_DATASET_LOGS',
	'AXIOM_DATASET_TRACES',
	'S3_ENDPOINT',
	'S3_REGION',
	'S3_BUCKET',
	'S3_ACCESS_KEY_ID',
	'S3_SECRET_ACCESS_KEY'
] as const;

type RequiredKey = (typeof REQUIRED)[number];
type OptionalKey = (typeof OPTIONAL)[number];

const raw: Record<RequiredKey | OptionalKey, string | undefined> = Object.fromEntries(
	[...REQUIRED, ...OPTIONAL].map((k) => [k, dynamicEnv[k]])
) as Record<RequiredKey | OptionalKey, string | undefined>;

const missing = REQUIRED.filter((k) => !raw[k]);
if (missing.length > 0) {
	throw new Error(
		`Missing required environment variables: ${missing.join(', ')}. ` +
			`See .env.example for the full list.`
	);
}

export const env = {
	// required
	APP_NAME: raw.APP_NAME!,
	APP_SLUG: raw.APP_SLUG!,
	COOKIE_PREFIX: raw.COOKIE_PREFIX!,
	OTEL_SERVICE_NAME: raw.OTEL_SERVICE_NAME!,
	EMAIL_FROM: raw.EMAIL_FROM!,
	DATABASE_URL: raw.DATABASE_URL!,
	BETTER_AUTH_SECRET: raw.BETTER_AUTH_SECRET!,
	BETTER_AUTH_URL: raw.BETTER_AUTH_URL!,
	REDIS_URL: raw.REDIS_URL!,
	// optional — callers decide how to handle undefined
	GOOGLE_CLIENT_ID: raw.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: raw.GOOGLE_CLIENT_SECRET,
	RESEND_API_KEY: raw.RESEND_API_KEY,
	POLAR_ACCESS_TOKEN: raw.POLAR_ACCESS_TOKEN,
	POLAR_WEBHOOK_SECRET: raw.POLAR_WEBHOOK_SECRET,
	POLAR_SERVER: (raw.POLAR_SERVER as 'sandbox' | 'production' | undefined) ?? 'sandbox',
	AXIOM_TOKEN: raw.AXIOM_TOKEN,
	AXIOM_DATASET_LOGS: raw.AXIOM_DATASET_LOGS,
	AXIOM_DATASET_TRACES: raw.AXIOM_DATASET_TRACES,
	S3_ENDPOINT: raw.S3_ENDPOINT,
	S3_REGION: raw.S3_REGION,
	S3_BUCKET: raw.S3_BUCKET,
	S3_ACCESS_KEY_ID: raw.S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY: raw.S3_SECRET_ACCESS_KEY
} as const;

export const isDev = process.env.NODE_ENV !== 'production';
export const isProd = !isDev;

// Helpers for optional services — each returns required values or throws with a focused message.
export function requireGoogleOAuth() {
	if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
		throw new Error('Google OAuth not configured: set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET');
	}
	return { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
}

export function requirePolar() {
	if (!env.POLAR_ACCESS_TOKEN || !env.POLAR_WEBHOOK_SECRET) {
		throw new Error('Polar not configured: set POLAR_ACCESS_TOKEN + POLAR_WEBHOOK_SECRET');
	}
	return {
		accessToken: env.POLAR_ACCESS_TOKEN,
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		server: env.POLAR_SERVER
	};
}

export function requireAxiom() {
	if (!env.AXIOM_TOKEN || !env.AXIOM_DATASET_LOGS || !env.AXIOM_DATASET_TRACES) {
		throw new Error('Axiom not configured: set AXIOM_TOKEN + AXIOM_DATASET_{LOGS,TRACES}');
	}
	return {
		token: env.AXIOM_TOKEN,
		datasetLogs: env.AXIOM_DATASET_LOGS,
		datasetTraces: env.AXIOM_DATASET_TRACES
	};
}

export function requireS3() {
	const { S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = env;
	if (!S3_ENDPOINT || !S3_REGION || !S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
		throw new Error(
			'S3 not configured: set S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY'
		);
	}
	return { S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY };
}

export function requireResend() {
	if (!env.RESEND_API_KEY) throw new Error('Resend not configured: set RESEND_API_KEY');
	return { apiKey: env.RESEND_API_KEY };
}
