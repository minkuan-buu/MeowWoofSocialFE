import { PetStore } from "@/interface/petStore";
import { API_URL } from "./Endpoint";

export const GETPETSTORE: ApiCall<
  { petStoreId: string; token: string },
  { data: PetStore , message: string}
> = async (body) => {
  const res = await fetch(API_URL + `shop/${body.petStoreId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
  });

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok, // Kiểm tra trạng thái 2xx
      res: res.ok || data ? data : null, // Chỉ trả về dữ liệu nếu thành công
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