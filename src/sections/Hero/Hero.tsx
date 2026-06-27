import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import ThreeSky from '../../components/effects/ThreeSky';
import QuoteCarousel from '../../components/ui/QuoteCarousel';
import LuxuryButton from '../../components/ui/LuxuryButton';
import AnimatedDivider from '../../components/ui/AnimatedDivider';
import { Heart, Sparkles, ChevronDown } from 'lucide-react';
import birthdayConfig from '../../data/birthday.json';

interface HeroProps {
  onBegin: () => void;
  startSequence: boolean;
}

export default function Hero({ onBegin, startSequence }: HeroProps) {
  // Stagger configurations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.35,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }, // sleek easeOutExpo
    },
  };

  const letterContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const birthdayText = "🎂 Happy Birthday";
  const nameText = birthdayConfig.targetName;

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden py-20"
    >
      {/* 3D Twinkling Sky Background */}
      <ThreeSky />

      {/* Floating Sparkle Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen z-0 opacity-30">
        <div className="absolute top-[20%] left-[30%] w-72 h-72 rounded-full blur-[100px] bg-gold/25 animate-pulse" />
        <div className="absolute bottom-[30%] right-[25%] w-96 h-96 rounded-full blur-[120px] bg-rose-gold/20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content Layout */}
      {startSequence && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-4xl px-6 flex flex-col items-center space-y-8"
        >
          {/* Item 1: Tiny Intro Text */}
          <motion.div variants={itemVariants} className="space-y-1">
            <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold font-light block drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
              Today is
            </span>
          </motion.div>

          {/* Item 2: Large Title Staggered Letter Reveal */}
          <motion.div variants={itemVariants} className="overflow-hidden py-1">
            <motion.h1 
              variants={letterContainerVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-soft-pink tracking-wide leading-none"
            >
              {Array.from(birthdayText).map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={letterVariants}
                  className="inline-block"
                  style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>

          {/* Item 3: Girlfriend's Name Cursive Reveal */}
          <motion.div 
            variants={itemVariants}
            className="relative py-2"
          >
            <motion.h2
              variants={letterContainerVariants}
              className="font-cursive text-7xl md:text-9xl text-gold text-glow-gold leading-none select-none"
            >
              {Array.from(nameText).map((char, index) => (
                <motion.span 
                  key={index} 
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>
            {/* Subtle glow behind the name */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 rounded-full blur-[40px] bg-gold/15 -z-10" />
          </motion.div>

          {/* Item 4: Subtitle */}
          <motion.p
            variants={itemVariants}
            className="max-w-md mx-auto text-xs md:text-sm font-light text-soft-pink/70 leading-relaxed tracking-wider px-4"
          >
            "{birthdayConfig.welcomeSubtitle}"
          </motion.p>

          {/* Item 5: Small Pulsing Heart Icon */}
          <motion.div
            variants={itemVariants}
            animate={{
              scale: [1, 1.2, 1, 1.2, 1],
              opacity: [0.7, 1, 0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-love-red drop-shadow-[0_0_6px_rgba(255,51,102,0.4)]"
          >
            <Heart size={18} fill="currentColor" />
          </motion.div>

          {/* Item 6: Animated Divider */}
          <motion.div variants={itemVariants} className="w-full">
            <AnimatedDivider glow={false} className="my-2" />
          </motion.div>

          {/* Item 7: Quote Carousel */}
          <motion.div variants={itemVariants} className="w-full">
            <QuoteCarousel />
          </motion.div>

          {/* Item 8: CTA Button */}
          <motion.div variants={itemVariants} className="pt-4 z-20">
            <LuxuryButton
              variant="primary"
              onClick={onBegin}
            >
              Begin Our Journey <Sparkles size={13} className="ml-1" fill="currentColor" />
            </LuxuryButton>
          </motion.div>
        </motion.div>
      )}

      {/* Floating Animated Scroll Down Hint */}
      {startSequence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 3.5, duration: 1 }}
          onClick={onBegin}
          className="absolute bottom-8 flex flex-col items-center gap-1 cursor-pointer hover-target z-20"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-soft-pink/50 font-light">Scroll Down</span>
          <ChevronDown size={14} className="text-soft-pink animate-bounce" />
        </motion.div>
      )}
    </section>
  );
}
