import axios from "axios";
import { toast } from 'react-toastify';

const createInstance = (baseURL, headers = {}) => {
  const instance = axios.create({ baseURL, headers });

  // Global response interceptor for basic error/toast handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message || error.message || 'An error occurred';
      // Avoid spamming toasts for network retries
      toast.error(message, { position: 'top-right', autoClose: 5000 });
      return Promise.reject(error);
    }
  );

  return instance;
};

const defaultAxios = createInstance(import.meta.env.VITE_MERCHANT_BASE_URL, {
  Accept: "*/*",
  "Content-Type": "application/json",
});

export default defaultAxios;

export const newAxios = createInstance(import.meta.env.VITE_MERCHANT_BASE_URL_NEW, {
  Accept: "*/*",
  "Content-Type": "application/json",
});

export const axiosPrivate = createInstance(import.meta.env.VITE_MERCHANT_BASE_URL, {
  Accept: "application/json",
  "Content-Type": "application/json",
});

export const formDataAxiosPrivate = createInstance(import.meta.env.VITE_MERCHANT_BASE_URL_NEW, {
  Accept: "application/json",
});

export const noHeaderAxiosPrivate = createInstance(import.meta.env.VITE_MERCHANT_BASE_URL, {});
