import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProductByIdThunk } from "../../thunkActionsCreator/productsThunks";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";

import Seo from "../Seo";

import "./index.css";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemVariation, setItemVariation] = useState({});

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  // États locaux pour les produits similaires (sans Redux)
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const { list, singleProduct, loadingSingle, errorSingle } = useSelector(
    (state) => state.products,
  );

  const productFromList = list?.data?.find(
    (p) => p.id.toString() === id.toString(),
  );
  const productToDisplay = productFromList || singleProduct;

  useEffect(() => {
    if (id && !productFromList) {
      dispatch(fetchProductByIdThunk(id));
    }
  }, [id]);

  useEffect(() => {
    if (productToDisplay) {
      setActiveImageIndex(0);
    }
  }, [productToDisplay?.id]);
  useEffect(() => {
    if (!productToDisplay?.id) return;

    const fetchSimilarProducts = async () => {
      setLoadingSimilar(true);
      try {
        const baseUrl = `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/products`;
        const categoryId = productToDisplay.categories?.[0]?.id;
        let recommendations = [];

        // --- NIVEAU 1 : Produits de la même catégorie ---
        if (categoryId) {
          const response = await fetch(`${baseUrl}?category=${categoryId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            const data = await response.json();
            recommendations = (Array.isArray(data) ? data : []).filter(
              (p) => p.id.toString() !== productToDisplay.id.toString(),
            );
          }
        }

        // --- NIVEAU 2 : Complément via le store Redux (si disponible) ---
        if (recommendations.length < 3 && list?.data?.length > 0) {
          const reduxExtras = list.data.filter(
            (p) =>
              p.id.toString() !== productToDisplay.id.toString() &&
              !recommendations.some(
                (rec) => rec.id.toString() === p.id.toString(),
              ),
          );

          recommendations = [...recommendations, ...reduxExtras];
        }

        // --- NIVEAU 3 : Secours API global (Si Redux est vide ou insuffisant) ---
        if (recommendations.length < 3) {
          // On demande 10 produits généraux à l'API pour être sûr d'avoir du choix
          const fallbackResponse = await fetch(`${baseUrl}?per_page=10`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const apiExtras = (
              Array.isArray(fallbackData) ? fallbackData : []
            ).filter(
              (p) =>
                p.id.toString() !== productToDisplay.id.toString() &&
                !recommendations.some(
                  (rec) => rec.id.toString() === p.id.toString(),
                ),
            );

            recommendations = [...recommendations, ...apiExtras];
          }
        }

        // 4. Mélange aléatoirement le tableau avant de prendre les 3 premiers
        const randomized = recommendations.sort(() => 0.5 - Math.random());
        setSimilarProducts(randomized.slice(0, 3));
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des recommandations :",
          error.message,
        );
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarProducts();
  }, [productToDisplay?.id, list?.data]);
  const handleAddToCart = async () => {
    if (productToDisplay && productToDisplay.id) {
      const result = await dispatch(
        addProductToCart({
          productId: productToDisplay.id,
          quantity: 1,
          variation: itemVariation,
        }),
      );
      if (addProductToCart.fulfilled.match(result)) {
        dispatch(showToast(`${productToDisplay.name} ajouté au panier`));
      } else {
        dispatch(
          showToast(result.payload || "Erreur lors de l'ajout au panier"),
        );
      }
    }
  };

  function changeVariation(name, value) {
    setItemVariation((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (!productToDisplay || !productToDisplay.attributes) return;

    const defaults = {};

    productToDisplay.attributes.forEach((attribute) => {
      if (attribute.terms.length > 0) {
        defaults[attribute.name] = attribute.terms[0].name;
      }
    });

    setItemVariation(defaults);
  }, [productToDisplay]);

  if (loadingSingle && !productToDisplay) {
    return <div className="loading-state">Chargement en cours...</div>;
  }

  if (errorSingle && !productToDisplay) {
    return <div className="error-state">Erreur : {errorSingle}</div>;
  }

  if (!productToDisplay) {
    return <div className="not-found-state">Aucun produit trouvé.</div>;
  }

  const productImages = productToDisplay.images || [];
  const mainImage = productImages[activeImageIndex]?.src || null;

  return (
    <div className="product-details-page">
      <Seo
        title={productToDisplay.name}
        description={
          productToDisplay.short_description || productToDisplay.description
        }
        image={productToDisplay.images?.[0]?.src}
        url={window.location.href}
        jsonLd={{
          "@context": "https://schema.org/",
          "@type": "Product",
          name: productToDisplay.name,
          description:
            productToDisplay.short_description || productToDisplay.description,
          image: productToDisplay.images?.[0]?.src,
          offers: {
            "@type": "Offer",
            priceCurrency: productToDisplay.prices?.currency_code || "EUR",
            price: productToDisplay.prices?.price
              ? (parseFloat(productToDisplay.prices.price) / 100).toFixed(2)
              : undefined,
            availability:
              productToDisplay.stock_status === "instock"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }}
      />

      <div className="top-navigation-bar">
        <button onClick={() => navigate(-1)}>⬅️ Retour</button>

        <nav className="breadcrumb-trail">
          <Link to="/">🏠 Accueil</Link>
          <span className="separator">/</span>
          <Link to="/catalogue">catalogue</Link>
          <span className="separator">/</span>
          <span className="current-page">{productToDisplay.name}</span>
        </nav>
      </div>

      <div className="product-main-card">
        <div className="product-content-grid">
          <div className="gallery-wrapper">
            {mainImage ? (
              <>
                <div className="main-image-container">
                  <img src={mainImage} alt={productToDisplay.name} />
                </div>

                {productImages.length > 1 && (
                  <div className="thumbnail-list">
                    {productImages.map((img, index) => (
                      <div
                        key={
                          "pictureDetails" + img.id + index ||
                          "pictureDetails" + index
                        }
                        className={`thumbnail-item ${index === activeImageIndex ? "active" : ""}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img
                          src={img.src}
                          alt={`${productToDisplay.name} thumbnail ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image-placeholder">
                Aucune image disponible
              </div>
            )}
          </div>

          <div className="info-wrapper">
            <h1 className="product-title">{productToDisplay.name}</h1>

            <div
              className="short-description"
              dangerouslySetInnerHTML={{
                __html:
                  productToDisplay.short_description ||
                  productToDisplay.description ||
                  "<p>Aucune introduction disponible.</p>",
              }}
            />

            <div className="price-action-card">
              <h3 className="price-text">
                {productToDisplay.prices?.price
                  ? `${(parseFloat(productToDisplay.prices.price) / 100).toFixed(2)} ${productToDisplay.prices.currency_code || "EUR"}`
                  : "Prix non disponible"}
              </h3>

              <div className="actions-row">
                {productToDisplay.attributes?.map((attribute) => (
                  <div key={attribute.name}>
                    <label htmlFor={attribute.name}>{attribute.name}</label>
                    <select
                      name={attribute.name}
                      onChange={(e) =>
                        changeVariation(attribute.name, e.target.value)
                      }
                    >
                      {attribute.terms.map((term) => (
                        <option key={term.name} value={term.name}>
                          {term.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {productToDisplay.is_in_stock ? (
                  <button onClick={handleAddToCart}>
                    🧺 Ajouter au panier
                  </button>
                ) : (
                  <button disabled>Rupture de stock</button>
                )}
                <button title="Ajouter aux favoris">❤️</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section des articles similaires */}
      <section className="similar-products-section">
        <h2>Produits similaires</h2>

        {loadingSimilar ? (
          <p className="loading-text">Chargement des recommandations...</p>
        ) : similarProducts.length > 0 ? (
          <div className="similar-products-grid">
            {similarProducts.map((simProduct) => (
              <Link key={simProduct.id} to={"/product/" + simProduct.slug}>
                <div className="similar-product-image">
                  <img
                    src={simProduct.images?.[0]?.src || "/placeholder.jpg"}
                    alt={simProduct.name}
                  />
                </div>
                <div className="similar-product-info">
                  <h4>{simProduct.name}</h4>
                  <p className="price">
                    {simProduct.prices?.price
                      ? `${(parseFloat(simProduct.prices.price) / 100).toFixed(2)} ${simProduct.prices.currency_code || "EUR"}`
                      : "Prix N/A"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-similar-text">Aucun produit similaire trouvé.</p>
        )}
      </section>
    </div>
  );
}
