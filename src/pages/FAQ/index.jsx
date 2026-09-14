import PageContent from "../../components/PageContent";
import Accordion from "../../components/Accordion";

export default function FAQ() {
  return (
    <PageContent
      slug="faq"
      renderBody={(html, lang) => <Accordion html={html} lang={lang} />}
    />
  );
}
