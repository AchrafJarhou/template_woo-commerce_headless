import { useEffect, useState } from "react";
import styles from "./HeroVideo.module.scss";

export default function HeroVideo() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const newOpacity = Math.max(0, 1 - window.scrollY / 800);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.hero} style={{ opacity }}>
      {/* Embed YouTube vidéo libre de droit */}
      <iframe
        className={styles.video}
        src="https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&mute=1&loop=1&playlist=aqz-KE-bpKQ&controls=0&modestbranding=1"
        title="Hero Fashion Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <h1 className={styles.title}>RAVI</h1>
    </div>
  );
}
