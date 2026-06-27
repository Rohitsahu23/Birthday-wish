import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import LuxuryButton from '../ui/LuxuryButton';

const INTRO_QUOTES = [
  "Every love story deserves a beautiful beginning...",
  "Collecting beautiful memories...",
  "Preparing your love story...",
  "Creating a walk down memory lane..."
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Count up progress
  useEffect(() => {
    const duration = 3500; // 3.5 seconds loading time
    const intervalTime = 35; // update every 35ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setIsFinished(true);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % INTRO_QUOTES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-50 bg-love-dark flex flex-col justify-center items-center overflow-hidden">
      {/* Background Aurora Orbs for Loading */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full blur-[100px] bg-gradient-to-tr from-soft-pink/30 to-transparent animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full blur-[120px] bg-gradient-to-bl from-lavender/30 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center space-y-8">
        {/* Glowing Heart Emblem */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1, 1.25, 1],
            filter: [
              'drop-shadow(0 0 10px rgba(255, 51, 102, 0.4))',
              'drop-shadow(0 0 25px rgba(255, 51, 102, 0.8))',
              'drop-shadow(0 0 10px rgba(255, 51, 102, 0.4))',
            ]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-love-red"
        >
          <Heart size={48} fill="currentColor" />
        </motion.div>

        {/* Dynamic Loading Quote */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 0.8, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.4 }}
              className="text-soft-pink/80 text-sm md:text-base font-light font-serif italic"
            >
              {INTRO_QUOTES[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loader Status */}
        <div className="w-64 space-y-3">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              /* Loading Bar & Percent */
              <motion.div
                key="loader"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {/* Visual Progress Bar */}
                <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-gold to-gold rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Numerical Percent */}
                <span className="text-xs uppercase tracking-[0.25em] text-gold font-light block">
                  {Math.round(progress)}% Loaded
                </span>
              </motion.div>
            ) : (
              /* Entrance Button once loaded */
              <motion.div
                key="button"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="pt-2"
              >
                <LuxuryButton 
                  variant="primary" 
                  onClick={onComplete}
                  className="w-full"
                >
                  Enter Journey <Heart size={12} fill="currentColor" className="ml-1 text-love-red" />
                </LuxuryButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
