import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quotesData from '../../data/quotes.json';

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export default function QuoteCarousel() {
  const quotes: Quote[] = quotesData;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // Rotate quotes every 5 seconds
    
    return () => clearInterval(timer);
  }, [quotes.length]);

  const current = quotes[index];

  return (
    <div className="h-32 flex flex-col justify-center items-center text-center max-w-2xl mx-auto px-4 overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 0.85, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="space-y-3"
        >
          {/* Quote Text */}
          <p className="font-serif italic text-sm md:text-base lg:text-lg text-soft-pink/90 leading-relaxed max-w-xl mx-auto">
            "{current.text}"
          </p>
          
          {/* Quote Author */}
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-light block">
            — {current.author}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
