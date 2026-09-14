import PageContent from "../../components/PageContent";
import Accordion from "../../components/Accordion";

export default function About() {
  return (
    <PageContent
      slug="a-propos"
      renderBody={(html, lang) => <Accordion html={html} lang={lang} />}
    />
  );
}
