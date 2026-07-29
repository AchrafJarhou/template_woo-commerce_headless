import { useSelector, useDispatch } from "react-redux";
import { CartProduct } from "../CartProduct";
import { emptyCartThunk } from "../../thunkActionsCreator/cartThunks";
import StripeWrapper from "../StripeWrapper";

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);
  const dispatch = useDispatch();

  const emptyCart = () => {
    dispatch(emptyCartThunk());
  };

  return (
    <>
      <div>Votre Panier</div>
      <ul>
        {items.map((item) => (
          <CartProduct key={item.key} item={item} />
        ))}
      </ul>
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
