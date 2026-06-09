import { axiosInstance } from "../config/axiosInstance";

export const createOrder = async (data) => {
  try {
    let res = await axiosInstance.post("/payment/create-order", data);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("Error while generating order: ", error);
  }
};

