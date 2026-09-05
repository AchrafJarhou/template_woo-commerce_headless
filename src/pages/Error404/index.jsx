import { Link } from 'react-router-dom';
import './index.css';

export default function Error404() {
  return (
    <div className="error-404-container">
      <div className="error-404-content">
        <div className="error-404-illustration">
          <div className="error-404-number">404</div>
          <div className="error-404-icon">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.1" />
              <path d="M 70 120 Q 100 150 130 120" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="80" r="8" fill="currentColor" opacity="0.6" />
              <circle cx="120" cy="80" r="8" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        </div>

        <div className="error-404-text">
          <h1>Oups ! Page non trouvée</h1>
          <p>Désolé, la page que vous recherchez n'existe pas ou a été supprimée.</p>
        </div>

        <div className="error-404-actions">
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            Continuer vos achats
          </Link>
        </div>

        <div className="error-404-suggestions">
          <h3>Suggestions</h3>
          <ul>
            <li><Link to="/">Parcourir notre catalogue</Link></li>
            <li><Link to="/contact">Nous contacter</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}