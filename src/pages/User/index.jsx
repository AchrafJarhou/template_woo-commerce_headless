import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import DeleteAccountButton from "../../components/DeleteAccountButton";
import {
  UserDisplay,
  CustomerDisplay,
} from "../../components/Profile/UserDisplay";

export default function Profile() {
  const dispatch = useDispatch();
  const isAuthentificated = !!useSelector((state) => state.user?.token);
  if (isAuthentificated) {
    return (
      <div>
        <UserDisplay />
        <CustomerDisplay />
        <DeleteAccountButton />
      </div>
    );
  } else {
    return (
      <div>
        <p>
          Aucun profil trouvé, si vous n'êtes pas connecté vous pouvez toujours
          vous <Link to="/login">connecter/inscrire</Link> ici
        </p>
      </div>
    );
  }
}
