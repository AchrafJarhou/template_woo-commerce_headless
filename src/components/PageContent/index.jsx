import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPageThunk } from "../../thunkActionsCreator/pagesThunks";

export default function PageContent({ slug }) {
  const page = useSelector((state) => state.pages.items[slug]);
  const loading = useSelector((state) => state.pages.loading);
  const error = useSelector((state) => state.pages.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageThunk(slug));
  }, [dispatch, slug]);

  if (!page && error) return <p>{error}</p>;
  if (!page || loading) return <p>Chargement…</p>;

  const title = page.title ?? "";
  const content = page.content ?? "";
  console.log(page._links?.["wp:featuredmedia"]?.[0]?.href);
  return (
    <div>
      {page._links?.["wp:featuredmedia"]?.[0]?.href && (
        <img
          // src={`/woo-api/wp-json/wp/v2/media/${page.featured_media}/guid/rendered`}
          src={`${import.meta.env.VITE_API_URL}/${slug}/images/`}
          alt={`${import.meta.env.VITE_API_URL}/wp-json/wp/v2/media/${page.featured_media}/alt_text`}
        />
      )}
      <h1 dangerouslySetInnerHTML={{ __html: title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: content.rendered }} />
    </div>
  );
}
