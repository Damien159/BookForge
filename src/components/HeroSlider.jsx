import { useCallback, useEffect, useRef, useState } from "react";

// Alt-Texte bitte an den echten Bildinhalt anpassen
const SLIDES = [
  { src: "/img/Homescreen.jpg", alt: "BookForge Aktionsbanner 1 von 3" },
  { src: "/img/Homescreen2.jpg", alt: "BookForge Aktionsbanner 2 von 3" },
  { src: "/img/Homescreen3.jpg", alt: "BookForge Aktionsbanner 3 von 3" },
];

export default function HeroSlider() {
  const trackRef = useRef(null);
  const [resetCount, setResetCount] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((direction) => {
    const track = trackRef.current;
    if (!track) return;

    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
    const atStart = track.scrollLeft <= 10;

    if (direction > 0 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({
        left: direction * track.clientWidth,
        behavior: "smooth",
      });
    }
  }, []);

  // Automatisch weiter, aber nicht im Hintergrund-Tab.
  // Ein Klick erhöht resetCount und startet den Timer neu.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      if (!document.hidden) go(1);
    }, 20000);
    return () => clearInterval(timer);
  }, [go, resetCount, paused]);

  function handleClick(direction) {
    go(direction);
    setResetCount((count) => count + 1);
  }

  return (
    <div
      className="homepage"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="Karussell"
      aria-label="Aktionen"
    >
      <button
        type="button"
        className="slider-arrow prev"
        onClick={() => handleClick(-1)}
        aria-label="Vorheriges Bild"
      >
        &larr;
      </button>

      <div className="img" ref={trackRef}>
        {SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
            decoding="async"
          />
        ))}
      </div>

      <button
        type="button"
        className="slider-arrow next"
        onClick={() => handleClick(1)}
        aria-label="Nächstes Bild"
      >
        &rarr;
      </button>
    </div>
  );
}
