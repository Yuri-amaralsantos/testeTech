import { apiRequest } from "../../../shared/services/api";
import type { CartResponse } from "../../../shared/types/domain";

export function getCart() {
  return apiRequest<CartResponse>("/carrinho");
}
