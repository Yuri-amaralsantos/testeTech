type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cartItemCount: number;
  onCartToggle: () => void;
  isCartOpen: boolean;
};

export function Topbar({
  searchTerm,
  onSearchChange,
  cartItemCount,
  onCartToggle,
  isCartOpen,
}: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">TV</span>
        <div>
          <strong>tecnovarejo</strong>
          <small>ofertas, frete e checkout</small>
        </div>
      </div>

      <label className="searchbox" htmlFor="search">
        <input
          id="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Procure notebook, fone, monitor..."
        />
      </label>

      <div className="topbar-actions">
        <div>
          <small>Parcelamento</small>
          <strong>em até 12x</strong>
        </div>
        <div>
          <small>Frete</small>
          <strong>grátis acima de R$ 199</strong>
        </div>
        <button type="button" className="cart-launcher" onClick={onCartToggle}>
          <span className="cart-launcher-icon">🛒</span>
          <span>
            <small>{isCartOpen ? "fechar" : "abrir"} carrinho</small>
            <strong>{cartItemCount} item(ns)</strong>
          </span>
        </button>
      </div>
    </header>
  );
}
