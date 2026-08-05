import Header from "./components/Header/Header";
import Footer from "../../components/Home/Footer/Footer";

export default function MainLayout({ children, hideFooter = false }) {
  return (
    <>
      <Header />
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
