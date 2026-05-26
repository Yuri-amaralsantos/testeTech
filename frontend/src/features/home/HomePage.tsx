"use client";

import { useEffect, useMemo, useState } from "react";
import { HeroBanner } from "../../shared/components/layout/HeroBanner";
import { CategoryStrip } from "../../shared/components/layout/CategoryStrip";
import { PageContainer } from "../../shared/components/layout/PageContainer";
import { Topbar } from "../../shared/components/layout/Topbar";
import { ProductGrid } from "../products/components/ProductGrid";
import { useProducts } from "../products/hooks/useProducts";
import { useCart } from "../cart/hooks/useCart";
import { useCartActions } from "../cart/hooks/useCartActions";
import { CartSidebar } from "../cart/components/CartSidebar";
import { CheckoutForm } from "../checkout/components/CheckoutForm";
import { useCheckout } from "../checkout/hooks/useCheckout";
import type { CheckoutFormValues } from "../checkout/schemas/checkoutSchema";
import {
  productCategoryLabels,
  type ProductCategory,
} from "../../shared/constants/productCategories";

export function HomePage() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");

  const productsQuery = useProducts();
  const cartQuery = useCart();
  const cartActions = useCartActions();
  const checkoutMutation = useCheckout();

  useEffect(() => {
    if (!cartQuery.data) return;

    const next: Record<number, number> = {};
    cartQuery.data.items.forEach((item) => {
      next[item.productId] = item.quantity;
    });
    setQuantities(next);
  }, [cartQuery.data]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const categoryMatch = (productCategory: string) =>
      activeCategory === "all" || productCategory === activeCategory;

    if (!term) {
      return (productsQuery.data ?? []).filter((product) =>
        categoryMatch(product.category),
      );
    }

    return (productsQuery.data ?? []).filter((product) => {
      const searchable = `${product.name} ${product.description}`.toLowerCase();
      return searchable.includes(term) && categoryMatch(product.category);
    });
  }, [activeCategory, productsQuery.data, searchTerm]);

  const handleCheckout = (values: CheckoutFormValues) => {
    checkoutMutation.mutate(values);
  };

  const cartItemCount =
    cartQuery.data?.items.reduce((total, item) => total + item.quantity, 0) ??
    0;

  return (
    <PageContainer>
      <Topbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartItemCount={cartItemCount}
        onCartToggle={() => setIsCartOpen((current) => !current)}
        isCartOpen={isCartOpen}
      />
      <HeroBanner />
      <CategoryStrip
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {isCartOpen && (
        <div className="cart-backdrop" onClick={() => setIsCartOpen(false)} />
      )}

      <main className="content-grid">
        <section className="panel products-panel" id="produtos">
          <div className="panel-head">
            <div>
              <p className="section-label">vitrine em destaque</p>
              <h2>
                {activeCategory === "all"
                  ? "Produtos"
                  : productCategoryLabels[activeCategory]}
              </h2>
              <small className="panel-head-meta">
                {filteredProducts.length} produto(s) encontrado(s)
              </small>
            </div>
            {productsQuery.isLoading && <span>Carregando...</span>}
          </div>

          <div className="active-filter-chip">
            {activeCategory === "all"
              ? "Mostrando todos os departamentos"
              : `Filtrando por ${productCategoryLabels[activeCategory]}`}
          </div>

          {productsQuery.isError && (
            <p className="error">{(productsQuery.error as Error).message}</p>
          )}

          <ProductGrid
            products={filteredProducts}
            onAdd={(productId) => cartActions.addToCart(productId)}
          />
        </section>

        <section
          className={`panel cart-panel ${isCartOpen ? "cart-panel--open" : "cart-panel--closed"}`}
          id="checkout"
          aria-hidden={!isCartOpen}
        >
          <div className="panel-head">
            <div>
              <div className="cart-panel-heading">
                <span className="cart-panel-heading-icon">🛒</span>
                <div>
                  <p className="section-label section-label--drawer">
                    meu carrinho
                  </p>
                  <h2>
                    {cartItemCount > 0
                      ? `${cartItemCount} item(ns)`
                      : "seu carrinho tá vazio"}
                  </h2>
                </div>
              </div>
            </div>
            <div className="cart-panel-actions">
              {cartQuery.isLoading && <span>Atualizando...</span>}
              <button
                type="button"
                className="cart-close"
                onClick={() => setIsCartOpen((current) => !current)}
                aria-expanded={isCartOpen}
                aria-controls="cart-panel-body"
              >
                {isCartOpen ? "✕" : "◀"}
              </button>
            </div>
          </div>

          <div
            className={`cart-panel-scroll ${isCartOpen ? "" : "cart-panel-scroll--hidden"}`}
          >
            <div
              id="cart-panel-body"
              className={`cart-panel-body ${isCartOpen ? "" : "cart-panel-body--hidden"}`}
            >
              <CartSidebar
                cart={cartQuery.data}
                quantities={quantities}
                onQuantityChange={(productId, value) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [productId]: value,
                  }))
                }
                onUpdate={(productId, quantity) =>
                  cartActions.updateCart({ productId, quantity })
                }
                onRemove={(productId) =>
                  cartActions.updateCart({ productId, quantity: 0 })
                }
                errorMessage={
                  cartQuery.isError
                    ? (cartQuery.error as Error).message
                    : undefined
                }
              />
            </div>

            <div
              className={`checkout-panel ${isCartOpen ? "" : "checkout-panel--compact"}`}
            >
              <CheckoutForm
                onSubmit={handleCheckout}
                isSubmitting={checkoutMutation.isPending}
                errorMessage={
                  checkoutMutation.isError
                    ? (checkoutMutation.error as Error).message
                    : undefined
                }
                successMessage={
                  checkoutMutation.data
                    ? `Pedido #${checkoutMutation.data.saleId} confirmado. Total: ${checkoutMutation.data.total.toFixed(2)}`
                    : undefined
                }
              />
            </div>
          </div>
        </section>
      </main>
    </PageContainer>
  );
}