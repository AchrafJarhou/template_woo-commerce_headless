import HomeSlider from "../../components/HomeSlider";
import PageContent from "../../components/PageContent";
import DeleteAccountButton from "../../components/DeleteAccountButton";

export default function Home() {
  return (
    <div className="home">
      <PageContent slug="home" />
      <HomeSlider />
      <PageContent slug="a-propos" />
      <DeleteAccountButton />
    </div>
  );
}