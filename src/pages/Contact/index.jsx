import { useSelector } from "react-redux";
import PageContent from "../../components/PageContent";

export default function Contact() {
  const email = useSelector((state) => state.site.store_email);
  return (
    <>
      <PageContent slug="contact" />

      <a href={"mailto:" + email}>
        <button>ici</button>
      </a>
    </>
  );
}
