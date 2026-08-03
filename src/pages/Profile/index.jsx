import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteAccountButton from "../../components/DeleteAccountButton";
import { UserDisplay, CustomerDisplay } from "../../components/UserDisplay";
import { OrderAll } from "../../components/OrderDetails";
import { useEffect } from "react";

export default function Profile() {
  const isAuthentificated = useSelector((state) => state.user?.token);
  useEffect(() => {
    !isAuthentificated && navigate("/catalogue", { replace: true });
  }, [isAuthentificated]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (isAuthentificated) {
    return (
      <div>
        <UserDisplay />
        <CustomerDisplay />
        <OrderAll />
        <DeleteAccountButton />
      </div>
    );
  }
}
