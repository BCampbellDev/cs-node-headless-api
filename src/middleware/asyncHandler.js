/**
 * Wrap async route handlers so thrown/rejected errors go to Express error middleware.
 */
export default function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=asyncHandler.js.map