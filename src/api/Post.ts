import { Post } from "@/interface/post";
import { API_URL } from "./Endpoint";

export const NEWSFEED: ApiCall<
  { PageSize: number; lastPostId: string; token: string },
  {
    data: Post[]
  }
> = async (body) => {
  try {
    const res = await fetch(API_URL + `posts/news-feed?PageSize=${body.PageSize}&lastPostId=${body.lastPostId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token
      },
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

export const CREATEPOST: ApiCall<
  { CreateReq: FormData, token: string },
  {
    data: Post;
  }
> = async (body) => {
  try {
    const res = await fetch(API_URL + `posts/create-post`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + body.token
      },
      body: body.CreateReq
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

