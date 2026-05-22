import { apiRequest } from "../../../shared/services/api";
import type { CheckoutFormValues } from "../schemas/checkoutSchema";

export function finalizeCheckout(values: CheckoutFormValues) {
  return apiRequest<{ message: string; saleId: number; total: number }>(
    "/finalizar-compra",
    {
      method: "POST",
      body: JSON.stringify(values),
    },
  );
}
