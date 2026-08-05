import MainLayout from "../../layouts/MainLayout/MainLayout";
import HeroVideo from "../../components/Home/HeroVideo/HeroVideo";
import CatalogSection from "../../components/Home/CatalogSection/CatalogSection";
import { PRODUCTS } from "../../components/Home/data/products";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <MainLayout>
      <div className={styles.home}>
        <HeroVideo />
        <CatalogSection products={PRODUCTS} />
      </div>
    </MainLayout>
  );
}
