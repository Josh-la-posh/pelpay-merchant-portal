import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_API_MERCHANT_BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_API_MERCHANT_BASE_URL,
    headers: {'Content-Type': 'application/json'},
});

export const noHeaderAxiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_API_MERCHANT_BASE_URL,
});