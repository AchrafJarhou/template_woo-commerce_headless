import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPostBySlugThunk} from "../../thunkActionsCreator/blogThunks";
import Seo from "../Seo";
import "./index.css";

export default function BlogPostComponent({slug}) {
  const dispatch = useDispatch();
  const { singlePost, loadingSingle, errorSingle } = useSelector(
    (state) => state.blog,
  );

  useEffect(() => {
    dispatch(fetchBlogPostBySlugThunk(slug));
  }, [slug, dispatch]);

  if (loadingSingle) {
    return <div >Chargement de l'article...</div>;
  }

  if (errorSingle || !singlePost) {
    return <div >Article introuvable.</div>;
  }

  return (
    <div className="blog-post">
      <Seo
        title={singlePost.titleText}
        description={singlePost.excerptText}
        image={singlePost.image}
        url={`https://[url-du-site]/blog/${singlePost.id}`}
        type="article"
      />

      <h1>{singlePost.titleText}</h1>
      <p className="blog-post-date">
        {new Date(singlePost.date).toLocaleDateString("fr-FR", {
          day: "numeric", month: "long", year: "numeric",
        })}
      </p>

      <div dangerouslySetInnerHTML={{ __html: singlePost.contentHtml || "" }} />
    </div>
  );
}