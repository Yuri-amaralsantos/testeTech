import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
