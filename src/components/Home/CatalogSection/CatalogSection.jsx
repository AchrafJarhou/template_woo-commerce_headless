import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../../layouts/MainLayout/components/Header/Header";
import FilterBar from "../FilterBar/FilterBar";
import ProductGrid from "../ProductGrid/ProductGrid";
import styles from "./CatalogSection.module.scss";
import Footer from "../../../layouts/MainLayout/components/Footer/Footer.jsx";
import ProductModal from "../../ProductModal";
import Loader from "../../Loader";

export default function CatalogSection({ products }) {
  const [filter, setFilter] = useState("tous");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const loading = useSelector((state) => state.products.loading);

  const filteredProducts =
    filter === "tous"
      ? products
      : products.filter((p) =>
          p.categories?.some((cat) => cat.slug === filter),
        );

  return (
    <div className={styles.catalog}>
      <Header />
      <main className={styles.main}>
        <FilterBar
          onFilterChange={setFilter}
          hasProducts={filteredProducts.length > 0}
        />
        {loading ? (
          <Loader size="lg" />
        ) : (
          <ProductGrid
            products={products}
            filter={filter}
            onProductClick={setSelectedProduct}
          />
        )}
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
