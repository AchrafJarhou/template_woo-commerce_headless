import { useState } from "react";
import Header from "../../../layouts/MainLayout/components/Header/Header";
import FilterBar from "../FilterBar/FilterBar";
import ProductGrid from "../ProductGrid/ProductGrid";
import Footer from "../Footer/Footer";
import styles from "./CatalogSection.module.scss";
import ProductModal from "../../ProductModal";

export default function CatalogSection({ products }) {
  const [filter, setFilter] = useState("tous");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className={styles.catalog}>
      <Header />
      <main className={styles.main}>
        <FilterBar onFilterChange={setFilter} />
        <ProductGrid
          products={products}
          filter={filter}
          onProductClick={setSelectedProduct}
        />
      </main>

      {/* Si un produit est sélectionné, on monte la modale */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
