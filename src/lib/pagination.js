export function clampFirst(value, fallback = 10) {
    const n = typeof value === "string" ? Number(value) : fallback;
    const safe = Number.isFinite(n) ? n : fallback;
    return Math.min(Math.max(Math.trunc(safe), 1), 50);
}
//# sourceMappingURL=pagination.js.map