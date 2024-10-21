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
  }[],
  follower: {
    id: string;
    name: string;
    avatar: string;
  }[];
};