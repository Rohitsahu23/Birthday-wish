import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SmoothScroll from './components/animations/SmoothScroll';
import AnimatedBackground from './components/effects/AnimatedBackground';
import CustomCursor from './components/animations/CustomCursor';
import CursorTrail from './components/effects/CursorTrail';
import LoadingScreen from './components/effects/LoadingScreen';
import Navbar from './components/layout/Navbar';
import ProgressIndicator from './components/ui/ProgressIndicator';
import MusicPlayer from './components/player/MusicPlayer';
import Hero from './sections/Hero/Hero';
import Timeline from './sections/Timeline/Timeline';
import MemoryBookSection from './sections/MemoryBook/MemoryBookSection';
import CinemaSection from './sections/Cinema/CinemaSection';
import LoveLetterSection from './sections/LoveLetter/LoveLetterSection';
import ReasonsSection from './sections/Reasons/ReasonsSection';
import ForeverSection from './sections/Forever/ForeverSection';
import FinaleSection from './sections/Finale/FinaleSection';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHeartRain, setShowHeartRain] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let buffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key.length === 1 && key >= 'a' && key <= 'z') {
        buffer = (buffer + key).slice(-7);
        if (buffer === 'kashish') {
          setShowHeartRain(true);
          setTimeout(() => setShowHeartRain(false), 5000);
          buffer = '';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoaded(true);
    // Dispatch the custom play-love-music event to unblock and fade-in the background music
    window.dispatchEvent(new CustomEvent('play-love-music'));

    setTimeout(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5500);
    }, 2000);
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(el, { offset: -80, duration: 1.5 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBeginJourney = () => {
    handleScrollTo('timeline');
  };

  return (
    <SmoothScroll>
      {/* Interactive Loading Screen Gate */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            exit={{ 
              opacity: 0, 
              scale: 1.05, 
              filter: 'blur(15px)',
              transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-50 pointer-events-auto"
          >
            <LoadingScreen onComplete={handleLoadingComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background & Cursor Systems */}
      <AnimatedBackground />
      <CustomCursor />
      <CursorTrail />

      {/* Floating Layout Indicators */}
      <Navbar />
      <ProgressIndicator />
      <MusicPlayer />

      {/* Hero Header Section */}
      <Hero onBegin={handleBeginJourney} startSequence={isLoaded} />

      {/* Scroll-Driven Timeline Chapter */}
      <Timeline />

      {/* Scattered Polaroids & 3D Album Memory Book */}
      <MemoryBookSection />

      {/* Cinematic Video Shelf Section */}
      <CinemaSection />

      {/* Scattered Notes, Quote Carousel & Interactive Envelope Letter */}
      <LoveLetterSection />

      {/* 100 Reasons Why I Love You & Live Counter Section */}
      <ReasonsSection />

      {/* Scattered Stars, Dream Grid, Promises Wall & Birthday Wishes Carousel */}
      <ForeverSection />

      {/* Grand Cinematic Finale, Fireworks, Credits & Birthday Surprise */}
      <FinaleSection />

      {/* Easter Egg Floating Heart Rain overlay */}
      {showHeartRain && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 40 }).map((_, idx) => {
            const delay = idx * 0.12;
            const left = Math.random() * 100;
            const size = Math.random() * 20 + 15;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: '110vh', x: `${left}vw` }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  y: '-10vh',
                  x: [`${left}vw`, `${left + (Math.random() * 12 - 6)}vw`] 
                }}
                transition={{ duration: 3.8, delay, ease: 'easeOut' }}
                className="absolute text-love-red select-none"
                style={{ fontSize: size }}
              >
                ❤️
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Made with Love bottom-left toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-40 p-4 rounded-2xl glass-panel-pink border border-gold/30 shadow-2xl flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="font-cursive text-xs text-[#ebdcc8] select-none">
              Made with endless love for Kashish ❤️
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </SmoothScroll>
  );
}
