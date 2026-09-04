import "./Footer.css";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../slices/authModalSlice";

export default function Footer() {
  const dispatch = useDispatch();
  const isAuthentificated = !!useSelector((state) => state.user?.token);

  return (
    <footer className="footer">
      <div className="footer_grid">
        <div className="footer_col">
          <ul className="footer_links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/panier">Panier</Link></li>
            {!isAuthentificated && (
              <li>
                <button
                  type="button"
                  className="footer_link-button"
                  onClick={() => dispatch(openAuthModal("login"))}
                >
                  Se connecter
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="footer_col">
          <ul className="footer_links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/a-propos">À Propos</Link></li>
            <li><Link to="/cgu">Conditions générales d'utilisation</Link></li>
            <li><Link to="/cgv">Conditions générales de vente</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/contact">Nous contacter</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}