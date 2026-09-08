import { useState } from 'react';

export function PaymentForm({ total }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Paiement traité avec succès (demo)');
    }, 2000);
  };

  return (
    <div className="payment__form-section">
      <h3 className="payment__section-title">Paiement Sécurisé</h3>
      <form onSubmit={handleSubmit} className="payment__form">
        <div className="payment__form-group">
          <label className="payment__label">Numéro de carte</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
            className="payment__input"
            maxLength="19"
          />
          <p className="payment__form-hint">Connecté à Stripe (WordPress)</p>
        </div>

        <div className="payment__form-row">
          <div className="payment__form-group">
            <label className="payment__label">Date d'expiration</label>
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
            <label className="payment__label">CVC</label>
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
          <p>🔒 Vos données sont sécurisées et chiffrées par Stripe</p>
        </div>

        <button
          type="submit"
          disabled={loading || !cardNumber || !expiryDate || !cvc}
          className="payment__button payment__button--primary payment__button--full"
        >
          {loading ? 'Traitement...' : `Payer ${total}`}
        </button>
      </form>
    </div>
  );
}
