import { axiosInstance } from "../config/axiosInstance";

export const fetchProductDetail = async (id) => {
  try {
    let response = await axiosInstance.get(`/products/product-detail/${id}`);

    if (response) {
      return response.data.product;
    }
  } catch (error) {
    console.log("Error in product details", error);
  }
};

export const createProduct = async (data) => {
  try {
    console.log("Creating product with data:", data);
    const res = await axiosInstance.post("/products/create-product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Product creation response:", res);
    return res;
  } catch (error) {
    console.error("Error in creating products: ", error);
  }
};

export const fetchAllProducts = async (search = "", page = 1, limit = 20) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await axiosInstance.get(
      `/products/all-products?${params}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchSellerProducts = async () => {
  try {
    const res = await axiosInstance.get("/products/seller-products");
    console.log(res);
    if (res) {
      return res.data.products;
    }
  } catch (error) {
    console.log("Error while seller products fetching: ", error);
  }
};
