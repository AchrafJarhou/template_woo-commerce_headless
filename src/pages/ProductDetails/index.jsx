import "./index.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Seo from "../../components/Seo";

import { fetchProductByIdThunk } from "../../thunkActionsCreator/productsThunks";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [itemVariation, setItemVariation] = useState({});

  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
  }, []);

  useEffect(() => {
    if (productToDisplay) {
      setActiveImageIndex(0);
    }
  }, [productToDisplay?.id]);

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

      {/*  <div
        className="short-description-box"
        dangerouslySetInnerHTML={{
          __html:
            productToDisplay.description ||
            productToDisplay.short_description ||
            "<p>Aucune introduction disponible.</p>",
        }}
      /> */}

      {/* Options variations */}

      {/* Le bouton d'ajout au panier est maintenant connecté via onClick */}
      {/* <button className="add-to-cart-btn" onClick={handleAddToCart}>
        <i className="fas fa-shopping-cart cart-btn-icon"></i>
        Ajouter au panier
      </button> */}

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

        {/* <div className="product-bottom-block">
        <div className="details-content-row">
          <div
            className="description-content"
            dangerouslySetInnerHTML={{
              __html:
                productToDisplay.description ||
                "<p>Aucune description disponible.</p>",
            }}
          />
        </div>
      </div> */}
      </div>
    </div>
  );
}
