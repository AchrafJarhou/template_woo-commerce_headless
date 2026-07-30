import "./index.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSpotlightProductsThunk } from "../../thunkActionsCreator/spotlightThunks";
import ProductCard from "../ProductCard";

const CARD_WIDTH = 300;
const GAP = 16;
const STEP = CARD_WIDTH + GAP;
const VIEWPORT_WIDTH = CARD_WIDTH * 3 + GAP * 2;
const MOBILE_QUERY = "(max-width: 1024px)";

export default function HomeSlider() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.spotlight);
  const [slotIndex, setSlotIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(0.4);
  const [instant, setInstant] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  const dragStartX = useRef(0);
  const lastMove = useRef({ x: 0, t: 0 });
  const velocity = useRef(0);

  useEffect(() => {
    dispatch(
      fetchSpotlightProductsThunk({
        orderby: "popularity",
        order: "desc",
        page: 1,
        per_page: 15,
      }),
    );
  }, [dispatch]);

  const products = list?.data || [];
  const total = products.length;

  // On démarre sur la copie du milieu (voir `extended` plus bas) pour avoir
  // de la marge des deux côtés dès le premier rendu. Recentrage instantané :
  // slotIndex 0 et slotIndex total affichent le même produit, donc ce
  // cadrage initial ne doit jamais s'animer.
  useEffect(() => {
    if (total > 0) {
      setInstant(true);
      setSlotIndex(total);
    }
  }, [total]);

  const moveBy = (steps, duration = 0.4) => {
    setInstant(false);
    setSlotIndex((i) => i + steps);
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
    if (total === 0 || isDragging) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [total, isDragging]);

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
    if (steps !== 0) {
      moveBy(steps, duration);
    } else {
      setInstant(false);
      setTransitionDuration(0.3);
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  // Une fois la transition terminée, si on a dérivé hors de la copie du
  // milieu, on se replace silencieusement (sans transition) sur la copie
  // équivalente : comme les trois copies sont identiques, ce recentrage ne
  // se voit jamais à l'écran, et ça permet au wrap dernier -> premier (ou
  // inversement) de glisser exactement comme n'importe quel autre pas.
  const handleTransitionEnd = (e) => {
    // Les cartes produit ont elles aussi une transition (opacity/scale sur
    // l'état actif) : leur `transitionend` remonte jusqu'ici. On ignore
    // tout ce qui ne vient pas directement de la piste, sinon le
    // recentrage se déclenche plusieurs fois pour un seul mouvement.
    if (e.target !== e.currentTarget) return;
    if (slotIndex >= 2 * total) {
      setInstant(true);
      setSlotIndex((i) => i - total);
    } else if (slotIndex < total) {
      setInstant(true);
      setSlotIndex((i) => i + total);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (total === 0) return null;

  // La piste contient trois copies de la liste : la copie du milieu
  // (indices [total, 2*total[) est celle affichée au repos, les deux
  // autres servent de tampon pour que le glissement d'un produit à l'autre
  // reste continu, y compris quand on boucle du dernier produit au premier.
  const extended = [...products, ...products, ...products];

  const baseOffset = VIEWPORT_WIDTH / 2 - CARD_WIDTH / 2 - slotIndex * STEP;

  return (
    <div className="home-slider">
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
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(${baseOffset + dragOffset}px)`,
            transition:
              isDragging || instant
                ? "none"
                : `transform ${transitionDuration}s ease-out`,
          }}
        >
          {extended.map((product, index) => (
            <div
              key={`slot-${index}`}
              className={
                // On marque active toutes les copies du produit courant (pas
                // seulement le slot physique visible) : comme ça, aucune
                // carte n'a de transition opacity/scale à rattraper au
                // moment du recentrage invisible, ce qui évite le sursaut.
                "home-slider-product" +
                (index % total === slotIndex % total ? " active" : "")
              }
              style={{ width: CARD_WIDTH }}
            >
              <ProductCard product={product} />
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
