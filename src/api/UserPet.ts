import { UserPet } from "@/interface/userPet";
import { API_URL } from "./Endpoint";

export const GETUSERPET: ApiCall<
  { token: string },
  {
    data: UserPet[];
  }
> = async (body) => {
  const res = await fetch(API_URL + `pet`, {
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