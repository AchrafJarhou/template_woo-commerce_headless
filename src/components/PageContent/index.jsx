import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { fetchPageThunk } from "../../thunkActionsCreator/pagesThunks";
import { localizedPageSlug, DEFAULT_LANGUAGE } from "../../i18n";
import Loader from "../Loader";
import "./PageContent.css";

export default function PageContent({ slug }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const localizedSlug = localizedPageSlug(slug, i18n.resolvedLanguage);
  const entry = useSelector((state) => state.pages.items[localizedSlug]);
  const loading = useSelector((state) => state.pages.loading);
  const error = useSelector((state) => state.pages.error);

  useEffect(() => {
    dispatch(fetchPageThunk({ slug: localizedSlug, fallbackSlug: slug }));
  }, [dispatch, localizedSlug, slug]);

  if (!entry && error) return <p>{error}</p>;
  if (!entry || loading) return <Loader size="lg" />;

  const { page, isFallback } = entry;
  // Le contenu servi n'est pas dans la langue de l'interface : on le déclare,
  // pour que les lecteurs d'écran changent de voix et de règles de césure.
  const contentLanguage = isFallback ? DEFAULT_LANGUAGE : undefined;

  return (
    <div className="page-content">
      {isFallback && (
        <p className="page-content__translation-notice">
          {t("page.translationPending")}
        </p>
      )}

      <h1
        lang={contentLanguage}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(page.title?.rendered ?? ""),
        }}
      />
      <div
        lang={contentLanguage}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(page.content?.rendered ?? ""),
        }}
      />
    </div>
  );
}
