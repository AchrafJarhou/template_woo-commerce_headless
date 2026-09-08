import { OrderSummary } from "./components/OrderSummaryA";
import { AddressForm } from "./components/AddressForm";
import { PaymentForm } from "./components/PaymentForm";
import {
  mockCartItems,
  mockCartTotals,
  mockShippingAddress,
  mockBillingAddress,
} from "./mockData";
import "./index.scss";

export default function Payment() {
  return (
    <div className="payment">
      <h1 className="payment__title">Passer la commande</h1>

      <div className="payment__container">
        {/* Section Gauche: Informations */}
        <div className="payment__left">
          <section className="payment__card">
            <AddressForm
              title="Adresse de Livraison"
              address={mockShippingAddress}
              type="shipping"
            />
          </section>

          <section className="payment__card">
            <AddressForm
              title="Adresse de Facturation"
              address={mockBillingAddress}
              type="billing"
            />
          </section>
        </div>

        {/* Section Droite: Paiement + Résumé */}
        <div className="payment__right">
          <section className="payment__card">
            <PaymentForm total={mockCartTotals.total} />
          </section>

          <section className="payment__card">
            <OrderSummary items={mockCartItems} totals={mockCartTotals} />
          </section>
        </div>
      </div>
    </div>
  );
}
