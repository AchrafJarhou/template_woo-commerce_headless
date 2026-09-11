import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import {
  incrementProductInCart,
  substractProductFromCart,
  deleteProductFromCart,
} from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";
import "./index.scss";
import { useTranslation } from "react-i18next";

export function CartProduct({ item }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // Chaque réponse renvoie le panier entier : deux requêtes simultanées
  // s'écraseraient l'une l'autre, d'où le gel des commandes pendant l'appel.
  const isSyncing = useSelector((state) => state.cart.isSyncing);

  const urlParts = item.permalink.split("/");
  const slug = urlParts[urlParts.length - 2];

  const atMinimum = item.quantity <= item.quantity_limits.minimum;
  const atMaximum = item.quantity >= item.quantity_limits.maximum;

  const runCartAction = async (thunk, args, fallbackMessage) => {
    const result = await dispatch(thunk(args));

    if (!thunk.fulfilled.match(result)) {
      dispatch(showToast(result.payload || fallbackMessage));
    }
  };

  const handleIncrement = () =>
    runCartAction(
      incrementProductInCart,
      { itemKey: item.key, quantity: item.quantity },
      t("cart.errors.increase"),
    );

  const handleDecrement = () =>
    runCartAction(
      substractProductFromCart,
      { itemKey: item.key, quantity: item.quantity },
      t("cart.errors.decrease"),
    );

  const handleRemove = () =>
    runCartAction(
      deleteProductFromCart,
      { itemKey: item.key },
      t("cart.errors.remove"),
    );

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

        <div className="cart-product__actions">
          <div className="cart-product__quantity">
            <span className="cart-product__quantity-label">{t("cart.quantity")}</span>
            <button
              type="button"
              className="cart-product__step"
              disabled={atMinimum || isSyncing}
              aria-label={t("cart.decreaseOne", { name: item.name })}
              onClick={handleDecrement}
            >
              −
            </button>
            <span className="cart-product__quantity-value">
              {item.quantity}
            </span>
            <button
              type="button"
              className="cart-product__step"
              disabled={atMaximum || isSyncing}
              aria-label={t("cart.increaseOne", { name: item.name })}
              onClick={handleIncrement}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="cart-product__remove"
            disabled={isSyncing}
            aria-label={t("cart.removeFromCart", { name: item.name })}
            onClick={handleRemove}
          >
            {t("cart.remove")}
          </button>
        </div>
      </div>

      <p className="cart-product__price">
        {formatPrice(item.totals.line_total, item.totals)}
      </p>
    </li>
  );
}
