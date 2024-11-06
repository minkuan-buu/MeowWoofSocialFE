export interface CreateOrderReq {
  productItemId: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderDetail {
  id: string;
  refId: string;
  petStores: {
    id: string;
    name: string;
    phone: string;
    orderDetails: {
      id: string;
      attachment: string;
      productName: string;
      productItemName: string;
      quantity: number;
      unitPrice: number;
    }[]
  }[];
  userAddress: {
    id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
  };
  totalPrice: number;
}