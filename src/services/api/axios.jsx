import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_MERCHANT_BASE_URL,
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
    }
});

export const axiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_MERCHANT_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export const noHeaderAxiosPrivate = axios.create({
    baseURL: import.meta.env.VITE_MERCHANT_BASE_URL,
});