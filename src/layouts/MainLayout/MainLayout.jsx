import Header from "./components/Header/Header";
import styles from "./MainLayout.module.scss";

export default function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      {children}
    </div>
  );
}
