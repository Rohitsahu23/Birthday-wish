import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [clickEffect, setClickEffect] = useState(false);

  // Motion values for positions
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring settings for smooth trailing effect
  const springConfig = { damping: 40, stiffness: 350, mass: 0.5 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (hidden) setHidden(false);
    };

    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);

    const handleMouseDown = () => setClickEffect(true);
    const handleMouseUp = () => setClickEffect(false);

    // Event listeners to detect hover on interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .hover-target'
      );
      
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    // Add classes to body for styling
    document.body.classList.add('custom-cursor-active');

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Set up hover listeners and run periodically to catch dynamic updates
    addHoverListeners();
    const interval = setInterval(addHoverListeners, 1000);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearInterval(interval);
    };
  }, [cursorX, cursorY, hidden]);

  if (hidden) return null;

  return (
    <>
      {/* Outer Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-rose-gold pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 mix-blend-screen hidden lg:block"
        style={{
          x: ringX,
          y: ringY,
          backgroundColor: hovered ? 'rgba(224, 166, 170, 0.2)' : 'rgba(224, 166, 170, 0.03)',
          borderColor: hovered ? 'var(--color-gold)' : 'var(--color-rose-gold)',
          boxShadow: hovered 
            ? '0 0 20px 4px rgba(214, 175, 55, 0.4), inset 0 0 10px rgba(214, 175, 55, 0.2)' 
            : '0 0 10px 1px rgba(220, 166, 170, 0.1)',
        }}
        animate={{
          scale: clickEffect ? 0.7 : hovered ? 1.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gold pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50 hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          boxShadow: '0 0 6px 1px var(--color-gold)',
        }}
        animate={{
          scale: clickEffect ? 1.5 : hovered ? 0.5 : 1,
        }}
      />
    </>
  );
}
