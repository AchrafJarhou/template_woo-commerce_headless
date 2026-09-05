import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./HeroVideo.module.scss";
import raviVideo from "../../../assets/videos/ravi.mp4";

const FADE_START_RATIO = 0.1;
const FADE_DURATION_RATIO = 3;

export default function HeroVideo() {
  const heroRef = useRef(null);
  const siteSettings = useSelector((state) => state.site.siteSettings);
  const heroVideo = siteSettings?.heroVideo || raviVideo;
  const heroTitle = siteSettings?.heroTitle || "RAVI";

  useEffect(() => {
    const handleScroll = () => {
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
          src={heroVideo}
        />
        <h1 className={styles.title}>{heroTitle}</h1>
      </div>
    </div>
  );
}
