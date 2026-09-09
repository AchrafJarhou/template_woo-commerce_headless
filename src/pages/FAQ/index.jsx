import PageContent from "../../components/PageContent";
import FaqAccordion from "../../components/FaqAccordion";

export default function FAQ() {
  return (
    <PageContent
      slug="faq"
      renderBody={(html, lang) => <FaqAccordion html={html} lang={lang} />}
    />
  );
}
