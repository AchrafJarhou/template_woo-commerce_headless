import { useEffect } from "react";
import HeroVideo from "../../components/Home/HeroVideo/HeroVideo";
import CatalogSection from "../../components/Home/CatalogSection/CatalogSection";
import { PRODUCTS } from "../../components/Home/data/products";
import styles from "./Home.module.scss";

export default function Home() {
  useEffect(() => {
    // Ajouter classe pour masquer le Header/Footer globaux
    document.body.classList.add("home-page");
    return () => document.body.classList.remove("home-page");
  }, []);

  return (
    <div className={styles.home}>
      <HeroVideo />
      <CatalogSection products={PRODUCTS} />
    </div>
  );
}
