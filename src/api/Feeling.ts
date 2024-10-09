
import { CreateFeelingReq, CreateFeelingRes } from "@/interface/feeling";
import { API_URL } from "./Endpoint";

export const CREATEFEELING: ApiCall<
  { FeelingReq: CreateFeelingReq, token: string },
  {
    data: CreateFeelingRes;
  }
> = async (body) => {
  try {
    const res = await fetch(API_URL + `react/create-reaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token
      },
      body: JSON.stringify(body.FeelingReq),
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
