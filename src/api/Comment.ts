import { CreateComment } from "@/interface/comment";
import { API_URL } from "./Endpoint";

export const CREATECOMMENT: ApiCall<
  { CommentReq: FormData, token: string },
  {
    data: CreateComment;
  }
> = async (body) => {
  try {
    const res = await fetch(API_URL + `comment/create-comment`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + body.token
      },
      body: body.CommentReq
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
