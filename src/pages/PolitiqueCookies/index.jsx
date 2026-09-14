import PageContent from "../../components/PageContent";
import Accordion from "../../components/Accordion";

export default function PolitiqueCookies() {
  return (
    <PageContent
      slug="politique-des-cookies"
      renderBody={(html, lang) => <Accordion html={html} lang={lang} />}
    />
  );
}
