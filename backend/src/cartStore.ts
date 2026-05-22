import { Product } from "./entities/Product.js";

export type CartMap = Map<number, number>;

const cart: CartMap = new Map();

export function addToCart(productId: number, quantity: number): void {
  const current = cart.get(productId) ?? 0;
  cart.set(productId, current + quantity);
}

export function updateCart(productId: number, quantity: number): void {
  if (quantity <= 0) {
    cart.delete(productId);
    return;
  }
  cart.set(productId, quantity);
}

export function clearCart(): void {
  cart.clear();
}

export async function buildCartDetails(
  findProductById: (id: number) => Promise<Product | null>,
): Promise<Array<{ product: Product; quantity: number; subtotal: number }>> {
  const details: Array<{
    product: Product;
    quantity: number;
    subtotal: number;
  }> = [];

  for (const [productId, quantity] of cart.entries()) {
    const product = await findProductById(productId);
    if (!product) {
      continue;
    }

    details.push({
      product,
      quantity,
      subtotal: Number((product.price * quantity).toFixed(2)),
    });
  }

  return details;
}

export function isCartEmpty(): boolean {
  return cart.size === 0;
}
