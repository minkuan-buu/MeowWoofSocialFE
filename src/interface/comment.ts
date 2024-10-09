export interface CreateCommentRes {
    id: string;
    content: string;
    attachment?: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    createdAt: Date;
    updatedAt?: Date;
}