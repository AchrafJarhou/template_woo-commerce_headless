import { UpdateForm } from "../../components/Profile/UpdateUser";
import DeleteAccountButton from "../../components/DeleteAccountButton";
import { UserDisplay } from "../../components/Profile/UserDisplay";
import { CustomerDisplay } from "../../components/Profile/UserDisplay";

export default function Profile() {
  return (
    <div>
      <UserDisplay />
      <UpdateForm />
      <DeleteAccountButton />
      <CustomerDisplay />
    </div>
  );
}
