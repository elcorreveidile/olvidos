"use client";

import { useEffect, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already seen the animation
    const hasSeenAnimation = localStorage.getItem("hero-animation-seen");
    if (!hasSeenAnimation) {
      setShouldAnimate(true);
      // Mark as seen after animation completes
      const timer = setTimeout(() => {
        localStorage.setItem("hero-animation-seen", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="text-center mb-16">
      <h1
        className={`text-h1-article font-black text-azul mb-4 text-balance ${
          mounted && shouldAnimate ? "animate-slide-in" : ""
        }`}
      >
        <span className="text-coral">[</span>olvidos
      </h1>
      <p
        className={`text-xl text-acero font-editorial max-w-xl mx-auto ${
          mounted && shouldAnimate ? "animate-slide-in-delay" : ""
        }`}
      >
        Revista de acciones culturales
      </p>
    </section>
  );
}
