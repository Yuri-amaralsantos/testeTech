"use client";

import Image from "next/image";
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
      <div className="product-image-wrap">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="product-image"
        />
      </div>

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
