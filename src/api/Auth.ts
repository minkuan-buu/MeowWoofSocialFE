import { API_URL } from "./Endpoint";

export const LOGIN: ApiCall<
  { email: string; password: string },
  | {
      data: {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        token: string;
      };
    }
  | { message: string }
> = async (body) => {
  try {
    const res = await fetch(API_URL + "auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return { isSuccess: true, res: data }; // Trả về dữ liệu nếu thành công
    } else {
      const errorData = await res.json(); // Lấy chi tiết lỗi
      return { isSuccess: false, res: errorData }; // Trả về lỗi từ server
    }
  } catch (error) {
    return { isSuccess: false, res: { message: "Network error" } }; // Lỗi mạng
  }
};

export const REGISTER: ApiCall<
  { name: string, email: string; password: string, phone: string },
  {
    message: string
  }
> = async (body) => {
  try {
    const res = await fetch(API_URL + "auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();

      return { isSuccess: true, res: data };
    } else {
      const errorData = await res.json();
      return { isSuccess: false, res: errorData };
    }
  } catch (error) {
    return { isSuccess: false, res: { message: "Network error" } }; // Lỗi mạng
  }
};
