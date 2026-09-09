import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./HeroVideo.module.scss";
import raviVideo from "../../../assets/videos/ravi.mp4";

// Le fondu doit s'achever AVANT que le catalogue ne recouvre la vidéo, sans
// quoi il reste invisible. Le catalogue commence à 130 vh (30 vh de spacer +
// 100 vh de margin-top dans CatalogSection) : un fondu sur un écran complet,
// démarré à 10 % du premier, se termine à 110 vh — juste avant.
const FADE_START_RATIO = 0.1;
const FADE_DURATION_RATIO = 1;

export default function HeroVideo() {
  const heroRef = useRef(null);
  const siteSettings = useSelector((state) => state.site.siteSettings);
  const heroVideo = siteSettings?.heroVideo || raviVideo;
  const heroTitle = siteSettings?.heroTitle || "RAVI";

  useEffect(() => {
    let frame = null;

    const applyFade = () => {
      frame = null;
      if (!heroRef.current) return;

      const vh = window.innerHeight;
      const fadeStart = vh * FADE_START_RATIO;
      const fadeDistance = vh * FADE_DURATION_RATIO;

      const rawProgress = (window.scrollY - fadeStart) / fadeDistance;
      const progress = Math.min(1, Math.max(0, rawProgress));

      const eased = progress * progress;
      const newOpacity = 1 - eased;

      heroRef.current.style.opacity = newOpacity;
      heroRef.current.style.pointerEvents = newOpacity === 0 ? "none" : "auto";
    };

    // Le navigateur émet bien plus d'événements de défilement qu'il n'affiche
    // d'images : on ne repeint qu'une fois par trame.
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(applyFade);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    // La hauteur de fenêtre entre dans le calcul : une rotation d'écran doit
    // le refaire, sans quoi l'opacité reste figée jusqu'au prochain scroll.
    window.addEventListener("resize", schedule);
    applyFade();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.heroSpacer}>
      <div ref={heroRef} className={styles.hero}>
        <video
          className={styles.video}
          autoPlay
          playsInline
          loop
          muted
          src={heroVideo}
        />
        <h1 className={styles.title}>{heroTitle}</h1>
      </div>
    </div>
  );
}
