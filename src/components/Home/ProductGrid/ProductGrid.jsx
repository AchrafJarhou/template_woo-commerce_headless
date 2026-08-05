import styles from "./ProductGrid.module.scss";

export default function ProductGrid({ products, filter }) {
  const filteredProducts = filter === "tous"
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div className={styles.grid}>
      {filteredProducts.map((product) => (
        <div key={product.id} className={styles.card}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
          />
          <div className={styles.title}>{product.title}</div>
        </div>
      ))}
    </div>
  );
}
