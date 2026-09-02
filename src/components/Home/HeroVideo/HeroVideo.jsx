import { useEffect, useRef } from "react";
import styles from "./HeroVideo.module.scss";
import raviVideo from "../../../assets/videos/ravi.mp4";

// La vidéo reste pleinement visible jusqu'à ce scroll (en % de la hauteur d'écran)
const FADE_START_RATIO = 0.1; // ex: 40% d'un écran de scroll avant que ça commence
// Puis elle s'estompe totalement sur cette distance additionnelle (en % d'écran)
const FADE_DURATION_RATIO = 3; // ex: 160% d'un écran pour le fondu complet

export default function HeroVideo() {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;

      const vh = window.innerHeight;
      const fadeStart = vh * FADE_START_RATIO;
      const fadeDistance = vh * FADE_DURATION_RATIO;

      // Progression de 0 (encore net) à 1 (totalement fondu)
      const rawProgress = (window.scrollY - fadeStart) / fadeDistance;
      const progress = Math.min(1, Math.max(0, rawProgress));

      // Easing : la vidéo reste plus longtemps nette, puis accélère vers le bleu
      const eased = progress * progress; // courbe quadratique, ajustable
      const newOpacity = 1 - eased;

      heroRef.current.style.opacity = newOpacity;
      heroRef.current.style.pointerEvents = newOpacity === 0 ? "none" : "auto";
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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
          src={raviVideo}
        />
        <h1 className={styles.title}>RAVI</h1>
      </div>
    </div>
  );
}
