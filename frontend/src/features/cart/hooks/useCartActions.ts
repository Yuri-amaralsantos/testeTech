import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api/addToCart";
import { updateCart } from "../api/updateCart";

export function useCartActions() {
  const queryClient = useQueryClient();

  const refreshCart = () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: refreshCart,
  });

  const updateMutation = useMutation({
    mutationFn: updateCart,
    onSuccess: refreshCart,
  });

  return {
    addToCart: addMutation.mutate,
    addToCartAsync: addMutation.mutateAsync,
    updateCart: updateMutation.mutate,
    updateCartAsync: updateMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    addError: addMutation.error,
    updateError: updateMutation.error,
  };
}
