import { Link } from "react-router-dom";
import { CartProduct } from "../CartProduct";
import { formatPrice } from "../../utils/formatPrice";
import { MOCK_CART_ITEMS, MOCK_CART_TOTALS } from "./mockCart";

export default function Cart() {
  const items = MOCK_CART_ITEMS;
  const totals = MOCK_CART_TOTALS;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const countLabel = `${itemCount} article${itemCount > 1 ? "s" : ""}`;

  if (items.length === 0) {
    return (
      <section className="cart cart--empty">
        <h1 className="cart__title">Votre panier</h1>
        <p className="cart__empty-message">Votre panier est vide.</p>
        <Link to="/catalogue" className="cart__continue">
          Continuer mon shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="cart">
      <div className="cart__main">
        <h1 className="cart__title">Votre panier</h1>

        <ul className="cart__list">
          {items.map((item) => (
            <CartProduct key={item.key} item={item} />
          ))}
        </ul>

        <p className="cart__subtotal">
          Sous-total ({countLabel}) :{" "}
          <strong>{formatPrice(totals.total_items, totals)}</strong>
        </p>

        <Link to="/catalogue" className="cart__continue">
          Continuer mon shopping
        </Link>
      </div>

      <aside className="cart__aside">
        <dl className="cart__summary">
          <div className="cart__summary-row">
            <dt>Sous-total ({countLabel})</dt>
            <dd>{formatPrice(totals.total_items, totals)}</dd>
          </div>

          <div className="cart__summary-row">
            <dt>Livraison</dt>
            <dd>Calculée à l'étape suivante</dd>
          </div>

          <div className="cart__summary-row">
            <dt>Taxes</dt>
            <dd>{formatPrice(totals.total_tax, totals)}</dd>
          </div>

          <div className="cart__summary-row cart__summary-row--total">
            <dt>Total</dt>
            <dd>{formatPrice(totals.total_price, totals)}</dd>
          </div>
        </dl>

        <Link to="/commande" className="cart__checkout">
          Passer la commande
        </Link>
      </aside>
    </section>
  );
}
