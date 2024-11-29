export interface OrderRatingReq {
  productItemId: string;
  starRating: number;
  comment: string;
}

export interface ProductRating {
  id: string;
  author: {
    id: string;
    name: string;
    attachment: string;
  },
  productItem: {
    productItemId: string;
    productItemName: string;
  }
  rating: number;
  comment?: string;
  createdAt: Date;
}