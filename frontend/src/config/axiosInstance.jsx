import axios from "axios";
import { store } from "../store/store";
import { setError } from "../store/features/errorSlice";


export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL:", import.meta.env.VITE_API_URL);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    store.dispatch(setError(errorMsg));

    return Promise.reject(error);
  }
);