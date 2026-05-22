import type { Product } from "../../../shared/types/domain";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  onAdd: (id: number) => void;
};

export function ProductGrid({ products, onAdd }: Props) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
