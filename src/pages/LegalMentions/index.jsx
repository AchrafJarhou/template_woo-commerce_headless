import PageContent from "../../components/PageContent";
import Accordion from "../../components/Accordion";

export default function MentionsLegales() {
  return (
    <PageContent
      slug="mentions-legales"
      renderBody={(html, lang) => <Accordion html={html} lang={lang} />}
    />
  );
}
