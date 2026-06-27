import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Quote } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import VintageEnvelope from '../../components/ui/VintageEnvelope';
import HeartGarden from '../../components/ui/HeartGarden';
import quotesData from '../../data/quotes.json';

gsap.registerPlugin(ScrollTrigger);

interface QuoteItem {
  id: string;
  text: string;
  author: string;
  category: string;
}

export default function LoveLetterSection() {
  const quotes: QuoteItem[] = quotesData as QuoteItem[];
  
  // Quote Carousel States
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Hidden Love Notes States
  const [activeNoteText, setActiveNoteText] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<any>(null);

  // 20 Scattered Hidden Notes Copy
  const hiddenNotes = [
    "Kashish, you make my world brighter.",
    "Forever starts with you, my love.",
    "I still fall in love with you every day, Kashish.",
    "Thank you for being you, beautiful.",
    "You are my absolute favorite person, Kashish.",
    "My heart beats only for you.",
    "Kashish, you are my today and all of my tomorrows.",
    "Every laugh of yours is a treasure to me.",
    "I want to hold your hand at eighty, Kashish.",
    "Your smile is my favorite destination.",
    "You are the star that lights up my night.",
    "Kashish, my home is wherever you are.",
    "Thank you for filling my years with magic.",
    "You look absolutely beautiful, Kashish.",
    "My favorite coffee partner forever.",
    "Spontaneous road trips with you are the best.",
    "Kashish, my heart is entirely yours.",
    "I thank my stars for you every day.",
    "You make ordinary days extraordinary, Kashish.",
    "Happy Birthday, my beautiful angel."
  ];

  // Coordinates to scatter the 20 notes absolutely on desktop (margins/positions)
  const notePositions = [
    { top: '15%', left: '5%' },
    { top: '22%', right: '7%' },
    { top: '35%', left: '8%' },
    { top: '42%', right: '5%' },
    { top: '55%', left: '4%' },
    { top: '65%', right: '6%' },
    { top: '78%', left: '6%' },
    { top: '85%', right: '8%' },
    { top: '12%', right: '15%' },
    { top: '88%', left: '20%' },
    // more scattered coordinates
    { top: '48%', left: '12%' },
    { top: '62%', right: '15%' },
    { top: '30%', right: '12%' },
    { top: '70%', left: '14%' },
    { top: '18%', left: '25%' },
    { top: '25%', right: '25%' },
    { top: '5%', left: '45%' },
    { top: '92%', right: '40%' },
    { top: '96%', left: '30%' },
    { top: '50%', right: '45%' }
  ];

  // Letter copy paragraphs
  const loveLetterParagraphs = [
    "From the very moment our paths crossed, my world took on colors I never knew existed. You, Kashish, are my quiet in the storm, my laughter in the ordinary, and the beautiful melody that plays in the background of my everyday life.",
    "Every single day with you is a gift, a scrapbook page filled with shared glances, warm hugs, and dreams we are building hand in hand. You have shown me what it means to be truly loved, and for that, I am forever grateful.",
    "As we celebrate the beautiful day you were born, I want to promise you my hand, my heart, and my unconditional love for all the tomorrows yet to come. Happy Birthday, beautiful. Here is to us, and to a future that is as bright as your smile."
  ];

  // GSAP Background color shifts for letter section (twilight lavender into deep midnight violet)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.2,
        }
      })
      .to(el, { backgroundColor: "#1e0b1c", duration: 1 }) // Warm twilight magenta
      .to(el, { backgroundColor: "#0b040e", duration: 1 }); // Deep starry violet
    }, el);

    return () => ctx.revert();
  }, []);

  // Quotes Carousel Autoplay controls
  useEffect(() => {
    if (isHovered) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 7000); // rotate every 7 seconds

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isHovered, quotes.length]);

  const handleNextQuote = () => {
    setCurrentQuoteIdx((prev) => (prev + 1) % quotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentQuoteIdx((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleNoteClick = (text: string) => {
    setActiveNoteText(text);
    setNoteOpen(true);
  };

  return (
    <div
      ref={sectionRef}
      id="loveletter"
      className="relative w-full overflow-hidden transition-colors duration-1000 py-24 bg-love-dark"
    >
      {/* 20 Scattered Hidden Love Note Nodes (Desktop only to prevent clutter) */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10 select-none">
        {hiddenNotes.map((text, idx) => {
          const pos = notePositions[idx];
          return (
            <motion.div
              key={idx}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                right: pos.right,
                pointerEvents: 'auto'
              }}
              whileHover={{ scale: 1.3, y: -4 }}
              onClick={() => handleNoteClick(text)}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-love-red/40 hover:bg-love-red/10 text-love-red/35 hover:text-love-red shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer hover-target"
            >
              <Heart size={11} fill="none" className="animate-pulse" />
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-20 space-y-24">
        
        {/* CINEMATIC ENTRY SCENE GATE */}
        <div className="text-center space-y-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-4"
          >
            <p className="font-cursive text-3xl md:text-5xl text-gold text-glow-gold select-none animate-pulse">
              Some feelings cannot be expressed in photos...
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="font-cursive text-3xl md:text-5xl text-soft-pink text-glow-pink select-none"
            >
              They can only be spoken through words.
            </motion.p>
          </motion.div>
        </div>

        {/* SECTION HEADER */}
        <div className="text-center space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.35em] text-gold font-light block"
          >
            Chapter IV
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-light text-soft-pink tracking-wide"
          >
            Words From My Heart
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="font-serif italic text-xs md:text-sm text-gold/80"
          >
            "Every word here carries a piece of my soul."
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            className="font-cursive text-sm text-rose-gold select-none"
          >
            Written only for Kashish ❤️
          </motion.div>
          <div className="h-[1px] w-12 bg-rose-gold/40 mx-auto mt-4" />
        </div>

        {/* ROMANTIC QUOTE CAROUSEL */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative max-w-2xl mx-auto py-8 px-4"
        >
          {/* Main glass card carousel content */}
          <div className="glass-panel-pink rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative min-h-[160px] flex items-center justify-center text-center overflow-hidden">
            <Quote className="absolute -top-2 -left-2 w-14 h-14 text-rose-gold/10 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuoteIdx}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <p className="font-serif italic text-base md:text-xl lg:text-2xl text-soft-pink tracking-wide leading-relaxed">
                  "{quotes[currentQuoteIdx].text}"
                </p>
                <div className="h-[1px] w-8 bg-rose-gold/40 mx-auto" />
                <span className="text-[10px] uppercase tracking-widest text-gold font-light block">
                  — {quotes[currentQuoteIdx].author}
                </span>
              </motion.div>
            </AnimatePresence>

            <Quote className="absolute -bottom-2 -right-2 w-14 h-14 text-rose-gold/10 pointer-events-none rotate-180" />
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrevQuote}
            className="absolute left-[-20px] md:left-[-35px] top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-soft-pink hover:text-gold hover:border-gold transition-colors duration-300 cursor-pointer hover-target"
            aria-label="Previous quote"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextQuote}
            className="absolute right-[-20px] md:right-[-35px] top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-soft-pink hover:text-gold hover:border-gold transition-colors duration-300 cursor-pointer hover-target"
            aria-label="Next quote"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 3D LOVE LETTER CENTERPIECE */}
        <div className="relative pt-12">
          <VintageEnvelope
            letterContent={loveLetterParagraphs}
            closingText="Forever and always yours,"
            closingSign="Rohit"
          />
        </div>

        {/* INTERACTIVE HEART GARDEN CANVAS */}
        <div className="pt-20">
          <HeartGarden />
        </div>

        {/* FADE TO BLACK TEASER EXIT */}
        <div className="pt-20 pb-10 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5 }}
            className="space-y-4"
          >
            <Heart size={30} className="text-love-red/20 mx-auto animate-pulse" />
            <h4 className="font-cursive text-4xl md:text-5xl text-gold text-glow-gold select-none">
              But there is still one question left...
            </h4>
            <p className="text-[10px] uppercase tracking-[0.25em] text-soft-pink/40 font-light max-w-sm mx-auto leading-relaxed">
              Moving to Chapter V. Scroll downward to uncover 100 Reasons why I fell in love with you.
            </p>
          </motion.div>
        </div>

      </div>

      {/* Hidden Love Notes Popup Bubble Modal */}
      <AnimatePresence>
        {noteOpen && activeNoteText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-sm w-[90%] p-6 rounded-3xl glass-panel-pink border border-white/10 shadow-2xl text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-2.5 rounded-full bg-love-red/10 border border-love-red/25 text-love-red">
                <Heart size={18} fill="currentColor" />
              </div>
            </div>
            <p className="font-cursive text-lg text-[#e8c3bf] leading-relaxed select-text">
              "{activeNoteText}"
            </p>
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => setNoteOpen(false)}
                className="px-4 py-1.5 rounded-full glass-panel text-[10px] uppercase tracking-widest text-gold hover:text-white hover:border-gold transition-colors duration-300 cursor-pointer"
              >
                Close Note
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
