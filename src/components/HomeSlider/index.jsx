import "./index.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";

const CARD_WIDTH = 160;
const GAP = 16;
const STEP = CARD_WIDTH + GAP;
const VIEWPORT_WIDTH = CARD_WIDTH * 3 + GAP * 2;
const MOBILE_QUERY = "(max-width: 1024px)";

export default function HomeSlider() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(0.4);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  const dragStartX = useRef(0);
  const lastMove = useRef({ x: 0, t: 0 });
  const velocity = useRef(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        orderby: "popularity",
        order: "desc",
        page: 1,
        per_page: 15,
      }),
    );
  }, [dispatch]);

  const products = list?.data || [];
  const total = products.length;

  const moveBy = (steps, duration = 0.4) => {
    setCurrentIndex((i) => (((i + steps) % total) + total) % total);
    setTransitionDuration(duration);
  };
  const goNext = () => moveBy(1);
  const goPrev = () => moveBy(-1);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mql.matches);
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {

    // (contenu qui bouge sans action de l'utilisateur) : uniquement les
    // boutons y font avancer le slider.
    if (total === 0 || isDragging || isMobile) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [total, isDragging, isMobile]);

  const addProduct = (productId) => {
    dispatch(addProductToCart({ productId, quantity: 1, variation: [] }));
  };

  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse" || isMobile) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    lastMove.current = { x: e.clientX, t: performance.now() };
    velocity.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging || e.pointerType !== "mouse") return;
    const now = performance.now();
    const dt = now - lastMove.current.t;
    if (dt > 0) {
      velocity.current = (e.clientX - lastMove.current.x) / dt;
    }
    lastMove.current = { x: e.clientX, t: now };
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!isDragging) return;
    // On projette la position sur la vitesse relevée juste avant le
    // relâchement : un flick rapide continue sur son élan (plus de
    // produits, animation plus longue) même si la distance glissée est
    // courte ; un glissement lent s'arrête net au produit le plus proche.
    const MOMENTUM_MS = 200;
    const projectedOffset = dragOffset + velocity.current * MOMENTUM_MS;
    const steps = Math.round(-projectedOffset / STEP);
    const duration = Math.min(0.3 + Math.abs(steps) * 0.1, 1.2);
    if (steps !== 0) moveBy(steps, duration);
    else setTransitionDuration(0.3);
    setDragOffset(0);
    setIsDragging(false);
  };

  if (loading) return <p>Chargement...</p>;
  if (total === 0) return null;

  // Un saut qui traverse la limite du tableau (dernier -> premier ou
  // inversement) ne doit pas s'animer sur toute la largeur du track.
  const wrapped = Math.abs(currentIndex - prevIndexRef.current) > total / 2;
  prevIndexRef.current = currentIndex;

  // On ajoute le dernier produit avant le premier et le premier après le
  // dernier, pour que l'aperçu soit correct même aux deux extrémités.
  const extended = [products[total - 1], ...products, products[0]];
  const slotIndex = currentIndex + 1;

  const baseOffset = VIEWPORT_WIDTH / 2 - CARD_WIDTH / 2 - slotIndex * STEP;

  return (
    <div className="home-slider">
      <h2>Produits du moment</h2>

      <div
        className="home-slider-viewport"
        style={{ width: VIEWPORT_WIDTH }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className="home-slider-track"
          style={{
            transform: `translateX(${baseOffset + dragOffset}px)`,
            transition:
              isDragging || wrapped
                ? "none"
                : `transform ${transitionDuration}s ease-out`,
          }}
        >
          {extended.map((product, index) => (
            <div
              key={`slot-${index}`}
              className={
                "home-slider-product" + (index === slotIndex ? " active" : "")
              }
              style={{ width: CARD_WIDTH }}
            >
              <Link to={"/product/" + product.slug}>
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  draggable={false}
                />
                <p dangerouslySetInnerHTML={{ __html: product.name }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.price_html }}></p>
              </Link>
              {index === slotIndex && (
                <button onClick={() => addProduct(product.id)}>
                  Ajouter au panier
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="home-slider-buttons">
        <button onClick={goPrev}>{"<"}</button>
        <button onClick={goNext}>{">"}</button>
      </div>
    </div>
  );
}
