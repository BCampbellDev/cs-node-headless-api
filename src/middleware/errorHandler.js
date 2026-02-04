import { HttpError } from "../errors.js";
export function errorHandler(err, _req, res, _next) {
    // Default fallback
    let status = 500;
    let message = "Internal server error";
    let detail = undefined;
    if (err instanceof HttpError) {
        status = err.status;
        message = err.message;
        detail = err.detail;
    }
    else if (err instanceof Error) {
        // Keep message helpful in dev; don’t leak stack by default
        message = err.message || message;
    }
    // Avoid double-send
    if (res.headersSent)
        return;
    const payload = { error: message };
    if (detail !== undefined)
        payload.detail = detail;
    res.status(status).json(payload);
}
//# sourceMappingURL=errorHandler.js.map