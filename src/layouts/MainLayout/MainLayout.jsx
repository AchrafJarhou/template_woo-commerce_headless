import Footer from "../../components/Home/Footer/Footer";

export default function MainLayout({ children, hideFooter = false }) {
  return (
    <>
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
