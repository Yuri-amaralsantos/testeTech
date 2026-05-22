import type { CartItem as CartItemType } from "../../../shared/types/domain";
import { formatMoney } from "../../../shared/utils/money";

type Props = {
  item: CartItemType;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onUpdate: () => void;
  onRemove: () => void;
};

export function CartItem({
  item,
  quantity,
  onQuantityChange,
  onUpdate,
  onRemove,
}: Props) {
  return (
    <div className="cart-item">
      <div className="cart-item-main">
        <div className="cart-item-title-row">
          <h4>{item.name}</h4>
          <span className="cart-item-chip">Em estoque</span>
        </div>

        <div className="cart-item-meta">
          <small>Unitário: {formatMoney(item.price)}</small>
          <small>Subtotal: {formatMoney(item.subtotal)}</small>
        </div>
      </div>

      <div className="item-actions">
        <label className="quantity-control">
          <span>Qtd.</span>
          <input
            type="number"
            min={0}
            max={100}
            value={quantity}
            onChange={(event) => onQuantityChange(Number(event.target.value))}
          />
        </label>
        <button type="button" onClick={onUpdate}>
          Atualizar
        </button>
        <button type="button" className="ghost" onClick={onRemove}>
          Remover
        </button>
      </div>
    </div>
  );
}
