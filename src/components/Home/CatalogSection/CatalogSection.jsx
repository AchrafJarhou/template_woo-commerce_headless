import { useState } from "react";
import FilterBar from "../FilterBar/FilterBar";
import ProductGrid from "../ProductGrid/ProductGrid";
import styles from "./CatalogSection.module.scss";

export default function CatalogSection({ products }) {
  const [filter, setFilter] = useState("tous");

  return (
    <div className={styles.catalog}>
      <main className={styles.main}>
        <FilterBar onFilterChange={setFilter} />
        <ProductGrid products={products} filter={filter} />
      </main>
    </div>
  );
}
