import { DeletePostReq, Post } from "@/interface/post";
import { API_URL } from "./Endpoint";

export const NEWSFEED: ApiCall<
  { PageSize: number; lastPostId: string; loadedPosts: number; token: string },
  { data: Post[] }
> = async (body) => {
  const res = await fetch(
    API_URL + `posts/news-feed?PageSize=${body.PageSize}&lastPostId=${body.lastPostId}&loadedPosts=${body.loadedPosts}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token,
      },
    }
  );

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok, // Kiểm tra trạng thái 2xx
      res: res.ok ? data : null, // Chỉ trả về dữ liệu nếu thành công
      statusCode: res.status, // Mã trạng thái HTTP
    };
  } catch (error) {
    // Lỗi khi không thể parse JSON hoặc lỗi mạng
    return {
      isSuccess: false,
      res: null,
      statusCode: res.status,
    };
  }
};

export const GETPOST: ApiCall<
  { postId: string, token: string },
  { data: Post }
> = async (body) => {
  const res = await fetch(
    API_URL + `posts/${body.postId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token,
      },
    }
  );

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok, // Kiểm tra trạng thái 2xx
      res: res.ok ? data : null, // Chỉ trả về dữ liệu nếu thành công
      statusCode: res.status, // Mã trạng thái HTTP
    };
  } catch (error) {
    // Lỗi khi không thể parse JSON hoặc lỗi mạng
    return {
      isSuccess: false,
      res: null,
      statusCode: res.status,
    };
  }
};

export const CREATEPOST: ApiCall<
  { CreateReq: FormData; token: string },
  { data: Post }
> = async (body) => {
  const res = await fetch(API_URL + `posts/create-post`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + body.token,
    },
    body: body.CreateReq,
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
      statusCode: 500, // Mã trạng thái lỗi mạng
    };
  }
};

export const UPDATEPOST: ApiCall<
  { CreateReq: FormData; token: string },
  { data: Post }
> = async (body) => {
  const res = await fetch(API_URL + `posts/update-post`, {
    method: "PUT",
    headers: {
      "Authorization": "Bearer " + body.token,
    },
    body: body.CreateReq,
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
      statusCode: 500, // Mã trạng thái lỗi mạng
    };
  }
};

export const DELETEPOST: ApiCall<
  { DeleteReq: DeletePostReq; token: string },
  { message: string }
> = async (body) => {
  const res = await fetch(API_URL + `posts/delete-post`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.DeleteReq),
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
      statusCode: 500, // Mã trạng thái lỗi mạng
    };
  }
};

export const GETUSERPOST: ApiCall<
  { userId: string, PageSize: number, lastPostId: string, token: string },
  { data: Post[] }
> = async (body) => {
  const res = await fetch(
    API_URL + `posts/users/${body.userId}?PageSize=${body.PageSize}&lastPostId=${body.lastPostId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + body.token,
      },
    }
  );

  try {
    const data = await res.json();

    return {
      isSuccess: res.ok, // Kiểm tra trạng thái 2xx
      res: res.ok ? data : null, // Chỉ trả về dữ liệu nếu thành công
      statusCode: res.status, // Mã trạng thái HTTP
    };
  } catch (error) {
    // Lỗi khi không thể parse JSON hoặc lỗi mạng
    return {
      isSuccess: false,
      res: null,
      statusCode: res.status,
    };
  }
};