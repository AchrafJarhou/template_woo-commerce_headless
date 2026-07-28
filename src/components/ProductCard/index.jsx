import { addProductToCart } from "../../thunkActionsCreator/cartThunks";
import { showToast } from "../../slices/toastSlice";
import { useDispatch } from "react-redux";
import { Link, redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [itemVariation, setItemVariation] = useState({});

  const addProduct = async (productId, quantity, variation, name) => {
    const result = await dispatch(
      addProductToCart({
        productId,
        quantity,
        variation,
      }),
    );
    if (addProductToCart.fulfilled.match(result)) {
      dispatch(showToast(`${name} ajouté au panier`));
    } else {
      dispatch(showToast(result.payload || "Erreur lors de l'ajout au panier"));
    }
  };

  function changeVariation(name, value) {
    setItemVariation((prev) => ({ ...prev, [name]: value }));
  }

  useEffect(() => {
    if (!product.attributes) return;

    const defaults = {};

    product.attributes.forEach((attribute) => {
      if (attribute.terms.length > 0) {
        defaults[attribute.name] = attribute.terms[0].name;
      }
    });

    setItemVariation(defaults);
  }, [product]);

  return (
    <div className="product-card">
      <Link to={"/product/" + product.slug}>
        <p dangerouslySetInnerHTML={{ __html: product.name || "-" }} />
        <p>Marque: {product.brands?.[0]?.name}</p>
        <img
          src={
            product.images[0]?.src ||
            "https://placeholder.pics/svg/300/DEDEDE/555555/Placeholder"
          }
          alt={product.name || "photo produit"}
        />
      </Link>
      <p>
        Prix: {(product.prices.price / 100).toFixed(2) || "-.--"}
        {" " + product.prices.currency_symbol}
      </p>

      {/* Prix promotionnel s'il y en a */}
      {product.prices.regular_price > product.prices.sale_price ? (
        <p>
          Reduction de{" "}
          {Math.round(
            ((parseInt(product.prices.regular_price) -
              parseInt(product.prices.sale_price)) /
              parseInt(product.prices.regular_price)) *
              100,
          )}
          %. Prix initial:{" "}
          {(product.prices.regular_price / 100).toFixed(2) +
            " " +
            product.prices.currency_symbol}
        </p>
      ) : null}

      {product.is_in_stock ? <p>En stock</p> : <p>Rupture de stock</p>}
      {product.attributes?.map((attribute) => (
        <div key={attribute.name}>
          <label htmlFor={attribute.name}>{attribute.name}</label>
          <select
            name={attribute.name}
            onChange={(e) => changeVariation(attribute.name, e.target.value)}
          >
            {attribute.terms.map((term) => (
              <option key={term.name} value={term.name}>
                {term.name}
              </option>
            ))}
          </select>
        </div>
      ))}
      {product.is_in_stock ? (
        <button
          onClick={() => addProduct(product.id, 1, itemVariation, product.name)}
        >
          Ajouter au panier
        </button>
      ) : (
        <button disabled>Rupture de stock</button>
      )}
    </div>
  );
}
