export interface CreateFeelingRes {
    id: string;
    typeReact: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
    };
    createdAt: Date;
    updatedAt?: Date;
}

export interface CreateFeelingReq{
    postId: string;
    typeReact: string;
}

export interface UpdateFeelingReq{
    postId: string;
    typeReact?: string;
}

export interface FeelingGUI {
    typeReact: string,
    name: string
}