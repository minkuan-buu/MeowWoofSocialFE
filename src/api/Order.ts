import { InitialCartOrder } from "@/interface/cart";
import { API_URL } from "./Endpoint";

import { CreateOrderReq, OrderDetail, OrderPaymentDetail, OrderRating } from "@/interface/order";

export const CREATEORDER: ApiCall<
  { product: InitialCartOrder[] | CreateOrderReq[]; token: string },
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
  { data: OrderDetail , message: string}
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

export const GETTRACKINGORDER: ApiCall<
  { orderId: string; token: string },
  { data: OrderDetail , message: string}
> = async (body) => {
  const res = await fetch(API_URL + `order/tracking/${body.orderId}`, {
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

export const GETRATINGORDER: ApiCall<
  { orderId: string; token: string },
  { data: OrderRating[] , message: string}
> = async (body) => {
  const res = await fetch(API_URL + `order/rating/${body.orderId}`, {
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

export const GETLISTORDER: ApiCall<
  { token: string },
  { data: OrderDetail[], message: string }
> = async (body) => {
  const res = await fetch(API_URL + `order`, {
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

export const CHECKTRANSACTION: ApiCall<
  { id: string; token: string },
  { data: OrderPaymentDetail }
> = async (body) => {
  const res = await fetch(API_URL + `transaction/handle-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.id),
  });

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok,
      res: res.ok ? data : null,
      statusCode: res.status,
    };
  } catch (error) {
    return {
      isSuccess: false,
      res: null,
      statusCode: 500, // Lỗi mạng
    };
  }
};

export const MAKEPAYMENT = async (orderId: string, token: string) => {
  const res = await fetch(API_URL + `payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
    body: JSON.stringify(orderId),
  });

  if (res.ok) {
    const data = await res.json();
    // Chuyển hướng tới URL thanh toán
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    }
  } else {
    console.error("Payment failed.");
  }
};
