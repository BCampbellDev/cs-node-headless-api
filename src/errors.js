export class HttpError extends Error {
    status;
    detail;
    constructor(status, message, detail) {
        super(message);
        this.status = status;
        this.detail = detail;
    }
}
/**
 * Use for upstream (WordPress/WPGraphQL) failures so routes can just throw it.
 */
export class UpstreamError extends HttpError {
    constructor(message = "Upstream WPGraphQL error", detail) {
        super(502, message, detail);
    }
}
//# sourceMappingURL=errors.js.map