export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type CartItem = {
  productId: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type CartResponse = {
  items: CartItem[];
  total: number;
};
