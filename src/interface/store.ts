export interface ListProduct {
  id: string;
  name: string;
  attachments: {
    id: string;
    attachment: string;
  }[];
  price: number;
  totalSales: number;
}

export interface Product {
  id: string;
  name: string;
  totalSales: number;
  author: {
    id: string;
    name: string;
    description: string;
  }
  attachments: {
    id: string;
    attachment: string;
  }[];
  petStoreProductItems: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  category: {
    id: string;
    name: string;
    parentCategory: {
      id: string;
      name: string;
    }
  }
}