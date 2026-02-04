export declare class HttpError extends Error {
    status: number;
    detail?: unknown;
    constructor(status: number, message: string, detail?: unknown);
}
/**
 * Use for upstream (WordPress/WPGraphQL) failures so routes can just throw it.
 */
export declare class UpstreamError extends HttpError {
    constructor(message?: string, detail?: unknown);
}
//# sourceMappingURL=errors.d.ts.map