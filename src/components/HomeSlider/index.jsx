import "./index.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchSpotlightProductsThunk } from "../../thunkActionsCreator/spotlightThunks";
import ProductCard from "../ProductCard";

const CARD_WIDTH = 300;
const GAP = 16;
const STEP = CARD_WIDTH + GAP;
const VIEWPORT_WIDTH_DESKTOP = CARD_WIDTH * 3 + GAP * 2;
const VIEWPORT_WIDTH_MOBILE = CARD_WIDTH;
const MOBILE_QUERY = "(max-width: 1024px)";

export default function HomeSlider() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.spotlight);
  const [slotIndex, setSlotIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(0.4);
  const [instant, setInstant] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
  const dragStartX = useRef(0);
  const lastMove = useRef({ x: 0, t: 0 });
  const velocity = useRef(0);
  const isAnimatingRef = useRef(false);

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

  useEffect(() => {
    if (total > 0) {
      setInstant(true);
      setSlotIndex(total);
    }
  }, [total]);

  const moveBy = (steps, duration = 0.4) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setIsAnimating(true);
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

  // Auto-play désactivé temporairement.
  // useEffect(() => {
  //   if (total === 0 || isDragging) return;
  //   const interval = setInterval(goNext, 4000);
  //   return () => clearInterval(interval);
  // }, [total, isDragging, slotIndex]);

  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse" || isMobile) return;
    isAnimatingRef.current = false;
    setIsAnimating(false);
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

  const handleDragEnd = () => {
    if (!isDragging) return;
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

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    isAnimatingRef.current = false;
    setIsAnimating(false);
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

  const extended = [...products, ...products, ...products];

  const viewportWidth = isMobile
    ? VIEWPORT_WIDTH_MOBILE
    : VIEWPORT_WIDTH_DESKTOP;
  const baseOffset = viewportWidth / 2 - CARD_WIDTH / 2 - slotIndex * STEP;

  return (
    <div className="home-slider">
      <div
        className="home-slider-viewport"
        style={{ width: viewportWidth }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
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
        <button onClick={goPrev} disabled={isAnimating}>
          {"<"}
        </button>
        <button onClick={goNext} disabled={isAnimating}>
          {">"}
        </button>
      </div>
    </div>
  );
}
