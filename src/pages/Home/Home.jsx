import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroVideo from "../../components/Home/HeroVideo/HeroVideo";
import CatalogSection from "../../components/Home/CatalogSection/CatalogSection";
import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import { HOME_CATALOG_ANCHOR } from "../../constants/navigation";
import styles from "./Home.module.scss";

export default function Home() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(20);
  const products = useSelector((state) => state.products.list.data);
  const filters = useSelector((state) => state.filters);
  const totalProducts = useSelector((state) => state.products.list.total);
  const loading = useSelector((state) => state.products.loading);

  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  useEffect(() => {
    dispatch(fetchProductsThunk({ ...filters, page: 1, per_page: 20 }));
    setCurrentPage(1);
    setDisplayLimit(20);
  }, [filters, dispatch]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    dispatch(fetchProductsThunk({ ...filters, page: nextPage, per_page: 20 }));
    setCurrentPage(nextPage);
    setDisplayLimit(nextPage * 20);
  };

  const handleShowLess = () => {
    setDisplayLimit(20);
    const catalogElement = document.getElementById(HOME_CATALOG_ANCHOR);
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const displayedProducts = products.slice(0, displayLimit);
  const hasMore = displayLimit < totalProducts;
  const canShowLess = displayLimit > 20;

  return (
    <div className={styles.home}>
      <HeroVideo />
      <CatalogSection
        products={displayedProducts || []}
        hasMore={hasMore}
        canShowLess={canShowLess}
        loading={loading}
        onLoadMore={handleLoadMore}
        onShowLess={handleShowLess}
      />
    </div>
  );
}
