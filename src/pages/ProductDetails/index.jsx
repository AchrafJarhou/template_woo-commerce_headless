import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdThunk } from "../../thunkActionsCreator/productsThunks";
import ProductModal from "../../components/ProductModal";
import Loader from "../../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const { list, singleProduct, loadingSingle, errorSingle } = useSelector(
    (state) => state.products,
  );

  const productFromList = list?.data?.find(
    (p) => p.id.toString() === id.toString(),
  );
  const productToDisplay = productFromList || singleProduct;

  useEffect(() => {
    if (id && !productFromList) {
      dispatch(fetchProductByIdThunk(id));
    }
  }, [id, dispatch, productFromList]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  if (loadingSingle && !productToDisplay) {
    return <Loader size="lg" />;
  }

  if (errorSingle && !productToDisplay) {
    return <div className="error-state">Erreur : {errorSingle}</div>;
  }

  if (!productToDisplay) {
    return <div className="not-found-state">Aucun produit trouvé.</div>;
  }

  return showModal ? (
    <ProductModal product={productToDisplay} onClose={handleModalClose} />
  ) : null;
}
