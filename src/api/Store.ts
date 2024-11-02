import { ListProduct, Product } from "@/interface/store";
import { API_URL } from "./Endpoint";

export const GETALLPRODUCTS: ApiCall<
  { PageSize: number; lastPetStoreProductId: string; token: string },
  { data: ListProduct[] }
> = async (body) => {
  const res = await fetch(
    API_URL + `stores/products?PageSize=${body.PageSize}&lastPetStoreProductId=${body.lastPetStoreProductId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token,
      },
    }
  );

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok, // Kiểm tra trạng thái 2xx
      res: res.ok ? data : null, // Chỉ trả về dữ liệu nếu thành công
      statusCode: res.status, // Mã trạng thái HTTP
    };
  } catch (error) {
    // Lỗi khi không thể parse JSON hoặc lỗi mạng
    return {
      isSuccess: false,
      res: null,
      statusCode: res.status,
    };
  }
};

export const GETPRODUCTDETAIL: ApiCall<
  { productId: string; token: string },
  { data: Product }
> = async (body) => {
  const res = await fetch(
    API_URL + `stores/product/${body.productId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token,
      },
    }
  );

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok, // Kiểm tra trạng thái 2xx
      res: res.ok ? data : null, // Chỉ trả về dữ liệu nếu thành công
      statusCode: res.status, // Mã trạng thái HTTP
    };
  } catch (error) {
    // Lỗi khi không thể parse JSON hoặc lỗi mạng
    return {
      isSuccess: false,
      res: null,
      statusCode: res.status,
    };
  }
};