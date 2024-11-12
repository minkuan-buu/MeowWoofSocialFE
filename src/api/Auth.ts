import { API_URL } from "./Endpoint";

export const LOGIN: ApiCall<
  { email: string; password: string },
  | {
      data: {
        id: string;
        name: string;
        email: string;
        phone: string;
        avartar: string;
        role: string;
        token: string;
      };
    }
  | { message: string }
> = async (body) => {
  const res = await fetch(API_URL + "auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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

export const REGISTER: ApiCall<
  { name: string, email: string; password: string, phone: string },
  {
    message: string
  }
> = async (body) => {
  const res = await fetch(API_URL + "auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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
