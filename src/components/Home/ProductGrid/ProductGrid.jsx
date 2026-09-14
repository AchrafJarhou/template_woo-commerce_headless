// import styles from "./ProductGrid.module.scss";

// export default function ProductGrid({ products, filter }) {
//   const filteredProducts = filter === "tous"
//     ? products
//     : products.filter(p => p.category === filter);

//   return (
//     <div className={styles.grid}>
//       {filteredProducts.map((product) => (
//         <div key={product.id} className={styles.card}>
//           <img
//             src={product.image}
//             alt={product.title}
//             className={styles.image}
//           />
//           <div className={styles.title}>{product.title}</div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import styles from "./ProductGrid.module.scss";
import { useTranslation } from "react-i18next";

export default function ProductGrid({ products, filter, onProductClick }) {
  const { t } = useTranslation();
  const filteredProducts =
    filter === "tous"
      ? products
      : products.filter((p) =>
          p.categories?.some((cat) => cat.slug === filter)
        );

  return (
    <>
      {filteredProducts.length === 0 ? (
        <div className={styles.noProducts}>
          <p>{t("catalog.noMatch")}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            // <Link key={product.id} to={"/product/" + product.slug}>
            <div
              key={product.id}
              className={styles.card}
              onClick={() => onProductClick(product)}
            >
              <img
                src={
                  product.images[0]?.src ||
                  "https://placeholder.pics/svg/300/DEDEDE/555555/Placeholder"
                }
                alt={product.name || "photo produit"}
                className={styles.image}
              />
              <div className={styles.title}>{product.name}</div>
            </div>
            // </Link>
          ))}
        </div>
      )}
    </>
  );
}
