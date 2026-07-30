import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DeleteAccountButton from "../../components/DeleteAccountButton";
import {
  UserDisplay,
  CustomerDisplay,
} from "../../components/Profile/UserDisplay";

export default function Profile() {
  const dispatch = useDispatch();
  const isAuthentificated = !!useSelector((state) => state.user?.token);
  const navigate = useNavigate();
  if (isAuthentificated) {
    return (
      <div>
        <UserDisplay />
        <CustomerDisplay />
        <DeleteAccountButton />
      </div>
    );
  } else {
    useEffect(() => {
      navigate("/catalogue", { replace: true });
    });
  }
}
