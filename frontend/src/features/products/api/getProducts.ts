import { apiRequest } from "../../../shared/services/api";
import type { Product } from "../../../shared/types/domain";

export function getProducts() {
  return apiRequest<Product[]>("/produtos");
}
