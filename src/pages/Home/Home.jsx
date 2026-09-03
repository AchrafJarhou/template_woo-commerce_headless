import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeroVideo from "../../components/Home/HeroVideo/HeroVideo";
import CatalogSection from "../../components/Home/CatalogSection/CatalogSection";
import Spinner from "../../components/Spinner/Spinner";
import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import styles from "./Home.module.scss";

export default function Home() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list.data);
  const loading = useSelector((state) => state.products.loading);

  useEffect(() => {
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  useEffect(() => {
    dispatch(fetchProductsThunk({ page: 1, per_page: 20 }));
  }, [dispatch]);

  return (
    <div className={styles.home}>
      <HeroVideo />
      {loading ? <Spinner /> : <CatalogSection products={products || []} />}
    </div>
  );
}
