import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CartProduct } from "../CartProduct";
import {
  emptyCartThunk,
  applyCouponThunk,
  removeCouponThunk,
} from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";
import StripeWrapper from "../StripeWrapper";

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);
  const coupons = useSelector((state) => state.cart.coupons);
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");

  const emptyCart = () => {
    dispatch(emptyCartThunk());
  };

  const applyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const result = await dispatch(applyCouponThunk({ code: couponCode }));
    if (applyCouponThunk.fulfilled.match(result)) {
      dispatch(showToast("Code promo appliqué"));
      setCouponCode("");
    } else {
      dispatch(showToast(result.payload || "Code promo invalide"));
    }
  };

  const removeCoupon = (code) => {
    dispatch(removeCouponThunk({ code }));
  };

  return (
    <>
      <div>Votre Panier</div>
      <ul>
        {items.map((item) => (
          <CartProduct key={item.key} item={item} />
        ))}
      </ul>

      <form onSubmit={applyCoupon}>
        <input
          type="text"
          placeholder="Code promo"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button type="submit">Appliquer</button>
      </form>

      {coupons.length > 0 && (
        <ul>
          {coupons.map((coupon) => (
            <li key={coupon.code}>
              {coupon.code}
              <button onClick={() => removeCoupon(coupon.code)}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      {totals && parseInt(totals.total_discount) > 0 && (
        <div>
          Réduction: -
          {(parseInt(totals.total_discount) / 100).toFixed(2) +
            totals.currency_suffix}
        </div>
      )}

      <div>
        Total:{" "}
        {totals &&
          (parseInt(totals.total_price) / 100).toFixed(2) +
            totals.currency_suffix}
      </div>
      <button onClick={() => emptyCart()}>Vider Panier</button>
      <StripeWrapper></StripeWrapper>
    </>
  );
}
