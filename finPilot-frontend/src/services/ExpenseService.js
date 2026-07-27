import axios from "axios";

const BASE_URL = "http://localhost:8080/api/expenses";

const getToken = () => {
    return localStorage.getItem("token");
};

export const getExpenses = () => {
    return axios.get(BASE_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const addExpense = (expense) => {
    return axios.post(BASE_URL, expense, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const updateExpense = (id, expense) => {
    return axios.put(`${BASE_URL}/${id}`, expense, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};

export const deleteExpense = (id) => {
    return axios.delete(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
};