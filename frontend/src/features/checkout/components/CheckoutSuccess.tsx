import { formatMoney } from "../../../shared/utils/money";

type Props = {
  saleId: number;
  total: number;
};

export function CheckoutSuccess({ saleId, total }: Props) {
  return (
    <p className="success">
      Pedido #{saleId} confirmado. Total: {formatMoney(total)}
    </p>
  );
}
