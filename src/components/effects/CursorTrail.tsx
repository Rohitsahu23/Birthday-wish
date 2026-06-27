import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  scale: number;
}

export default function CursorTrail() {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const idCounter = useRef(0);

  useEffect(() => {
    // Disable trail on touch devices for performance
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const dx = clientX - lastMousePos.current.x;
      const dy = clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn a heart if mouse has moved a threshold distance (e.g., 25px)
      if (distance > 25) {
        const id = idCounter.current++;
        const newParticle: HeartParticle = {
          id,
          x: clientX,
          y: clientY,
          size: Math.random() * 8 + 8, // size between 8px and 16px
          rotation: Math.random() * 40 - 20, // rotation between -20deg and 20deg
          scale: Math.random() * 0.4 + 0.8,
        };

        // Append and cap at maximum 15 particles to avoid DOM bloat
        setParticles((prev) => [...prev.slice(-14), newParticle]);
        
        lastMousePos.current = { x: clientX, y: clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodically clean up particles that have faded out (after 800ms)
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 800));
    }, 100);

    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 0.8, 
              scale: 0, 
              x: p.x, 
              y: p.y,
              rotate: p.rotation
            }}
            animate={{ 
              opacity: 0, 
              scale: p.scale * 1.5,
              y: p.y - 40, // rise up slightly
              x: p.x + (Math.random() * 20 - 10), // sway slightly
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute text-love-red/60 pointer-events-none -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_4px_rgba(255,51,102,0.4)]"
            style={{ width: p.size, height: p.size }}
          >
            {/* Simple Heart SVG */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
