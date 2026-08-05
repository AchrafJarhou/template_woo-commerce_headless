import Header from "./components/Header/Header";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
