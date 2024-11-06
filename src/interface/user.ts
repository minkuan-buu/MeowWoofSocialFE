import exp from "constants";
import { is } from "date-fns/locale";

export interface UserProfilePage {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  isFollow: boolean;
  following: {
    id: string;
    name: string;
    avatar: string;
    isFollow: boolean;
  }[],
  follower: {
    id: string;
    name: string;
    avatar: string;
    isFollow: boolean;
  }[];
};

export interface UserBasicModel {
  id: string;
  name: string;
  avatar: string;
  isFollow: boolean;
};

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface UserAddressSetDefault {
  id: string;
  isDefault: boolean;
  updateAt: Date;
}

export interface UserAddressReq {
  name: string;
  phone: string;
  address: string;
}