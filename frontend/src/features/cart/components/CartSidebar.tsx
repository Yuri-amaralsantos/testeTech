"use client";

import type { CartResponse } from "../../../shared/types/domain";
import { formatMoney } from "../../../shared/utils/money";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

type Props = {
  cart: CartResponse | undefined;
  quantities: Record<number, number>;
  onQuantityChange: (productId: number, value: number) => void;
  onUpdate: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  errorMessage?: string;
};

export function CartSidebar({
  cart,
  quantities,
  onQuantityChange,
  onUpdate,
  onRemove,
  errorMessage,
}: Props) {
  const freightValue = cart && cart.total >= 199 ? 0 : 29.9;
  const orderTotal = (cart?.total ?? 0) + freightValue;

  return (
    <div className="cart-shell">
      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="cart-list">
        {cart?.items.length ? (
          cart.items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              quantity={quantities[item.productId] ?? item.quantity}
              onQuantityChange={(value) =>
                onQuantityChange(item.productId, value)
              }
              onUpdate={() =>
                onUpdate(
                  item.productId,
                  quantities[item.productId] ?? item.quantity,
                )
              }
              onRemove={() => onRemove(item.productId)}
            />
          ))
        ) : (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">🛒</div>
            <h4>seu carrinho tá vazio</h4>
            <p>
              que tal navegar pelas milhares de ofertas e achar uma especial
              para você?
            </p>
            <button
              type="button"
              className="cart-empty-cta"
              onClick={() =>
                document
                  .getElementById("produtos")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ver produtos
            </button>
          </div>
        )}
      </div>

      <div className="cart-summary-card">
        <CartSummary total={cart?.total ?? 0} />
        <div className="cart-summary-note">
          <span>frete</span>
          <strong>
            {freightValue === 0 ? "Grátis" : formatMoney(freightValue)}
          </strong>
        </div>
        <div className="cart-summary-total">
          <span>total do pedido</span>
          <strong>{formatMoney(orderTotal)}</strong>
        </div>
      </div>
    </div>
  );
}
