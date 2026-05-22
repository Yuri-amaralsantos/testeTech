import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CheckoutFormValues } from "../schemas/checkoutSchema";
import { finalizeCheckout } from "../api/finalizeCheckout";

export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CheckoutFormValues) => finalizeCheckout(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
