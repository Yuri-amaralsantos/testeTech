import { apiRequest } from "../../../shared/services/api";

export function addToCart(productId: number) {
  return apiRequest<{ message: string }>("/carrinho", {
    method: "POST",
    body: JSON.stringify({ productId, quantity: 1 }),
  });
}
