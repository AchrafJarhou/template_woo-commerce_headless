import "./Spinner.css";

export default function Spinner({ text = "Chargement des produits...", fullscreen = false }) {
  return (
    <div className={`spinner-container ${fullscreen ? "spinner-fullscreen" : ""}`}>
      <div className="spinner"></div>
      <p className="spinner-text">{text}</p>
    </div>
  );
}
