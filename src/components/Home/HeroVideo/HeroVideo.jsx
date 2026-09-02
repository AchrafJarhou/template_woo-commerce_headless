import { useEffect, useState } from "react";
import styles from "./HeroVideo.module.scss";
import raviVideo from "../../../assets/videos/ravi.mp4";

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
      <video
        className={styles.video}
        autoPlay
        playsinline
        loop
        muted
        src={raviVideo}
      />
      <h1 className={styles.title}>RAVI</h1>
    </div>
  );
}
