import { apiRequest } from "../../../shared/services/api";

export function updateCart(input: { productId: number; quantity: number }) {
  return apiRequest<{ message: string }>("/carrinho", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
