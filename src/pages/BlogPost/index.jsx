import BlogPostComponent from "../../components/BlogPostComponent";
import { useParams } from "react-router-dom";


export default function BlogPost() {
  const { slug } = useParams();
    return <BlogPostComponent slug={slug} />;
}