import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverGlow?: boolean;
  tiltEffect?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  hoverGlow = true,
  tiltEffect = true,
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Motion values for the 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse coordinate offset to degrees of rotation
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEffect || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse position relative to the element (from 0 to 1)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Normalize coordinates to -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`glass-panel-pink rounded-3xl p-6 md:p-8 relative overflow-hidden transition-shadow duration-500 cursor-pointer ${
        onClick ? 'hover-target' : ''
      } ${className}`}
      style={{
        perspective: tiltEffect ? 1000 : undefined,
        rotateX: tiltEffect ? rotateX : 0,
        rotateY: tiltEffect ? rotateY : 0,
        transformStyle: tiltEffect ? 'preserve-3d' : undefined,
        boxShadow: hovered && hoverGlow
          ? '0 20px 40px rgba(18, 11, 24, 0.4), 0 0 25px rgba(224, 166, 170, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.05)'
          : '0 8px 32px 0 rgba(18, 11, 24, 0.3)',
      }}
      whileHover={!tiltEffect ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Aurora flare effect inside the card */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-white/0 via-soft-pink/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
        style={{ transform: 'translateZ(10px)' }}
      />

      {/* Decorative luxury corners */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-rose-gold/30 rounded-tl" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-rose-gold/30 rounded-tr" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-rose-gold/30 rounded-bl" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-rose-gold/30 rounded-br" />

      {/* Card Content wrapper to support 3D transforms */}
      <div style={{ transform: tiltEffect ? 'translateZ(30px)' : 'none' }}>
        {children}
      </div>
    </motion.div>
  );
}
