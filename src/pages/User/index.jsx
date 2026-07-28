import { UpdateForm } from "../../components/Profile/UpdateUser";
import DeleteAccountButton from "../../components/DeleteAccountButton";
import {
  UserDisplay,
  CustomerDisplay,
} from "../../components/Profile/UserDisplay";

export default function Profile() {
  return (
    <div>
      <UserDisplay />
      <UpdateForm />
      <CustomerDisplay />
      <DeleteAccountButton />
    </div>
  );
}
