import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../slices/toastSlice";
import { emptyCartThunk } from "../../thunkActionsCreator/cartThunks";

export default function Success() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(showToast(`Commande n°${orderId} confirmée`));
  }, [orderId, dispatch]);

  return (
    <div className="success-page">
      <h1>Commande confirmée</h1>
      <p>Merci pour votre commande n°{orderId} !</p>
    </div>
  );
}
