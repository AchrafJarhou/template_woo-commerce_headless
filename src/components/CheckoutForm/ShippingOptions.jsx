export default function ShippingOptions({ options, selectedMethod, onSelect }) {
  return (
    <>
      <h3>Mode de livraison</h3>
      <div className="form-group shipping-methods">
        {options.map((option) => (
          <label key={option.id} className="shipping-option">
            <div>
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={selectedMethod?.id === option.id}
                onChange={() => onSelect(option)}
              />
              {option.name}
            </div>
            <span>{option.price.toFixed(2).replace(".", ",")} €</span>
          </label>
        ))}
      </div>
    </>
  );
}
