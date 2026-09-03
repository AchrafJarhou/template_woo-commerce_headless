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

export default function ProductGrid({ products, filter, onProductClick }) {
  const filteredProducts =
    filter === "tous"
      ? products
      : products.filter((p) =>
          p.categories?.some((cat) => cat.slug === filter)
        );

  console.log("PRODUCTS ACHRAF :", filteredProducts);
  if (filteredProducts && filteredProducts.length > 0) {
    console.log("FIRST PRODUCT:", filteredProducts[0]);
  }

  return (
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
  );
}
