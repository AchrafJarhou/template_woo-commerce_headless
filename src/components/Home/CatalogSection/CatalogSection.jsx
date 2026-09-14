import { useState } from "react";
import Header from "../../../layouts/MainLayout/components/Header/Header";
import FilterBar from "../FilterBar/FilterBar";
import ProductGrid from "../ProductGrid/ProductGrid";
import styles from "./CatalogSection.module.scss";
import { HOME_CATALOG_ANCHOR } from "../../../constants/navigation";
import Footer from "../../../layouts/MainLayout/components/Footer/Footer.jsx";
import ProductModal from "../../ProductModal";
import Loader from "../../Loader";
import { useTranslation } from "react-i18next";

export default function CatalogSection({
  products,
  hasMore = false,
  canShowLess = false,
  loading = false,
  onLoadMore,
  onShowLess,
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("tous");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts =
    filter === "tous"
      ? products
      : products.filter((p) =>
          p.categories?.some((cat) => cat.slug === filter),
        );

  const showLoader = loading && products.length === 0;

  return (
    <div className={styles.catalog} id={HOME_CATALOG_ANCHOR}>
      <Header />
      <main className={styles.main}>
        <FilterBar
          onFilterChange={setFilter}
          hasProducts={filteredProducts.length > 0 || loading}
        />
        {showLoader ? (
          <div className={styles.loaderContainer}>
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <ProductGrid
              products={products}
              filter={filter}
              onProductClick={setSelectedProduct}
            />
            {(hasMore || canShowLess) && (
              <div className={styles.buttonsContainer}>
                {hasMore && (
                  <button
                    onClick={onLoadMore}
                    disabled={loading}
                    className={styles.loadMoreBtn}
                  >
                    {loading ? <Loader size="sm" /> : t("common.showMore")}
                  </button>
                )}
                {canShowLess && (
                  <button
                    onClick={onShowLess}
                    disabled={loading}
                    className={styles.showLessBtn}
                  >
                    {t("catalog.showLess")}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

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
