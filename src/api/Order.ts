import { API_URL } from "./Endpoint";

import { CreateOrderReq, OrderDetail } from "@/interface/order";

export const CREATEORDER: ApiCall<
  { product: CreateOrderReq[]; token: string },
  { data: { id: string } }
> = async (body) => {
  const res = await fetch(API_URL + `order/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.product),
  });

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

export const GETORDER: ApiCall<
  { orderId: string; token: string },
  { data: OrderDetail }
> = async (body) => {
  const res = await fetch(API_URL + `order/${body.orderId}`, {
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

export const CHECKREF: ApiCall<
  { refId: string; token: string },
  { data: OrderDetail }
> = async (body) => {
  const res = await fetch(API_URL + `order/check/${body.refId}`, {
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
