export interface UserCart {
  storeId: string,
  storeName: string,
  cartItems: {
    cartId: string,
    productItemId: string,
    attachment: string,
    productName: string,
    productItemName: string,
    unitPrice: number,
    quantity: number,
    status: string
  }[]
}

export interface InitialCartOrder {
  cartId: string;
  productItemId: string;
  unitPrice: number;
  quantity: number;
}