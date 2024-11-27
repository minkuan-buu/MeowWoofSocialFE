import { UserCart } from "@/interface/cart";
import { API_URL } from "./Endpoint";

export const GETUSERCART: ApiCall<
  { token: string },
  {
    data: UserCart[];
  }
> = async (body) => {
  const res = await fetch(API_URL + `cart`, {
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
}

export const ADDTOCART: ApiCall<
  { token: string, productItemId: string, quantity: number },
  {
    data: {
      message: string;
    };
  }
> = async (body) => {
  const res = await fetch(API_URL + `cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body),
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
}

export const UPDATECART: ApiCall<
  { token: string, productItemId: string, quantity: number },
  {
    data: {
      message: string;
    };
  }
> = async (body) => {
  const res = await fetch(API_URL + `cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body),
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
}

export const DELETECART: ApiCall<
  { token: string, id: string },
  {
    data: {
      message: string;
    };
  }
> = async (body) => {
  const res = await fetch(API_URL + `cart/${body.id}`, {
    method: "DELETE",
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
}