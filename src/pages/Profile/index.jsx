import { UserInfo } from './components/UserInfo';
import { AddressSection } from './components/AddressSection';
import { OrdersList } from './components/OrdersList';
import { DangerZone } from './components/DangerZone';
import { mockUser, mockBilling, mockShipping, mockOrders } from './mockData';
import './index.scss';

export default function Profile() {
  return (
    <div className="profile">
      <h1 className="profile__title">Mon Profil</h1>
      <UserInfo user={mockUser} />
      <AddressSection title="Adresse de Facturation" address={mockBilling} />
      <AddressSection title="Adresse de Livraison" address={mockShipping} />
      <OrdersList orders={mockOrders} />
      <DangerZone />
    </div>
  );
}
