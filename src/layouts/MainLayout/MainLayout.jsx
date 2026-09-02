// import Footer from "../../components/Home/Footer/Footer";

// export default function MainLayout({ children, hideFooter = false }) {
//   return (
//     <>
//       {children}
//       {!hideFooter && <Footer />}
//     </>
//   );
// }

import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "../../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="main-layout__content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}