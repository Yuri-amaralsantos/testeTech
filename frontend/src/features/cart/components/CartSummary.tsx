import { formatMoney } from "../../../shared/utils/money";

type Props = {
  total: number;
};

export function CartSummary({ total }: Props) {
  return (
    <div className="checkout-summary">
      <div className="checkout-summary-row">
        <span>Subtotal</span>
        <strong>{formatMoney(total)}</strong>
      </div>

      <div className="checkout-summary-row checkout-summary-highlight">
        <span>Economize no frete</span>
        <strong>Frete grátis acima de R$ 199</strong>
      </div>
    </div>
  );
}
