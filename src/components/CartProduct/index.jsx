import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import "./index.scss";

export function CartProduct({ item }) {
  const urlParts = item.permalink.split("/");
  const slug = urlParts[urlParts.length - 2];

  const atMinimum = item.quantity <= item.quantity_limits.minimum;
  const atMaximum = item.quantity >= item.quantity_limits.maximum;

  return (
    <li className="cart-product">
      <Link to={`/product/${slug}`} className="cart-product__media">
        <img
          className="cart-product__thumbnail"
          src={item.images?.[0]?.thumbnail}
          alt={item.images?.[0]?.alt || item.name}
        />
      </Link>

      <div className="cart-product__body">
        <Link to={`/product/${slug}`} className="cart-product__name">
          {item.name}
        </Link>

        {item.variation.length > 0 && (
          <p className="cart-product__variation">
            {item.variation
              .map((detail) => `${detail.attribute} : ${detail.value}`)
              .join(" · ")}
          </p>
        )}

        <div className="cart-product__quantity">
          <span className="cart-product__quantity-label">Qté</span>
          <button
            type="button"
            className="cart-product__step"
            disabled={atMinimum}
            aria-label={`Retirer un ${item.name}`}
          >
            −
          </button>
          <span className="cart-product__quantity-value">{item.quantity}</span>
          <button
            type="button"
            className="cart-product__step"
            disabled={atMaximum}
            aria-label={`Ajouter un ${item.name}`}
          >
            +
          </button>
        </div>
      </div>

      <p className="cart-product__price">
        {formatPrice(item.totals.line_total, item.totals)}
      </p>
    </li>
  );
}
