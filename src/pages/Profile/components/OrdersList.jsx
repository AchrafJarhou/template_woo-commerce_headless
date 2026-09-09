import React from "react";
import { useSelector } from "react-redux";

export default function OrdersList() {
  // Récupération des commandes depuis le store Redux
  const orders = useSelector((state) => state.user.orders);

  // Fonction de formatage (ajustée pour gérer potentiellement différents formats de prix venant de l'API)
  const formatPrice = (price, minorUnit = 2) => {
    if (!price) return "0,00 €";
    // Si l'API renvoie déjà un format décimal (ex: 260.00), on n'utilise pas Math.pow
    const numericPrice =
      Number(price) > 10000
        ? Number(price) / Math.pow(10, minorUnit)
        : Number(price);
    return `${numericPrice.toFixed(2).replace(".", ",")} €`;
  };

  // 1. Gérer le cas où il n'y a pas de commandes
  if (!orders || orders.length === 0) {
    return (
      <div>
        <h2 className="section-title">Mes Commandes</h2>
        <p className="facturation-text">Aucune commande trouvée.</p>
      </div>
    );
  }

  // 2. Trier les commandes de la plus récente à la plus ancienne
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <div>
      {/* 3. On boucle sur chaque commande trouvée */}
      {sortedOrders.map((order) => {
        // Selon l'API WooCommerce, les articles peuvent s'appeler line_items ou items
        const orderItems = order.line_items || order.items || [];

        return (
          <div key={order.id} style={{ marginBottom: "60px" }}>
            {/* --- EN-TÊTE DE LA COMMANDE --- */}
            <div className="order-history-header">
              <div className="order-data">
                <div className="order-header-main">
                  Commande N° {order.number ?? order.id}
                </div>
                <div className="order-date">
                  {order.date &&
                    new Date(order.date).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <div className="order-header-main">statut : {order.status}</div>
            </div>

            {/* --- LISTE DES ARTICLES DE LA COMMANDE --- */}
            <div className="order-list-container">
              {orderItems.map((item) => {
                // Adaptabilité pour les images selon le format WooCommerce
                const imageUrl = item.images?.[0]?.thumbnail || item.image?.src;
                const imageAlt = item.images?.[0]?.alt || item.name;

                return (
                  <div key={item.id} className="order-product-row">
                    <div className="order-product-image">
                      {imageUrl && <img src={imageUrl} alt={imageAlt} />}
                    </div>

                    <div className="order-product-details">
                      <h3>{item.name}</h3>
                      <p>ID du produit: {item.product_id || item.id}</p>

                      {/* Variations (Tailles, Couleurs...) si l'API les renvoie dans variation ou meta_data */}
                      {(item.variation || item.meta_data)?.map((v, i) => {
                        // WooCommerce utilise souvent "display_key" et "display_value" dans les commandes
                        const label = v.attribute || v.display_key || v.key;
                        const value = v.value || v.display_value;
                        if (!label || label.startsWith("_")) return null; // Ignore les meta cachées

                        return (
                          <p key={i}>
                            {label}: {value}
                          </p>
                        );
                      })}

                      <br />
                      <p>
                        Prix d'achat:{" "}
                        {formatPrice(
                          item.prices?.price || item.price || item.total,
                          item.prices?.currency_minor_unit || 2,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
