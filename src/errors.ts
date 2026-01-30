export class HttpError extends Error {
  status: number;
  detail?: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

/**
 * Use for upstream (WordPress/WPGraphQL) failures so routes can just throw it.
 */
export class UpstreamError extends HttpError {
  constructor(message = "Upstream WPGraphQL error", detail?: unknown) {
    super(502, message, detail);
  }
}
