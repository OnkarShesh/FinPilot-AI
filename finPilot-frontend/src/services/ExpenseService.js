import axios from "axios";

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        const host = window.location.hostname;
        // When running locally in dev, use /api which Vite dev server proxies to http://localhost:8080
        if (host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.") || host.startsWith("10.") || host.startsWith("172.")) {
            return "/api";
        }
        // In production (Vercel, custom domain, phone on internet), always use Render backend
        return "https://finpilot-ai-4ygw.onrender.com/api";
    }
    return "https://finpilot-ai-4ygw.onrender.com/api";
};

export const BASE_URL = getBaseUrl();

const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") return null;
    return token;
};

const authHeaders = () => {
    const token = getToken();
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
};

// Response interceptor to handle session expiry / invalid tokens
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn("Session expired or unauthorized (401/403). Redirecting to login...");
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            localStorage.removeItem("aiInsights");
            if (typeof window !== "undefined" && !window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const registerUser = (userData) => {
    return axios.post(`${BASE_URL}/auth/register`, userData);
};

export const loginUser = (credentials) => {
    return axios.post(`${BASE_URL}/auth/login`, credentials);
};

// Expense APIs
export const getExpenses = () => {
    return axios.get(`${BASE_URL}/expenses`, authHeaders());
};

export const addExpense = (expense) => {
    return axios.post(`${BASE_URL}/expenses`, expense, authHeaders());
};

export const updateExpense = (id, expense) => {
    return axios.put(`${BASE_URL}/expenses/${id}`, expense, authHeaders());
};

export const deleteExpense = (id) => {
    return axios.delete(`${BASE_URL}/expenses/${id}`, authHeaders());
};

export const batchDeleteExpenses = async (ids) => {
    if (!ids || ids.length === 0) return;
    try {
        return await axios.post(`${BASE_URL}/expenses/batch-delete`, ids, authHeaders());
    } catch (err) {
        return await Promise.all(ids.map((id) => deleteExpense(id)));
    }
};

// Dashboard API
export const getDashboardSummary = () => {
    return axios.get(`${BASE_URL}/dashboard`, authHeaders());
};

// AI Insights API
export const getAIInsights = () => {
    return axios.get(`${BASE_URL}/ai/analyze`, authHeaders());
};
