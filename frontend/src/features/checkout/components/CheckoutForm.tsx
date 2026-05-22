import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "../schemas/checkoutSchema";

type Props = {
  onSubmit: (values: CheckoutFormValues) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
  successMessage?: string;
};

export function CheckoutForm({
  onSubmit,
  isSubmitting,
  errorMessage,
  successMessage,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { email: "" },
  });

  const submit = (values: CheckoutFormValues) => {
    onSubmit(values);
    reset({ email: "" });
  };

  return (
    <div className="checkout-form-wrap">
      <div className="checkout-title-block">
        <p className="section-label">pagamento seguro</p>
        <h3>Finalize sua compra</h3>
        <p>Informe seu e-mail para receber a confirmação do pedido.</p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="checkout-form">
        <label htmlFor="email">E-mail para confirmação</label>
        <input
          id="email"
          type="email"
          placeholder="voce@exemplo.com"
          {...register("email")}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
        <button type="submit" disabled={isSubmitting}>
          Finalizar compra
        </button>
      </form>

      <div className="checkout-trust-row">
        <span>Compra protegida</span>
        <span>Entrega rápida</span>
        <span>Confirmação por e-mail</span>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
}
