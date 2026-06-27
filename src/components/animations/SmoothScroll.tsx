import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9, // slightly dampened scroll for luxury weight
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis scroll events
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis raf loop to GSAP ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally for utility scrolling if needed
    (window as any).lenis = lenis;

    // Clean up
    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      delete (window as any).lenis;
    };
  }, []);

  return <div className="relative w-full min-h-screen">{children}</div>;
}
