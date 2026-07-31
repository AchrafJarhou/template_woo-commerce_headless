import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../slices/toastSlice";
import OrderDetails from "../../components/OrderDetails";

export default function Success() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.user);

  const order = orders.find(
    (item) => String(item.id) === orderId || String(item.number) === orderId,
  );

  useEffect(() => {
    dispatch(showToast(`Commande n°${orderId} confirmée`));
  }, [orderId, dispatch]);

  return (
    <div className="success-page">
      <h1>Commande confirmée</h1>
      <p className="thank-you">Merci pour votre commande.</p>
      {order ? <OrderDetails order={order} /> : <p>regardes tes mails</p>}
    </div>
  );
}
