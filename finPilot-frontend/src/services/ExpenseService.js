import axios from "axios";

const BASE_URL = "https://finpilot-ai-4ygw.onrender.com/api";

const getToken = () => {
    return localStorage.getItem("token");
};

const authHeaders = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
});

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

// Dashboard API

export const getDashboardSummary = () => {
    return axios.get(`${BASE_URL}/dashboard`, authHeaders());
};

export const getAIInsights = () => {
    return axios.get(`${BASE_URL}/ai/analyze`, authHeaders());
};