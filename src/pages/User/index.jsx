import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserThunk } from "../../thunkActionsCreator/userThunks";
import { UpdateForm } from "../../components/Profile/UpdateUser";
export default function Profile() {
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
  console.log(profile);

  return (
    <div>
      <p>Nom d'utilisateur : {profile.username}</p>
      <p>Email : {profile.email}</p>
      <p>Prénom : {profile.firstName}</p>
      <p>Nom : {profile.lastName}</p>
      <UpdateForm />
    </div>
  );
}
