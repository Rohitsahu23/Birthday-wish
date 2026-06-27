import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart as HeartIcon } from 'lucide-react';
import heartData from '../../data/heartMemories.json';

interface HeartMemory {
  id: number;
  text: string;
}

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  glowColor: string;
  opacity: number;
  text: string;
  isHovered: boolean;
  pulse: number;
  pulseSpeed: number;
}

interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface HeartGardenProps {
  onHeartClick?: (text: string) => void;
}

export default function HeartGarden({ onHeartClick }: HeartGardenProps) {
  const memories: HeartMemory[] = heartData as HeartMemory[];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States for selected memory popup
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let hearts: HeartParticle[] = [];
    let explosions: ExplosionParticle[] = [];
    const maxHearts = 70; // 70 is dense enough for canvas but runs light

    const heartColors = [
      { fill: 'rgba(255, 77, 109, 0.5)', glow: 'rgba(255, 77, 109, 0.8)' },   // rose red
      { fill: 'rgba(255, 117, 143, 0.45)', glow: 'rgba(255, 117, 143, 0.75)' }, // pink
      { fill: 'rgba(255, 183, 197, 0.5)', glow: 'rgba(255, 183, 197, 0.8)' },   // soft blush
      { fill: 'rgba(212, 175, 55, 0.45)', glow: 'rgba(212, 175, 55, 0.8)' },    // gold leaf
      { fill: 'rgba(255, 107, 139, 0.4)', glow: 'rgba(255, 107, 139, 0.7)' },   // magenta
    ];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 450; // set standard fixed height for garden canvas belt
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const createHeart = (initY = false): HeartParticle => {
      const x = Math.random() * canvas.width;
      const y = initY ? Math.random() * canvas.height : canvas.height + 40;
      const size = Math.random() * 8 + 10; // width 10px to 18px
      const speedY = Math.random() * 0.35 + 0.2; // slow drift
      const speedX = (Math.random() - 0.5) * 0.1;
      const wobble = Math.random() * Math.PI * 2;
      const wobbleSpeed = Math.random() * 0.015 + 0.005;
      const randomColorSet = heartColors[Math.floor(Math.random() * heartColors.length)];
      const opacity = Math.random() * 0.35 + 0.45; // 0.45 to 0.8 opacity
      const text = memories[Math.floor(Math.random() * memories.length)].text;
      const pulse = Math.random() * Math.PI;
      const pulseSpeed = Math.random() * 0.03 + 0.01;

      return {
        x,
        y,
        size,
        speedY,
        speedX,
        wobble,
        wobbleSpeed,
        color: randomColorSet.fill,
        glowColor: randomColorSet.glow,
        opacity,
        text,
        isHovered: false,
        pulse,
        pulseSpeed,
      };
    };

    // Populate hearts initial positions
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(createHeart(true));
    }

    const drawHeartShape = (c: CanvasRenderingContext2D, x: number, y: number, d: number) => {
      c.beginPath();
      c.moveTo(x, y - d / 4);
      c.bezierCurveTo(x - d / 2, y - d * 0.8, x - d, y - d * 0.3, x - d, y + d / 4);
      c.bezierCurveTo(x - d, y + d * 0.7, x - d / 4, y + d * 0.9, x, y + d * 1.25);
      c.bezierCurveTo(x + d / 4, y + d * 0.9, x + d, y + d * 0.7, x + d, y + d / 4);
      c.bezierCurveTo(x + d, y - d * 0.3, x + d / 2, y - d * 0.8, x, y - d / 4);
      c.closePath();
    };

    const drawHeart = (c: CanvasRenderingContext2D, p: HeartParticle) => {
      c.save();
      
      // Heart breathing/pulsating scaling multiplier
      const scaleMultiplier = p.isHovered ? 1.3 : (1 + Math.sin(p.pulse) * 0.08);
      const size = p.size * scaleMultiplier;

      drawHeartShape(c, p.x, p.y, size);

      c.fillStyle = p.isHovered ? 'rgba(255, 51, 102, 0.85)' : p.color;
      c.shadowColor = p.isHovered ? 'rgba(255, 51, 102, 1)' : p.glowColor;
      c.shadowBlur = p.isHovered ? 18 : 6;

      c.globalAlpha = p.isHovered ? 1.0 : p.opacity;
      c.fill();
      c.restore();
    };

    // Create click burst sparks
    const createExplosion = (x: number, y: number, color: string) => {
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.2;
        explosions.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5, // slight upward float bias
          size: Math.random() * 3 + 2,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02,
        });
      }
    };

    // Track mouse coordinates for bounding collisions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let anyHovered = false;

      hearts.forEach((p) => {
        // Distance check
        const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
        if (dist < p.size * 1.5) {
          p.isHovered = true;
          anyHovered = true;
        } else {
          p.isHovered = false;
        }
      });

      canvas.style.cursor = anyHovered ? 'pointer' : 'default';
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clickedHeart = hearts.find((p) => {
        const dist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
        return dist < p.size * 1.5;
      });

      if (clickedHeart) {
        // Spawn sparks
        createExplosion(clickedHeart.x, clickedHeart.y, clickedHeart.glowColor);
        // Show popup bubble
        setSelectedText(clickedHeart.text);
        setPopupOpen(true);

        if (onHeartClick) {
          onHeartClick(clickedHeart.text);
        }

        // Repopulate clicked heart above/below boundaries
        Object.assign(clickedHeart, createHeart(false));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Render Floating Hearts
      hearts.forEach((p, index) => {
        // slow upwards velocity
        p.y -= p.speedY;
        // sway side-to-side on cosine wobble
        p.x += p.speedX + Math.cos(p.wobble) * 0.2;
        p.wobble += p.wobbleSpeed;
        p.pulse += p.pulseSpeed;

        drawHeart(ctx, p);

        // Reset if floats off top
        if (p.y < -40) {
          hearts[index] = createHeart(false);
        }
      });

      // 2. Render Click Explosion Sparks
      explosions.forEach((ep, index) => {
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.alpha -= ep.decay;

        if (ep.alpha <= 0) {
          explosions.splice(index, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = ep.alpha;
          ctx.fillStyle = ep.color;
          ctx.beginPath();
          ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [memories, onHeartClick]);

  return (
    <div className="w-full relative flex flex-col items-center py-6 min-h-[480px]">
      
      {/* Title */}
      <div className="text-center space-y-1 mb-4 z-10 select-none">
        <span className="text-[9px] uppercase tracking-widest text-gold font-light flex items-center justify-center gap-1.5">
          <Sparkles size={10} className="text-gold" /> Interactive Heart Garden
        </span>
        <h4 className="font-serif text-lg text-soft-pink/85 font-light">
          Click any floating heart to reveal a memory of us
        </h4>
      </div>

      {/* Canvas Element */}
      <div className="w-full relative h-[450px] border border-white/5 bg-black/10 rounded-3xl overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
      </div>

      {/* Glassmorphic Popup Bubble dialog */}
      <AnimatePresence>
        {popupOpen && selectedText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute top-1/2 -translate-y-1/2 z-30 max-w-sm w-[90%] mx-auto p-6 rounded-3xl glass-panel-pink border border-white/10 shadow-2xl text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-2.5 rounded-full bg-love-red/10 border border-love-red/25 text-love-red animate-pulse">
                <HeartIcon size={18} fill="currentColor" />
              </div>
            </div>
            <p className="text-xs md:text-sm font-light text-soft-pink leading-relaxed">
              "{selectedText}"
            </p>
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => setPopupOpen(false)}
                className="px-4 py-1.5 rounded-full glass-panel text-[10px] uppercase tracking-widest text-gold hover:text-white hover:border-gold transition-colors duration-300 cursor-pointer"
              >
                Close Bubble
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
