import { UpdateForm } from "../../components/Profile/UpdateUser";
import DeleteAccountButton from "../../components/DeleteAccountButton";
import {
  UserDisplay,
  CustomerDisplay,
} from "../../components/Profile/UserDisplay";
import { OrderAll } from "../../components/OrderDetails";

export default function Profile() {
  return (
    <div>
      <UserDisplay />
      <UpdateForm />
      <CustomerDisplay />
      <OrderAll />
      <DeleteAccountButton />
    </div>
  );
}
