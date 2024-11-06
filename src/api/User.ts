import { UserAddress, UserAddressReq, UserAddressSetDefault, UserProfilePage } from "@/interface/user";
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

export const GETUSERADDRESS: ApiCall<
  { token: string },
  {
    data: UserAddress[];
  }
> = async (body) => {
  const res = await fetch(API_URL + `user/addresses/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    }
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

export const SETDEFAULTADDRESS: ApiCall<
  { addressId: string, token: string },
  {
    data: UserAddressSetDefault;
  }
> = async (body) => {
  const res = await fetch(API_URL + `user/address/default/${body.addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    }
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

export const CHANGEORDERADDRESS: ApiCall<
  { orderId: string; addressId: string; token: string },
  {
    data: UserAddress;
  }
> = async (body) => {
  const res = await fetch(API_URL + `order/${body.orderId}/address/${body.addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    }
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

export const UPDATEADDRESS: ApiCall<
  { userAddress: UserAddressReq; addressId: string; token: string },
  {
    data: UserAddress;
  }
> = async (body) => {
  const res = await fetch(API_URL + `user/address/${body.addressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.userAddress),
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

export const CREATEADDRESS: ApiCall<
  { userAddress: UserAddressReq; token: string },
  {
    data: UserAddress;
  }
> = async (body) => {
  const res = await fetch(API_URL + `user/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + body.token,
    },
    body: JSON.stringify(body.userAddress),
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

export const DELETEADDRESS: ApiCall<
  { addressId: string; token: string },
  {
    data: { message: string };
  }
> = async (body) => {
  const res = await fetch(API_URL + `user/address/${body.addressId}`, {
    method: "DELETE",
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