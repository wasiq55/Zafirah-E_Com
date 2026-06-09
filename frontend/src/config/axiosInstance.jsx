import axios from "axios";
import { store } from "../store/store";
import { setError } from "../store/features/errorSlice";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


axios.interceptors.response.use(
    (response) => response,
    (error) =>{
        let errorMsg = error.response?.data?.message;
        store.dispatch(setError(errorMsg));
        return Promise.reject(error);
    }
)