import type { Product } from "../../../shared/types/domain";
import { formatMoney } from "../../../shared/utils/money";

type Props = {
  product: Product;
  onAdd: (id: number) => void;
};

export function ProductCard({ product, onAdd }: Props) {
  return (
    <article className="product-card">
      <span className="deal-chip">Oferta</span>
      <img src={product.imageUrl} alt={product.name} />

      <div className="product-content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="price-stack">
          <small>ou em 10x sem juros</small>
          <strong>{formatMoney(product.price)}</strong>
        </div>
      </div>

      <div className="product-footer">
        <span className="shipping-pill">Frete grátis</span>
        <button type="button" onClick={() => onAdd(product.id)}>
          Adicionar
        </button>
      </div>
    </article>
  );
}
