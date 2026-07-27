import HomeSlider from "../../components/HomeSlider";
import About from "../../components/About";
import PageContent from "../../components/PageContent";
import DeleteAccountButton from "../../components/DeleteAccountButton";

export default function Home() {
  return (
    <div className="home">
      <PageContent slug="home" />
      <HomeSlider></HomeSlider>
      <About></About>
      <DeleteAccountButton></DeleteAccountButton>
    </div>
  );
}
