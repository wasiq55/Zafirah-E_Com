import { axiosInstance } from "../config/axiosInstance";

export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axiosInstance.post("/cart/add", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await axiosInstance.put("/cart/update", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await axiosInstance.delete("/cart/remove", {
      data: { productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete("/cart/clear");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
