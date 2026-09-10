import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroVideo from "../../components/Home/HeroVideo/HeroVideo";
import CatalogSection from "../../components/Home/CatalogSection/CatalogSection";
import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import styles from "./Home.module.scss";

export default function Home() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
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
  }, [filters, dispatch]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    dispatch(fetchProductsThunk({ ...filters, page: nextPage, per_page: 20 }));
    setCurrentPage(nextPage);
  };

  const hasMore = products.length < totalProducts;

  return (
    <div className={styles.home}>
      <HeroVideo />
      <CatalogSection
        products={products || []}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
