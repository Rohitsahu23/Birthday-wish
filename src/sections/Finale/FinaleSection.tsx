import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Sparkles, Film, ArrowRight, Play, Award } from 'lucide-react';

import finaleStars from '../../data/finaleStars.json';
import finaleMemories from '../../data/finaleMemories.json';

// ----------------- Procedural Audio Synths -----------------
const playBoomAudio = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Launch boom sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.4);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.4);
  } catch (e) {
    console.log('Audio Context playback blocked:', e);
  }
};

const playCrackleAudio = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const duration = 0.45;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // high filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.setValueAtTime(2.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
    noise.stop(now + duration);
  } catch (e) {
    console.log('Audio Context playback blocked:', e);
  }
};

const playStarChimeAudio = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.4);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.4);
  } catch (e) {
    console.log('Audio Context playback blocked:', e);
  }
};

// ----------------- GRAND FIREWORKS CANVAS COMPONENT -----------------
interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

interface SkyStar {
  x: number;
  y: number;
  size: number;
  twinkle: number;
  twinkleSpeed: number;
  text: string;
  isHovered: boolean;
}

function GrandFinaleCanvas({
  starsList,
  onStarClick
}: {
  starsList: string[];
  onStarClick: (text: string, x: number, y: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: FireworkParticle[] = [];
    let backdropStars: SkyStar[] = [];
    let textStamps: Array<{ text: string; x: number; y: number; alpha: number; scale: number }> = [];

    const colors = ['#ff3366', '#d4af37', '#ff8da1', '#ffb7c5', '#ffffff', '#e5a4ff'];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 550;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Populate 100 hidden stars with distributed coordinates
    for (let i = 0; i < 100; i++) {
      backdropStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.8,
        size: Math.random() * 2 + 1.2, // slightly larger gold twinkling stars
        twinkle: Math.random() * Math.PI,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        text: starsList[i] || "I love you, Kashish. ❤️",
        isHovered: false
      });
    }

    // Explode circular firework shell
    const createFirework = (x: number, y: number) => {
      playBoomAudio();
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 75;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 1.5 + 1.0,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.018 + 0.01,
          gravity: 0.02
        });
      }

      // 10% chance to stamp text firework
      if (Math.random() < 0.3) {
        setTimeout(playCrackleAudio, 400);
        const stamps = ['❤️', 'Kashish', 'Love', 'Forever'];
        textStamps.push({
          text: stamps[Math.floor(Math.random() * stamps.length)],
          x,
          y: y - 20,
          alpha: 1.0,
          scale: 0.8
        });
      }
    };

    // Explode heart firework shell
    const createHeartFirework = (x: number, y: number) => {
      playBoomAudio();
      setTimeout(playCrackleAudio, 500);
      const color = '#ff3366'; // romantic red-pink
      const count = 90;

      for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        // parametric heart vectors
        const vx = 0.16 * (16 * Math.sin(t) ** 3);
        const vy = -0.16 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        particles.push({
          x,
          y,
          vx: vx * (Math.random() * 0.3 + 0.85),
          vy: vy * (Math.random() * 0.3 + 0.85),
          size: Math.random() * 1.6 + 1.1,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.014 + 0.008,
          gravity: 0.01
        });
      }
    };

    // Auto launch fireworks at random positions
    let fireworkTimer = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let anyHovered = false;
      backdropStars.forEach((s) => {
        const dist = Math.sqrt((s.x - mouseX) ** 2 + (s.y - mouseY) ** 2);
        if (dist < 12) {
          s.isHovered = true;
          anyHovered = true;
        } else {
          s.isHovered = false;
        }
      });
      canvas.style.cursor = anyHovered ? 'pointer' : 'default';
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if star clicked
      const clickedStar = backdropStars.find((s) => {
        const dist = Math.sqrt((s.x - mouseX) ** 2 + (s.y - mouseY) ** 2);
        return dist < 12;
      });

      if (clickedStar) {
        onStarClick(clickedStar.text, clickedStar.x, clickedStar.y);
      } else {
        // Otherwise launch a firework manually!
        if (Math.random() < 0.5) {
          createHeartFirework(mouseX, mouseY);
        } else {
          createFirework(mouseX, mouseY);
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw twinkling golden stars
      backdropStars.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const opacity = s.isHovered ? 1.0 : (Math.sin(s.twinkle) + 1.2) * 0.45;
        const size = s.size * (s.isHovered ? 1.35 : 1);

        ctx.save();
        ctx.fillStyle = s.isHovered ? 'rgba(255, 230, 120, 1)' : 'rgba(212, 175, 55, 0.7)';
        ctx.shadowColor = 'rgba(212, 175, 55, 1)';
        ctx.shadowBlur = s.isHovered ? 15 : 4;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 2. Auto trigger fireworks (approx every 3 seconds)
      fireworkTimer++;
      if (fireworkTimer > 160) {
        fireworkTimer = 0;
        const randomX = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
        const randomY = Math.random() * canvas.height * 0.35 + 80;
        if (Math.random() < 0.45) {
          createHeartFirework(randomX, randomY);
        } else {
          createFirework(randomX, randomY);
        }
      }

      // 3. Render and update Firework Particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity; // drop under gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // 4. Render and update stamped text overlays
      textStamps.forEach((ts, index) => {
        ts.alpha -= 0.012;
        ts.scale += 0.005;

        if (ts.alpha <= 0) {
          textStamps.splice(index, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = ts.alpha;
          ctx.fillStyle = 'rgba(255, 220, 110, 0.95)';
          ctx.shadowColor = 'rgba(255, 110, 130, 0.95)';
          ctx.shadowBlur = 15;
          ctx.font = `bold ${Math.floor(22 * ts.scale)}px font-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(ts.text, ts.x, ts.y);
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
  }, [starsList, onStarClick]);

  return (
    <div className="w-full relative h-[550px] border border-white/5 bg-black/45 rounded-3xl overflow-hidden shadow-inner">
      <div className="absolute top-4 left-6 z-20 pointer-events-none select-none">
        <span className="text-[9px] uppercase tracking-widest text-gold/75 font-light flex items-center gap-1.5 animate-pulse">
          <Sparkles size={11} className="text-gold" /> Tap anywhere to launch fireworks!
        </span>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
    </div>
  );
}

// ----------------- MAIN FINALE SECTION -----------------
export default function FinaleSection() {
  // Sequencer step: 'montage' | 'promise' | 'celebration' | 'credits' | 'surprise' | 'the-end'
  const [step, setStep] = useState<'montage' | 'promise' | 'celebration' | 'credits' | 'surprise' | 'the-end'>('montage');
  
  // Slideshow state
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Night Sky Click State
  const [activeStarText, setActiveStarText] = useState<string | null>(null);
  const [starTextPos, setStarTextPos] = useState({ x: 0, y: 0 });

  // Autoplay Slideshow montage timer
  useEffect(() => {
    if (step !== 'montage') return;

    const interval = setInterval(() => {
      setCurrentSlideIdx((prev) => {
        if (prev === finaleMemories.length - 1) {
          // when slides end, go to promise step
          clearInterval(interval);
          setStep('promise');
          return prev;
        }
        return prev + 1;
      });
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [step]);

  const handleNextSlide = () => {
    if (currentSlideIdx === finaleMemories.length - 1) {
      setStep('promise');
    } else {
      setCurrentSlideIdx((prev) => prev + 1);
    }
  };

  const handleStarTrigger = (text: string, screenX: number, screenY: number) => {
    playStarChimeAudio();
    setActiveStarText(text);
    setStarTextPos({ x: screenX, y: screenY });

    setTimeout(() => {
      setActiveStarText(null);
    }, 3000);
  };

  // Surprise Heart click final trigger
  const [surpriseUnveiled, setSurpriseUnveiled] = useState(false);
  
  const handleHeartClick = () => {
    setSurpriseUnveiled(true);
    playBoomAudio();
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#ffe3eb', '#e0a6aa', '#d4af37', '#ffffff']
      });
    });
  };

  return (
    <div
      id="finale"
      className="relative w-full min-h-screen bg-[#020104] text-soft-pink overflow-hidden py-16 flex flex-col justify-between items-center"
    >
      
      {/* 1. DEVELOPER FINALE SEQUENCER BYPASS BAR */}
      <div className="absolute top-4 right-6 z-40 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-gold/20 flex items-center gap-3 text-[9px] uppercase tracking-widest select-none">
        <span className="text-gold font-semibold flex items-center gap-1">
          <Award size={11} /> Sequencer:
        </span>
        {(['montage', 'promise', 'celebration', 'credits', 'surprise', 'the-end'] as const).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStep(s);
              if (s === 'montage') setCurrentSlideIdx(0);
            }}
            className={`hover:text-white transition-colors duration-300 cursor-pointer ${
              step === s ? 'text-gold underline font-bold' : 'text-soft-pink/55'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex flex-col justify-center relative z-20 pt-8">
        <AnimatePresence mode="wait">
          
          {/* STEP A: MEMORY MONTAGE */}
          {step === 'montage' && (
            <motion.div
              key="montage-stage"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 flex flex-col items-center text-center"
            >
              <div className="flex justify-center mb-1">
                <div className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gold flex-shrink-0 animate-pulse">
                  <Film size={20} />
                </div>
              </div>

              {/* Ken Burns image frame */}
              <div className="glass-panel-pink rounded-3xl overflow-hidden aspect-[16/10] w-full max-w-2xl relative border border-white/10 shadow-2xl bg-black">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlideIdx}
                    src={finaleMemories[currentSlideIdx].imageUrl}
                    alt={finaleMemories[currentSlideIdx].title}
                    initial={{ scale: 1.0, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 5.5, ease: 'easeOut' }} // Slow Ken burns zoom simulation
                    className="w-full h-full object-cover absolute inset-0"
                  />
                </AnimatePresence>

                {/* overlay shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Bottom slide title metadata */}
                <div className="absolute bottom-6 left-6 right-6 text-left space-y-1.5">
                  <span className="bg-gold/15 text-gold border border-gold/25 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-mono">
                    {finaleMemories[currentSlideIdx].date}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl text-white">
                    {finaleMemories[currentSlideIdx].title}
                  </h3>
                  <p className="font-cursive text-sm text-[#ebd9c3] tracking-normal leading-relaxed">
                    "{finaleMemories[currentSlideIdx].caption}"
                  </p>
                </div>
              </div>

              {/* Story text note card */}
              <div className="max-w-lg min-h-[70px]">
                <p className="text-xs md:text-sm font-light text-soft-pink/75 leading-relaxed">
                  {finaleMemories[currentSlideIdx].quote}
                </p>
              </div>

              {/* Progress dots & Next skip */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex gap-1.5">
                  {finaleMemories.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentSlideIdx ? 'w-4 bg-gold' : 'w-1.5 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNextSlide}
                  className="px-4 py-1 rounded-full glass-panel text-[9px] uppercase tracking-widest text-gold hover:text-white hover:border-gold transition-colors duration-300 flex items-center gap-1.5 cursor-pointer hover-target"
                >
                  Skip <ArrowRight size={10} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP B: FOREVER PROMISE */}
          {step === 'promise' && (
            <motion.div
              key="promise-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-6"
            >
              <Heart size={30} className="text-love-red animate-pulse" fill="currentColor" />
              
              <div className="glass-panel-pink rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl space-y-6 relative bg-black/25">
                <h2 className="font-serif text-2xl md:text-3xl text-gold">My Forever Promise</h2>
                <div className="h-[1px] w-12 bg-rose-gold/45 mx-auto" />
                
                <div className="space-y-4 font-cursive text-base md:text-lg text-[#ebdcc8] leading-relaxed">
                  <p>
                    "Kashish, as we conclude this walk down memory lane, I want to leave you with one final, unchanging promise."
                  </p>
                  <p>
                    "I promise to stand by you, shoulder to shoulder, through every single sunrise and storm that life holds. I promise to support your careers, protect your peace, and celebrate your smile every day. Loving you has been my greatest gift, and I choose you today, tomorrow, and for all our beautiful forever."
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep('celebration')}
                className="px-6 py-2 rounded-full glass-panel-pink border-gold/40 hover:border-gold text-gold hover:text-white text-[10px] uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer flex items-center gap-1.5 hover-target"
              >
                Enter Celebration <Play size={12} fill="currentColor" />
              </button>
            </motion.div>
          )}

          {/* STEP C: INTERACTIVE NIGHT SKY & GRAND FIREWORKS */}
          {step === 'celebration' && (
            <motion.div
              key="celebration-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 flex flex-col items-center"
            >
              {/* Floating golden star popup card */}
              <AnimatePresence>
                {activeStarText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    style={{
                      position: 'absolute',
                      left: `${Math.min(Math.max(starTextPos.x - 120, 20), window.innerWidth - 260)}px`,
                      top: `${starTextPos.y - 120}px`,
                      zIndex: 30,
                      pointerEvents: 'none'
                    }}
                    className="w-56 p-4 rounded-2xl glass-panel-pink border border-gold/30 shadow-2xl text-center space-y-2"
                  >
                    <div className="flex justify-center text-gold">
                      <Star size={14} fill="currentColor" className="animate-spin-slow" />
                    </div>
                    <p className="font-cursive text-xs text-[#ebd8bf] leading-relaxed">
                      {activeStarText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-gold font-light block">
                  Celebrating Kashish's Day
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-soft-pink">
                  Our Night of Light
                </h3>
              </div>

              {/* Main Fireworks Canvas */}
              <div className="w-full">
                <GrandFinaleCanvas
                  starsList={finaleStars}
                  onStarClick={handleStarTrigger}
                />
              </div>

              <button
                onClick={() => setStep('credits')}
                className="px-6 py-2 rounded-full glass-panel border-white/10 hover:border-gold text-gold hover:text-white text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                Close Celebration & Roll Credits
              </button>
            </motion.div>
          )}

          {/* STEP D: MOVIE ENDING CREDITS */}
          {step === 'credits' && (
            <motion.div
              key="credits-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full mx-auto relative h-[420px] overflow-hidden flex flex-col justify-center"
            >
              {/* Scrolling Credits loop */}
              <motion.div
                initial={{ y: 380 }}
                animate={{ y: -380 }}
                transition={{ duration: 18, ease: 'linear' }}
                onAnimationComplete={() => setStep('surprise')}
                className="text-center space-y-10 text-xs md:text-sm font-light text-soft-pink/70 font-sans"
              >
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block">Directed By</span>
                  <span className="font-serif text-base text-soft-pink block">❤️ Rohit (The Boyfriend)</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block">Leading Actress</span>
                  <span className="font-serif text-base text-gold block">Kashish ❤️</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block">Leading Actor</span>
                  <span className="font-serif text-base text-soft-pink block">The Luckiest Boyfriend in the World</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block">Story Concept</span>
                  <span className="font-serif text-base text-soft-pink block">Our Beautiful Relationship Journey</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block">Soundtrack</span>
                  <span className="font-serif text-base text-soft-pink block">Every Melody That Reminds Me of You</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold/60 block">Special Thanks</span>
                  <span className="font-serif text-base text-soft-pink block">To every laugh, walk, dinner, and smile we shared</span>
                </div>

                <div className="pt-6">
                  <span className="font-cursive text-xl text-gold block">"Based on a True Love Story."</span>
                </div>
              </motion.div>

              {/* Bypass roll skip */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => setStep('surprise')}
                  className="px-3 py-1 rounded-full glass-panel text-[8px] uppercase tracking-widest text-soft-pink/40 hover:text-white transition-colors cursor-pointer"
                >
                  Skip credits
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP E: SECRET SURPRISE HEART CLICK */}
          {step === 'surprise' && (
            <motion.div
              key="surprise-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-8 py-10"
            >
              {!surpriseUnveiled ? (
                // Heart Pulsator button closed
                <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-light block animate-pulse">
                    One Last Thing...
                  </span>
                  
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    onClick={handleHeartClick}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-love-red/80 via-love-red to-rose-gold/80 border-2 border-gold/45 shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 duration-300 hover-target mx-auto"
                  >
                    <Heart size={32} className="text-white" fill="currentColor" />
                  </motion.div>

                  <p className="text-xs font-light text-soft-pink/55">
                    Click the heart to unlock Rohit's final birthday wish.
                  </p>
                </div>
              ) : (
                // Heart Click reveal surprise thank cards
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="space-y-6 max-w-md"
                >
                  <div className="glass-panel-pink p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
                    <h3 className="font-cursive text-3xl text-gold">I Have One More Wish...</h3>
                    <p className="font-cursive text-xl text-[#ebdcc8] leading-relaxed">
                      "I hope every birthday from now on is celebrated together, hand in hand, looking at the same stars. Happy Birthday, my beautiful Kashish. ❤️"
                    </p>
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2 text-left text-xs font-light text-soft-pink/70">
                    <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block mb-1">
                      Rohit's Thank You notes:
                    </span>
                    <p>• Thank you for every single smile you brought to my face.</p>
                    <p>• Thank you for changing my life and becoming my absolute home.</p>
                    <p>• Thank you for being the gravity that holds me steady, Kashish.</p>
                  </div>

                  <button
                    onClick={() => setStep('the-end')}
                    className="px-5 py-1.5 rounded-full glass-panel border-white/10 hover:border-gold text-gold hover:text-white text-[9px] uppercase tracking-widest transition-all duration-300 cursor-pointer"
                  >
                    Close Experience
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP F: THE END... OF FOREVER */}
          {step === 'the-end' && (
            <motion.div
              key="the-end-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-20"
            >
              {/* Gentlest heartbeat fading pulse */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.45, 0.15] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-full bg-love-red flex items-center justify-center text-white"
              >
                <Heart size={14} fill="currentColor" />
              </motion.div>

              <div className="space-y-2 max-w-sm">
                <h2 className="font-serif text-3xl font-light text-soft-pink select-none">
                  The End...
                </h2>
                <span className="text-[10px] uppercase tracking-[0.35em] text-soft-pink/35 block select-none">
                  ...or perhaps...
                </span>
                <h3 className="font-cursive text-3xl text-gold text-glow-gold select-none">
                  The Beginning of Forever ❤️
                </h3>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
