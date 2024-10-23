import { UserProfilePage } from "@/interface/user";
import { API_URL } from "./Endpoint";

export const GETUSER: ApiCall<
  { userId: string, token: string },
  {
    data: UserProfilePage;
  }
> = async (body) => {
  const res = await fetch(API_URL + `users/${body.userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
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

export const FollowUser: ApiCall<
  { userId: string, token: string },
  {
    data: UserProfilePage;
  }
> = async (body) => {
  const res = await fetch(API_URL + `users/follow/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.userId),
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