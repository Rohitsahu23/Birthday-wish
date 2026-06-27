import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LuxuryButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  magnetic?: boolean;
  className?: string;
}

export default function LuxuryButton({
  children,
  variant = 'primary',
  magnetic = true,
  className = '',
  ...props
}: LuxuryButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = clientX - (rect.left + rect.width / 2);
    const y = clientY - (rect.top + rect.height / 2);
    
    // Dampen the translation to keep it subtle and elegant (max 15px travel)
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative px-8 py-3.5 rounded-full uppercase tracking-widest text-xs font-light transition-all duration-300 select-none overflow-hidden cursor-pointer hover-target inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-rose-gold via-gold to-rose-gold text-love-dark font-medium shadow-[0_4px_20px_rgba(224,166,170,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] border border-white/20",
    secondary: "glass-panel-pink text-soft-pink border border-rose-gold/30 hover:border-gold hover:text-gold shadow-sm",
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.8 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Glossy light sweep overlay on hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[sweep_1.5s_ease_infinite]" />
      
      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

// Add a keyframe for button light sweep in index.css if needed, or inline it.
// Inline sweep is handled via CSS utility, but standard tailwind has standard animation classes.
// The custom keyframe can be styled easily.
