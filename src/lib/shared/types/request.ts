export type RequestContext = {
	requestId: string;
	userId?: string;
	orgId?: string;
	traceId?: string;
	spanId?: string;
};
