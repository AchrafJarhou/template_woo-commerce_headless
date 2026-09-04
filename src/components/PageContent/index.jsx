import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DOMPurify from "dompurify";
import { fetchPageThunk } from "../../thunkActionsCreator/pagesThunks";
import Loader from "../Loader";
import "./PageContent.css";

export default function PageContent({ slug }) {
  const page = useSelector((state) => state.pages.items[slug]);
  const loading = useSelector((state) => state.pages.loading);
  const error = useSelector((state) => state.pages.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPageThunk(slug));
  }, [dispatch, slug]);

  if (!page && error) return <p>{error}</p>;
  if (!page || loading) return <Loader size="lg"/>;

  const title = page.title ?? "";
  const content = page.content ?? "";

  return (
    <div className="page-content">
      <h1 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title.rendered) }} />
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.rendered) }} />
    </div>
  );
}