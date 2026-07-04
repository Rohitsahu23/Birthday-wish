import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import dreamsData from '../../data/dreams.json';
import promisesData from '../../data/promises.json';
import wishesData from '../../data/wishes.json';
import hiddenStarsData from '../../data/hiddenStars.json';

gsap.registerPlugin(ScrollTrigger);

interface Dream {
  id: number;
  title: string;
  tag: string;
  quote: string;
  description: string;
  promise: string;
}

interface PromiseItem {
  id: number;
  title: string;
  explanation: string;
}

interface Wish {
  id: number;
  text: string;
}

interface HiddenStar {
  id: number;
  text: string;
}

// ----------------- Procedural Star Chime Synthesis -----------------
const playStarChimeAudio = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.4);
  } catch (err) {
    console.log('Audio Context playback blocked:', err);
  }
};

// ----------------- NIGHT SKY CANVAS BACKGROUND ENGINE -----------------
interface SkyStarParticle {
  x: number;
  y: number;
  size: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface SkyLanternParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  wobble: number;
  wobbleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speedX: number;
  speedY: number;
  opacity: number;
  active: boolean;
}

function NightSkyCanvas({ onStarClick }: { onStarClick: (text: string, x: number, y: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenStars: HiddenStar[] = hiddenStarsData as HiddenStar[];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: SkyStarParticle[] = [];
    let lanterns: SkyLanternParticle[] = [];
    let shootingStar: ShootingStar = { x: 0, y: 0, length: 0, speedX: 0, speedY: 0, opacity: 0, active: false };

    // Set up 30 specific golden star click hitboxes scattered by percentage
    const interactiveStars = hiddenStars.map((item, idx) => {
      // Calculate somewhat distributed coordinates
      const angle = (idx / 30) * Math.PI * 2;
      const r = (Math.random() * 0.3 + 0.15); // radius fraction
      return {
        id: item.id,
        text: item.text,
        pctX: 0.5 + Math.cos(angle) * r * 1.5, // map around center
        pctY: 0.4 + Math.sin(angle) * r,
        twinkle: Math.random() * Math.PI,
        size: Math.random() * 3.5 + 3.5, // larger golden stars
        isHovered: false
      };
    });

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Populate backdrop stars
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        size: Math.random() * 1.2 + 0.6,
        twinkle: Math.random() * Math.PI,
        twinkleSpeed: Math.random() * 0.03 + 0.01
      });
    }

    // Populate lanterns
    for (let i = 0; i < 15; i++) {
      lanterns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height,
        size: Math.random() * 6 + 5,
        speedY: Math.random() * 0.3 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.015 + 0.005
      });
    }

    const triggerShootingStar = () => {
      shootingStar.active = true;
      shootingStar.x = Math.random() * canvas.width * 0.6;
      shootingStar.y = Math.random() * canvas.height * 0.3;
      shootingStar.length = Math.random() * 60 + 50;
      shootingStar.speedX = Math.random() * 3 + 4;
      shootingStar.speedY = Math.random() * 2 + 3;
      shootingStar.opacity = 1.0;
    };

    let shootingStarTimer = 0;

    const drawSky = (c: CanvasRenderingContext2D) => {
      // 1. Draw static twinkling stars
      c.fillStyle = 'rgba(255, 255, 255, 0.85)';
      stars.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const currentOpacity = (Math.sin(s.twinkle) + 1.2) * 0.4;
        c.save();
        c.globalAlpha = currentOpacity;
        c.beginPath();
        c.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      });

      // 2. Draw auroral linear sweeps
      const auroraGrad = c.createLinearGradient(0, 0, c.canvas.width, 0);
      auroraGrad.addColorStop(0, 'rgba(120, 50, 160, 0.005)');
      auroraGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.02)');
      auroraGrad.addColorStop(1, 'rgba(180, 70, 120, 0.005)');
      c.fillStyle = auroraGrad;
      c.fillRect(0, 0, c.canvas.width, c.canvas.height);

      // 3. Draw Constellation lines between interactive stars
      c.strokeStyle = 'rgba(212, 175, 55, 0.07)';
      c.lineWidth = 0.5;
      c.beginPath();
      for (let i = 0; i < interactiveStars.length - 1; i += 2) {
        const starA = interactiveStars[i];
        const starB = interactiveStars[i + 1];
        c.moveTo(starA.pctX * c.canvas.width, starA.pctY * c.canvas.height);
        c.lineTo(starB.pctX * c.canvas.width, starB.pctY * c.canvas.height);
      }
      c.stroke();

      // 4. Draw interactive golden stars
      interactiveStars.forEach((is) => {
        is.twinkle += 0.02;
        const x = is.pctX * c.canvas.width;
        const y = is.pctY * c.canvas.height;

        c.save();
        // Pulsate scaling on hover
        const size = is.size * (is.isHovered ? 1.4 : (1 + Math.sin(is.twinkle) * 0.15));

        // Draw star shape
        c.beginPath();
        c.fillStyle = is.isHovered ? 'rgba(255, 220, 100, 1)' : 'rgba(212, 175, 55, 0.75)';
        c.shadowColor = 'rgba(212, 175, 55, 1)';
        c.shadowBlur = is.isHovered ? 20 : 6;
        
        c.moveTo(x, y - size);
        c.lineTo(x + size * 0.3, y - size * 0.3);
        c.lineTo(x + size, y);
        c.lineTo(x + size * 0.3, y + size * 0.3);
        c.lineTo(x, y + size);
        c.lineTo(x - size * 0.3, y + size * 0.3);
        c.lineTo(x - size, y);
        c.lineTo(x - size * 0.3, y - size * 0.3);
        c.closePath();
        c.fill();
        c.restore();
      });

      // 5. Draw Shooting Star
      if (shootingStar.active) {
        c.save();
        const grad = c.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.length,
          shootingStar.y - shootingStar.length * 0.8
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        c.strokeStyle = grad;
        c.lineWidth = 1.8;
        c.beginPath();
        c.moveTo(shootingStar.x, shootingStar.y);
        c.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y - shootingStar.length * 0.8
        );
        c.stroke();
        c.restore();

        // Increment position
        shootingStar.x += shootingStar.speedX;
        shootingStar.y += shootingStar.speedY;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > c.canvas.width) {
          shootingStar.active = false;
        }
      }

      // 6. Draw drifting lanterns
      lanterns.forEach((l, index) => {
        l.y -= l.speedY;
        l.wobble += l.wobbleSpeed;
        const currentSway = Math.sin(l.wobble) * 3.5;

        c.save();
        c.translate(l.x + currentSway, l.y);

        // draw small glowing orange rectangle
        c.beginPath();
        c.rect(-l.size / 2, -l.size * 0.7, l.size, l.size * 1.4);
        c.fillStyle = 'rgba(255, 170, 70, 0.55)';
        c.shadowColor = 'rgba(255, 130, 40, 0.9)';
        c.shadowBlur = 8;
        c.fill();
        c.restore();

        // Reset if float off top
        if (l.y < -40) {
          lanterns[index] = {
            x: Math.random() * c.canvas.width,
            y: c.canvas.height + 40,
            size: Math.random() * 6 + 5,
            speedY: Math.random() * 0.3 + 0.2,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.015 + 0.005
          };
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let anyHovered = false;

      interactiveStars.forEach((star) => {
        const starX = star.pctX * canvas.width;
        const starY = star.pctY * canvas.height;
        const dist = Math.sqrt((starX - mouseX) ** 2 + (starY - mouseY) ** 2);

        if (dist < 15) {
          star.isHovered = true;
          anyHovered = true;
        } else {
          star.isHovered = false;
        }
      });

      canvas.style.cursor = anyHovered ? 'pointer' : 'default';
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clickedStar = interactiveStars.find((star) => {
        const starX = star.pctX * canvas.width;
        const starY = star.pctY * canvas.height;
        const dist = Math.sqrt((starX - mouseX) ** 2 + (starY - mouseY) ** 2);
        return dist < 15;
      });

      if (clickedStar) {
        onStarClick(clickedStar.text, clickedStar.pctX * canvas.width, clickedStar.pctY * canvas.height);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSky(ctx);

      // Random shooting star trigger (approx every 12 seconds)
      shootingStarTimer++;
      if (shootingStarTimer > 750) {
        shootingStarTimer = 0;
        if (!shootingStar.active) triggerShootingStar();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
    };
  }, [hiddenStars, onStarClick]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-10 opacity-75"
    />
  );
}

// ----------------- FOREVER SECTION -----------------
export default function ForeverSection() {
  const dreams: Dream[] = dreamsData as Dream[];
  const promises: PromiseItem[] = promisesData as PromiseItem[];
  const wishes: Wish[] = wishesData as Wish[];

  const sectionRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [selectedPromise, setSelectedPromise] = useState<PromiseItem | null>(null);
  
  // Wishes Carousel States
  const [currentWishIdx, setCurrentWishIdx] = useState(0);

  // Night Sky Star Click states
  const [activeStarNote, setActiveStarNote] = useState<string | null>(null);
  const [starNotePos, setStarNotePos] = useState({ x: 0, y: 0 });

  // Wishes Autoplay timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWishIdx((prev) => (prev + 1) % wishes.length);
    }, 7500); // rotate wishes every 7.5 seconds
    return () => clearInterval(interval);
  }, [wishes.length]);

  const handleNextWish = () => {
    setCurrentWishIdx((prev) => (prev + 1) % wishes.length);
  };

  const handlePrevWish = () => {
    setCurrentWishIdx((prev) => (prev - 1 + wishes.length) % wishes.length);
  };

  const handleStarTrigger = (text: string, screenX: number, screenY: number) => {
    playStarChimeAudio();
    setActiveStarNote(text);
    setStarNotePos({ x: screenX, y: screenY });

    // Auto fadeout message bubbles after 3.2 seconds
    setTimeout(() => {
      setActiveStarNote(null);
    }, 3200);
  };

  return (
    <div
      ref={sectionRef}
      id="dreams"
      className="relative w-full overflow-hidden transition-colors duration-1000 py-24 bg-[#050308] text-soft-pink"
    >
      {/* MAGICAL NIGHT SKY CANVAS ENGINE */}
      <NightSkyCanvas onStarClick={handleStarTrigger} />

      {/* Floating golden star popup card */}
      <AnimatePresence>
        {activeStarNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            style={{
              position: 'absolute',
              left: `${Math.min(Math.max(starNotePos.x - 120, 15), window.innerWidth - 260)}px`,
              top: `${starNotePos.y - 110}px`,
              zIndex: 30,
              pointerEvents: 'none'
            }}
            className="w-56 p-4 rounded-2xl glass-panel-pink border border-gold/30 shadow-2xl text-center space-y-2"
          >
            <div className="flex justify-center text-gold">
              <Star size={14} fill="currentColor" className="animate-spin-slow" />
            </div>
            <p className="font-cursive text-xs text-[#ebd8bf] leading-relaxed">
              {activeStarNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 relative z-20 space-y-24">
        
        {/* CINEMATIC TRANSITION HEADER */}
        <div className="text-center space-y-5 pt-8">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.35em] text-gold font-light block"
          >
            Chapter VI
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-light text-soft-pink tracking-wide"
          >
            Our Forever
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.65 }}
            viewport={{ once: true }}
            className="font-serif italic text-xs md:text-sm text-gold/80"
          >
            "The most beautiful memories are still waiting to be created."
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            className="font-cursive text-sm text-rose-gold select-none"
          >
            With you, Kashish, every tomorrow is my favorite dream. ❤️
          </motion.div>
          <div className="h-[1px] w-12 bg-rose-gold/40 mx-auto mt-4" />
        </div>


        {/* 2. INTERACTIVE DREAM WALL */}
        <div className="space-y-6">
          <div className="text-center mb-6 select-none">
            <span className="text-[10px] uppercase tracking-widest text-soft-pink/55 font-light">
              Magical Dream Wall
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dreams.map((dream) => (
              <motion.div
                key={dream.id}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedDream(dream)}
                className="glass-panel-pink p-5 rounded-3xl border border-white/5 hover:border-gold/30 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group hover-target"
              >
                <div className="space-y-2">
                  <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider text-gold font-light block w-max">
                    {dream.tag}
                  </span>
                  <h4 className="font-serif text-sm md:text-base text-soft-pink group-hover:text-gold transition-colors duration-300">
                    {dream.title}
                  </h4>
                  <p className="text-[10.5px] font-light text-soft-pink/60 leading-relaxed font-sans line-clamp-3">
                    {dream.description}
                  </p>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-gold/80 block pt-4 group-hover:underline">
                  Uncover promise →
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. PROMISE WALL */}
        <div className="space-y-6">
          <div className="text-center mb-6 select-none">
            <span className="text-[10px] uppercase tracking-widest text-soft-pink/55 font-light">
              30 Promises I Make To You
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {promises.map((promise) => (
              <motion.div
                key={promise.id}
                whileHover={{ y: -3, scale: 1.02 }}
                onClick={() => setSelectedPromise(promise)}
                className="glass-panel p-3 rounded-2xl border border-white/5 hover:border-gold/35 shadow-sm text-center flex flex-col justify-center items-center gap-1.5 cursor-pointer hover-target"
              >
                <Check size={12} className="text-gold/60" />
                <h5 className="font-serif text-[10px] text-soft-pink/85 leading-tight truncate w-full">
                  {promise.title}
                </h5>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 4. BIRTHDAY WISHES WALL */}
        <div className="space-y-6 pt-10">
          <div className="text-center mb-6 select-none">
            <span className="text-[10px] uppercase tracking-widest text-soft-pink/55 font-light">
              Birthday Wishes Wall
            </span>
          </div>

          <div className="relative max-w-2xl mx-auto py-6 px-4">
            <div className="glass-panel-pink rounded-3xl p-8 border border-white/10 shadow-2xl relative min-h-[140px] flex items-center justify-center text-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWishIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-2"
                >
                  <p className="font-serif italic text-xs md:text-sm text-soft-pink/85 leading-relaxed">
                    "{wishes[currentWishIdx].text}"
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left Button */}
            <button
              onClick={handlePrevWish}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-soft-pink hover:text-gold hover:border-gold transition-colors duration-300 cursor-pointer"
              aria-label="Previous wish"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Right Button */}
            <button
              onClick={handleNextWish}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-soft-pink hover:text-gold hover:border-gold transition-colors duration-300 cursor-pointer"
              aria-label="Next wish"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* FADE TO BLACK TEASER EXIT */}
        <div className="pt-24 pb-12 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5 }}
            className="space-y-5"
          >
            <Heart size={30} className="text-love-red/20 mx-auto animate-pulse" />
            <h4 className="font-cursive text-4xl md:text-5xl text-gold text-glow-gold select-none">
              No matter where life takes us...
            </h4>
            <h3 className="font-cursive text-4xl md:text-6xl text-soft-pink text-glow-pink select-none">
              There is only one future I want.
            </h3>
            <p className="text-[10px] uppercase tracking-[0.25em] text-soft-pink/40 font-light select-none animate-pulse">
              A lifetime with you, Kashish.
            </p>
          </motion.div>
        </div>

      </div>

      {/* Dream Expand modal Dialog overlay */}
      <AnimatePresence>
        {selectedDream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDream(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glass-panel-pink p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4"
            >
              <span className="text-[9px] uppercase tracking-widest text-gold border border-gold/20 px-2 py-0.5 rounded font-light inline-block">
                {selectedDream.tag}
              </span>
              <h3 className="font-serif text-lg md:text-xl text-soft-pink">
                {selectedDream.title}
              </h3>
              <p className="text-[10px] text-rose-gold italic leading-normal border-l-2 border-gold/30 pl-2">
                "{selectedDream.quote}"
              </p>
              <p className="text-xs font-light text-soft-pink/80 leading-relaxed">
                {selectedDream.description}
              </p>
              
              <div className="pt-4 border-t border-white/5 space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-gold font-light block">
                  Rohit's Promise:
                </span>
                <p className="font-cursive text-sm text-[#ebd5bf] leading-normal">
                  {selectedDream.promise}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setSelectedDream(null)}
                  className="px-4 py-1.5 rounded-full glass-panel text-[10px] uppercase tracking-widest text-gold hover:text-white hover:border-gold transition-colors duration-300 cursor-pointer"
                >
                  Close details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promise explanation Dialog overlay */}
      <AnimatePresence>
        {selectedPromise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPromise(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glass-panel-pink p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4"
            >
              <div className="flex justify-center text-gold">
                <Check size={20} className="text-gold" />
              </div>
              <h3 className="font-serif text-base md:text-lg text-soft-pink text-center">
                {selectedPromise.title}
              </h3>
              <div className="h-[1px] w-8 bg-rose-gold/40 mx-auto" />
              <p className="font-cursive text-sm md:text-base text-[#ebd6c0] text-center leading-relaxed">
                "{selectedPromise.explanation}"
              </p>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => setSelectedPromise(null)}
                  className="px-4 py-1.5 rounded-full glass-panel text-[10px] uppercase tracking-widest text-gold hover:text-white hover:border-gold transition-colors duration-300 cursor-pointer"
                >
                  Close promise
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
