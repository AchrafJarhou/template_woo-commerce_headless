import { CartProduct } from "../CartProduct";
import { formatPrice } from "../../utils/formatPrice";
import { MOCK_CART_ITEMS, MOCK_CART_TOTALS } from "./mockCart";

export default function Cart() {
  const items = MOCK_CART_ITEMS;
  const totals = MOCK_CART_TOTALS;

  if (items.length === 0) {
    return (
      <section className="cart cart--empty">
        <p className="cart__empty-message">Votre panier est vide.</p>
      </section>
    );
  }

  return (
    <section className="cart">
      <ul className="cart__list">
        {items.map((item) => (
          <CartProduct key={item.key} item={item} />
        ))}
      </ul>

      <dl className="cart__summary">
        <div className="cart__summary-row">
          <dt>Sous-total</dt>
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
    </section>
  );
}
