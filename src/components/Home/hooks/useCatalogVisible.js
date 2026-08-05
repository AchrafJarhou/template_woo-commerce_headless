import { useEffect, useRef } from "react";

export function useCatalogVisible() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.body.classList.add("catalog-visible");
        } else {
          document.body.classList.remove("catalog-visible");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      document.body.classList.remove("catalog-visible");
    };
  }, []);

  return ref;
}
