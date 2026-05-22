import { useQuery } from "@tanstack/react-query";
import { getCart } from "../api/getCart";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
}
