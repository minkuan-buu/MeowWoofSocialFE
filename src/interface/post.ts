export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  attachments: {
    id: string;
    attachment: string;
  }[];
  hashtags: {
    id: string;
    hashtag: string;
  }[];
  status: string;
  feeling: {
    id: string;
    typeReact: string;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
  comment: {
    id: string;
    content: string;
    attachment?: string; // Optional if comments may not have attachments
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    createdAt: Date;
    updatedAt: Date;
  }[];
  createAt: Date; // Updated field name
  updatedAt: Date;
}
  