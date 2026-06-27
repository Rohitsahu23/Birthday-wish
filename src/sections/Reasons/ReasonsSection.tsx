import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeartWallItem from '../../components/ui/HeartWallItem';
import reasonsData from '../../data/reasons.json';
import birthdayConfig from '../../data/birthday.json';

gsap.registerPlugin(ScrollTrigger);

interface ReasonItem {
  id: number;
  text: string;
}

// ----------------- Procedural Audio Synth -----------------
const playHeartClickAudio = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // 1. Dual low heartbeat sweep (lub-dub)
    const playBeat = (time: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(55, time);
      osc.frequency.exponentialRampToValueAtTime(10, time + 0.13);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.13);
    };
    playBeat(now, 0.45);
    playBeat(now + 0.16, 0.35); // second heart click rebound

    // 2. Sparkling chime cascade
    const playChime = (freq: number, startDelay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + startDelay);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + startDelay + 0.35);
      gain.gain.setValueAtTime(0.025, now + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startDelay);
      osc.stop(now + startDelay + 0.35);
    };
    playChime(880, 0.04);
    playChime(1320, 0.10);
    playChime(1760, 0.16);
  } catch (err) {
    console.log('Audio Context playback blocked:', err);
  }
};

const lovePhrases = [
  "I still choose you.",
  "You are my safest place, Kashish.",
  "Forever isn't long enough.",
  "My favorite notification is yours.",
  "I'll never stop falling in love with you.",
  "Kashish, you are my home.",
  "My heart belongs to you."
];

// ----------------- MAIN REASONS SECTION -----------------
export default function ReasonsSection() {
  const reasons: ReasonItem[] = reasonsData as ReasonItem[];
  const relationshipStart = birthdayConfig.relationshipDate; // "2023-04-12T18:30:00"

  const sectionRef = useRef<HTMLDivElement>(null);

  // States
  const [openedHearts, setOpenedHearts] = useState<number[]>([]);
  const [isMerged, setIsMerged] = useState(false);
  const [counterTime, setCounterTime] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  // Floating Love Notes Emitters
  const [floatingNotes, setFloatingNotes] = useState<Array<{ id: number; text: string; x: number; y: number }>>([]);
  const noteIdRef = useRef(0);

  // 1. Live Relationship Timer calculation ticking every second
  useEffect(() => {
    const updateTime = () => {
      const start = new Date(relationshipStart);
      const now = new Date();

      const totalMs = now.getTime() - start.getTime();
      const totalSeconds = Math.floor(totalMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      // Decompose to years, months, days
      const yrs = Math.floor(totalDays / 365.25);
      const remainingDaysAfterYrs = totalDays - Math.floor(yrs * 365.25);
      const mths = Math.floor(remainingDaysAfterYrs / 30.4375);
      const dys = Math.floor(remainingDaysAfterYrs - Math.floor(mths * 30.4375));

      const hrs = totalHours % 24;
      const mins = totalMinutes % 60;
      const secs = totalSeconds % 60;

      setCounterTime({
        years: yrs,
        months: mths,
        days: dys,
        hours: hrs,
        minutes: mins,
        seconds: secs,
        totalDays
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [relationshipStart]);

  // 2. Confetti blast on viewport entry
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 40%",
      once: true,
      onEnter: () => {
        // fire initial milestone confetti celebrating relationship
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#ffe3eb', '#e0a6aa', '#d4af37']
          });
        });
      }
    });
  }, []);

  // 3. Spawns random floating love notes at random coordinates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMerged) return; // disable once completed

      const randomText = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
      const randomX = Math.random() * 65 + 15; // 15% to 80% left
      const randomY = Math.random() * 50 + 25; // 25% to 75% top
      const id = noteIdRef.current++;

      setFloatingNotes((prev) => [...prev, { id, text: randomText, x: randomX, y: randomY }]);

      // auto-remove after 4 seconds
      setTimeout(() => {
        setFloatingNotes((prev) => prev.filter((n) => n.id !== id));
      }, 4000);

    }, 6000); // spawn every 6 seconds

    return () => clearInterval(interval);
  }, [isMerged]);

  const handleHeartClick = (id: number) => {
    if (isMerged) return;

    playHeartClickAudio();

    if (!openedHearts.includes(id)) {
      const nextOpened = [...openedHearts, id];
      setOpenedHearts(nextOpened);

      // Check if all 100 hearts are discovered
      if (nextOpened.length === 100) {
        triggerMerge();
      }
    }
  };

  // Developer/User bypass debug toggle to instantly open all cards and view ending animation
  const bypassRevealAll = () => {
    playHeartClickAudio();
    const allIds = Array.from({ length: 100 }, (_, i) => i + 1);
    setOpenedHearts(allIds);
    triggerMerge();
  };

  const triggerMerge = () => {
    // wait 1 second for the final card click flip to settle, then merge
    setTimeout(() => {
      setIsMerged(true);
      // fire victory celebration fireworks
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#ffe3eb', '#d4af37', '#ffffff']
        });
      });
    }, 1200);
  };

  // Progress variables
  const progressPercent = Math.round((openedHearts.length / 100) * 100);

  return (
    <div
      ref={sectionRef}
      id="reasons"
      className="relative w-full overflow-hidden transition-colors duration-1000 py-24 bg-[#0a050d] text-soft-pink"
    >
      {/* Scattered Floating Love Note particles */}
      <AnimatePresence>
        {floatingNotes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 0.65, y: -25, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `${note.x}%`,
              top: `${note.y}%`,
              zIndex: 10,
              pointerEvents: 'none'
            }}
            className="font-cursive text-sm md:text-base text-rose-gold text-glow-pink"
          >
            {note.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 relative">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.35em] text-gold font-light block"
          >
            Chapter V
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-light text-soft-pink tracking-wide"
          >
            100 Reasons Why I Love Kashish
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="font-serif italic text-xs md:text-sm text-gold/80"
          >
            "Every reason is a piece of my heart."
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            className="font-cursive text-sm text-rose-gold select-none"
          >
            Click each heart to discover another reason.
          </motion.div>
          <div className="h-[1px] w-12 bg-rose-gold/40 mx-auto mt-4" />

          {/* Quick Reveal Bypass Trigger for review */}
          {openedHearts.length < 100 && !isMerged && (
            <button
              onClick={bypassRevealAll}
              className="absolute top-0 right-0 glass-panel border-gold/30 hover:border-gold/80 text-gold hover:text-white px-3 py-1 rounded-full text-[9px] uppercase tracking-widest flex items-center gap-1.5 duration-300 cursor-pointer"
            >
              <RefreshCw size={10} /> Quick Reveal
            </button>
          )}
        </div>

        {/* 1. LIVE RELATIONSHIP COUNTER DASHBOARD */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel-pink rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden text-center bg-black/30">
            
            {/* Background glowing bokehs */}
            <div className="absolute inset-0 bg-gradient-to-tr from-love-red/5 via-transparent to-gold/5 pointer-events-none" />

            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-light flex items-center justify-center gap-1.5 select-none">
              <Sparkles size={11} className="text-gold" /> We've Been Together, Kashish
            </span>

            {/* Time Grid Layout */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 select-none">
              
              {/* YEARS */}
              <div className="glass-panel p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-mono text-soft-pink font-light tracking-tight">
                  {counterTime.years}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-soft-pink/55 mt-1">
                  Years
                </span>
              </div>

              {/* MONTHS */}
              <div className="glass-panel p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-mono text-soft-pink font-light tracking-tight">
                  {counterTime.months}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-soft-pink/55 mt-1">
                  Months
                </span>
              </div>

              {/* DAYS */}
              <div className="glass-panel p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-mono text-soft-pink font-light tracking-tight">
                  {counterTime.days}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-soft-pink/55 mt-1">
                  Days
                </span>
              </div>

              {/* HOURS */}
              <div className="glass-panel p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-mono text-soft-pink font-light tracking-tight">
                  {counterTime.hours}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-soft-pink/55 mt-1">
                  Hours
                </span>
              </div>

              {/* MINUTES */}
              <div className="glass-panel p-3 rounded-2xl flex flex-col items-center">
                <span className="text-2xl md:text-4xl font-mono text-soft-pink font-light tracking-tight">
                  {counterTime.minutes}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-soft-pink/55 mt-1">
                  Minutes
                </span>
              </div>

              {/* SECONDS */}
              <div className="glass-panel p-3 rounded-2xl flex flex-col items-center border-gold/15">
                <motion.span
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-2xl md:text-4xl font-mono text-gold font-light tracking-tight block"
                >
                  {counterTime.seconds}
                </motion.span>
                <span className="text-[8px] uppercase tracking-wider text-gold/60 mt-1">
                  Seconds
                </span>
              </div>

            </div>

            {/* Subtext and milestone info */}
            <div className="space-y-1.5">
              <p className="text-xs font-light text-soft-pink/70 leading-relaxed font-sans italic">
                "Every second with you, Kashish, has been my absolute favorite memory."
              </p>
              <div className="text-[9px] uppercase tracking-widest text-gold font-light flex items-center justify-center gap-1.5 border-t border-white/5 pt-3">
                <AlertCircle size={10} className="text-gold" /> Total Elapsed: {counterTime.totalDays} Beautiful Days
              </div>
            </div>

          </div>
        </div>

        {/* 2. MAIN GRID WALL & COMPLETED STATE CAROUSEL */}
        <AnimatePresence mode="wait">
          {!isMerged ? (
            
            // HEART WALL GRID & PROGRESS RING
            <motion.div
              key="heart-wall"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Progress Tracker Ring block */}
              <div className="max-w-xs mx-auto flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                <span className="text-[10px] uppercase tracking-widest text-soft-pink/70 font-light flex items-center gap-1.5">
                  <Heart size={12} className="text-love-red animate-pulse" fill="currentColor" /> Reasons Uncovered
                </span>
                <span className="font-mono text-xs text-gold font-semibold">
                  {openedHearts.length} / 100 ({progressPercent}%)
                </span>
              </div>

              {/* Grid Layout of 100 hearts */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 justify-items-center">
                {reasons.map((item) => (
                  <HeartWallItem
                    key={item.id}
                    id={item.id}
                    reasonText={item.text}
                    isOpened={openedHearts.includes(item.id)}
                    onClick={() => handleHeartClick(item.id)}
                  />
                ))}
              </div>
            </motion.div>

          ) : (
            
            // GIANT GLOWING MERGED HEART TRANSITION
            <motion.div
              key="merged-heart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, type: 'spring' }}
              className="flex flex-col items-center justify-center text-center space-y-8 py-16"
            >
              {/* Huge pulsating glow heart */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                className="relative filter drop-shadow-[0_0_35px_rgba(255,77,109,0.75)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-48 h-48 text-love-red"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {/* Gold ring sparkles on heart */}
                <div className="absolute inset-4 rounded-full border-4 border-gold/15 animate-ping pointer-events-none" />
              </motion.div>

              <div className="space-y-4 max-w-lg">
                <motion.h4
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1.5 }}
                  className="font-cursive text-3xl md:text-5xl text-gold text-glow-gold select-none"
                >
                  Every reason leads to the same conclusion...
                </motion.h4>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 1.8 }}
                  className="font-cursive text-4xl md:text-6xl text-soft-pink text-glow-pink select-none"
                >
                  I love you more than words can ever express, Kashish.
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 3.5 }}
                  className="text-[10px] uppercase tracking-[0.3em] text-gold font-light block pt-4 select-none animate-pulse"
                >
                  Scroll down to discover our future dreams together.
                </motion.p>
              </div>
            </motion.div>

          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
