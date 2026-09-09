import PageContent from "../../components/PageContent";
import Accordion from "../../components/Accordion";

export default function CGV() {
  return (
    <PageContent
      slug="conditions-generales-de-vente-cgv"
      renderBody={(html, lang) => <Accordion html={html} lang={lang} />}
    />
  );
}
