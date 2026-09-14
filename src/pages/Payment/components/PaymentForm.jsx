import { useState } from 'react';
import { useTranslation } from "react-i18next";

export function PaymentForm({ total }) {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(t("payment.demoSuccess"));
    }, 2000);
  };

  return (
    <div className="payment__form-section">
      <h3 className="payment__section-title">{t("payment.secure")}</h3>
      <form onSubmit={handleSubmit} className="payment__form">
        <div className="payment__form-group">
          <label className="payment__label">{t("payment.cardNumber")}</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
            className="payment__input"
            maxLength="19"
          />
          <p className="payment__form-hint">{t("payment.stripeLinked")}</p>
        </div>

        <div className="payment__form-row">
          <div className="payment__form-group">
            <label className="payment__label">{t("payment.expiry")}</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value.slice(0, 5))}
              className="payment__input"
              maxLength="5"
            />
          </div>
          <div className="payment__form-group">
            <label className="payment__label">{t("payment.cvc")}</label>
            <input
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.slice(0, 4))}
              className="payment__input"
              maxLength="4"
            />
          </div>
        </div>

        <div className="payment__security-info">
          <p>{t("payment.reassurance")}</p>
        </div>

        <button
          type="submit"
          disabled={loading || !cardNumber || !expiryDate || !cvc}
          className="payment__button payment__button--primary payment__button--full"
        >
          {loading ? t("payment.processing") : t("payment.pay", { amount: total })}
        </button>
      </form>
    </div>
  );
}
