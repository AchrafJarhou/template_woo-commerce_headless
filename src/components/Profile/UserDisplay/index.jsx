import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCurrentUserThunk,
  fetchCurrentCustomerThunk,
} from "../../../thunkActionsCreator/userThunks";

import { BillingUpdate, ShippingUpdate } from "../CustomerUpdate";

export function UserDisplay() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(fetchCurrentUserThunk());
  }, [dispatch]);
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>Aucun profil.</p>;

  return (
    <div>
      <p>Nom d'utilisateur : {profile.username}</p>
      <p>Email : {profile.email}</p>
      <p>Prénom : {profile.firstName}</p>
      <p>Nom : {profile.lastName}</p>
    </div>
  );
}

export function CustomerDisplay() {
  const customer = useSelector((state) => state.user.customer);
  const billing = customer?.billing;
  const shipping = customer?.shipping;
  if (!customer) return <p>Chargement...</p>;
  return (
    <div>
      <h2>Informations de facturation</h2>
      {customer &&
        Object.entries(billing).map(([key, value]) => (
          <p key={key}>
            {key} : {value}
          </p>
        ))}
      <BillingUpdate />
      <h2>Informations de livraison</h2>
      {customer &&
        Object.entries(shipping).map(([key, value]) => (
          <p key={key}>
            {key} : {value}
          </p>
        ))}
      <ShippingUpdate />
    </div>
  );
}
