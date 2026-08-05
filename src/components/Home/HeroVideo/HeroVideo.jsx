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
      <video
        className={styles.video}
        autoPlay
        playsinline
        loop
        muted
        src="https://videos.pexels.com/video-files/3573367/3573367-uhd_2560_1440_24fps.mp4"
      />
      <h1 className={styles.title}>RAVI</h1>
    </div>
  );
}
