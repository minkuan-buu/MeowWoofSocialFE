import { CreateCommentRes } from "@/interface/comment";
import { API_URL } from "./Endpoint";

export const CREATECOMMENT: ApiCall<
  { CommentReq: FormData; token: string },
  { data: CreateCommentRes }
> = async (body) => {
  const res = await fetch(API_URL + `react/create-comment`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + body.token,
    },
    body: body.CommentReq,
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
