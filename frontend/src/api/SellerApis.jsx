import { axiosInstance } from "../config/axiosInstance.jsx";

export const registerSeller = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/seller/register", data);
    console.log(response);
    if(response){
        return response.data.seller
    }
  } catch (error) {
    console.log("Error while seller registration: ",error);
  }
};

export const loginSeller = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/seller/login", data);
    console.log(response);
    if(response){
        return response.data.seller
    }
  } catch (error) {
    console.log("Error while seller login: ",error);
  }
};
