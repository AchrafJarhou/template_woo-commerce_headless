import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">Chargement des produits...</p>
    </div>
  );
}
