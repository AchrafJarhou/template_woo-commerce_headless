import PageContent from "../../components/PageContent";
import Accordion from "../../components/Accordion";

export default function Confidentialite() {
  return (
    <PageContent
      slug="politique-de-confidentialite-2"
      renderBody={(html, lang) => <Accordion html={html} lang={lang} />}
    />
  );
}
