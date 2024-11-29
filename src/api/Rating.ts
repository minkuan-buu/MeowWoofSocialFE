import { OrderRatingReq, ProductRating } from "@/interface/rating";
import { API_URL } from "./Endpoint";

export const RATING: ApiCall<
  { ratingReq: OrderRatingReq[]; token: string },
  { data: { message: string } }
> = async (body) => {
  const res = await fetch(API_URL + `rating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.ratingReq),
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

export const GETPRODUCTRATING: ApiCall<
  { id: string; token: string },
  { data: ProductRating[] }
> = async (body) => {
  const res = await fetch(API_URL + `rating/product/${body.id}`, {
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