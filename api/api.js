import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.okiiee.com",
    // baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Add an interceptor to update the token dynamically before each 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Get latest token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
