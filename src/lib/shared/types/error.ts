/**
 * Standard error codes returned to clients.
 * Used in App.Error interface and error handling.
 */
export type ErrorCode =
	| 'VALIDATION'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'CONFLICT'
	| 'INTERNAL';

/**
 * HTTP status to error code mapping
 */
export const ERROR_CODES: Record<number, ErrorCode> = {
	400: 'VALIDATION',
	401: 'UNAUTHORIZED',
	403: 'FORBIDDEN',
	404: 'NOT_FOUND',
	409: 'CONFLICT'
};

/**
 * Get error code from HTTP status
 */
export function getErrorCode(status: number): ErrorCode {
	return ERROR_CODES[status] ?? 'INTERNAL';
}
