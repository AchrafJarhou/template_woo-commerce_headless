import { useState } from "react";
import Header from "../../../layouts/MainLayout/components/Header/Header";
import FilterBar from "../FilterBar/FilterBar";
import ProductGrid from "../ProductGrid/ProductGrid";
import Footer from "../Footer/Footer";
import styles from "./CatalogSection.module.scss";

export default function CatalogSection({ products }) {
  const [filter, setFilter] = useState("tous");

  return (
    <div className={styles.catalog}>
      <Header />
      <main className={styles.main}>
        <FilterBar onFilterChange={setFilter} />
        <ProductGrid products={products} filter={filter} />
      </main>
      <Footer />
    </div>
  );
}
