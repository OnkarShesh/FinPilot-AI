/**
 * Date & Time utility for FinPilot AI.
 * Handles UTC-to-IST conversion accurately for all database timestamps.
 * If backend returns ISO string without 'Z' (e.g. 2026-11-04T02:48:20),
 * this ensures it's parsed as UTC so the user's browser renders exact local IST time (08:18 AM).
 */

export const parseTransactionDate = (dateVal) => {
    if (!dateVal) return null;
    let s = String(dateVal).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        return new Date(`${s}T00:00:00`);
    }
    if (!s.endsWith("Z") && !/[+-]\d{2}(?::?\d{2})?$/.test(s)) {
        s = `${s}Z`;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
};

export const formatTimeIST = (createdAt) => {
    if (!createdAt) return null;
    const d = parseTransactionDate(createdAt);
    if (!d) return null;
    return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const formatDateIST = (dateVal, createdAt) => {
    const d = parseTransactionDate(createdAt || dateVal);
    if (!d) return "";
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};
