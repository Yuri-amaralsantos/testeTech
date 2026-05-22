import {
  productCategoryLabels,
  productCategoryOrder,
  type ProductCategory,
} from "../../constants/productCategories";

type Props = {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
};

export function CategoryStrip({ activeCategory, onSelectCategory }: Props) {
  return (
    <nav className="category-strip" aria-label="Categorias em destaque">
      {productCategoryOrder.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-chip ${activeCategory === category ? "category-chip--active" : ""}`}
          onClick={() => onSelectCategory(category)}
        >
          {productCategoryLabels[category]}
        </button>
      ))}
    </nav>
  );
}
