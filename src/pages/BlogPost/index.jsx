import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogPostBySlugThunk} from "../../thunkActionsCreator/blogThunks";
import Seo from "../../components/Seo";

export default function BlogPost() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { singlePost, loadingSingle, errorSingle } = useSelector(
    (state) => state.blog,
  );

  useEffect(() => {
    dispatch(fetchBlogPostBySlugThunk(slug));
  }, [slug, dispatch]);

  if (loadingSingle) {
    return <div style={{ padding: 24 }}>Chargement de l'article...</div>;
  }

  if (errorSingle || !singlePost) {
    return <div style={{ padding: 24 }}>Article introuvable.</div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Seo
        title={singlePost.titleText}
        description={singlePost.excerptText}
        image={singlePost.image}
        url={`https://[url-du-site]/blog/${singlePost.id}`}
        type="article"
      />

      <h1>{singlePost.titleText}</h1>
      <p style={{ color: "#666", fontSize: 14 }}>
        {new Date(singlePost.date).toLocaleDateString("fr-FR", {
          day: "numeric", month: "long", year: "numeric",
        })}
      </p>

      <div dangerouslySetInnerHTML={{ __html: singlePost.contentHtml || "" }} />
    </div>
  );
}