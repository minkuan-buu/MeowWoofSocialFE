
import { CreateFeelingReq, CreateFeelingRes, UpdateFeelingReq } from "@/interface/feeling";
import { API_URL } from "./Endpoint";

export const CREATEFEELING: ApiCall<
  { FeelingReq: CreateFeelingReq; token: string },
  { data: CreateFeelingRes }
> = async (body) => {
  const res = await fetch(API_URL + `react/create-reaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.FeelingReq),
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

export const UPDATEFEELING: ApiCall<
  { FeelingReq: UpdateFeelingReq; token: string },
  { data: CreateFeelingRes | { message: string } }
> = async (body) => {
  const res = await fetch(API_URL + `react/update-reaction`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.FeelingReq),
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