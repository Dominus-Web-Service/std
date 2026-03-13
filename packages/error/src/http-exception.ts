import {
	HTTP_STATUS_CODES,
	type HttpStatusCode,
	type HttpStatusKey
} from './constant/http-status-codes';
import { Exception, type ExceptionOptions } from './exception';

/**
 * Options accepted by the {@link HttpException} constructor.
 *
 * @template TCause - Type of the underlying cause.
 */
export interface HttpExceptionOptions<TCause = unknown> extends ExceptionOptions<TCause> {
	/**
	 * HTTP status for this exception.
	 *
	 * Accepts a key name (`'NOT_FOUND'`) or a numeric code (`404`).
	 * Defaults to `500 Internal Server Error` when omitted.
	 */
	readonly status?: HttpStatusKey | HttpStatusCode | undefined;
}

/**
 * Exception bound to an HTTP status code.
 *
 * Extends {@link Exception} with an `httpStatusCode` property resolved
 * from a key name or a numeric value. Defaults to `500` when no status is provided.
 *
 * @template TCause - Type of the underlying cause.
 */
export class HttpException<const TCause = unknown> extends Exception<TCause> {
	/** Resolved numeric HTTP status code (e.g. `404`). */
	public readonly httpStatusCode: number;

	/**
	 * Creates a new HTTP exception.
	 *
	 * @param message - Human-readable description of what went wrong.
	 * @param init - Optional status, code, and cause.
	 */
	public constructor(message: string, init?: HttpExceptionOptions<TCause>) {
		super(message, init);
		const status: HttpStatusKey | HttpStatusCode | undefined = init?.status;
		this.httpStatusCode =
			status === undefined
				? HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
				: typeof status === 'number'
					? status
					: typeof status === 'string'
						? HTTP_STATUS_CODES[status]
						: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
	}
}
