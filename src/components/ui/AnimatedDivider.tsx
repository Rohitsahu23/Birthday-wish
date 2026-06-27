import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface AnimatedDividerProps {
  className?: string;
  glow?: boolean;
}

export default function AnimatedDivider({ className = '', glow = true }: AnimatedDividerProps) {
  return (
    <div className={`relative flex items-center justify-center w-full my-12 ${className}`}>
      {/* Left Golden Line */}
      <div className="h-[1px] w-full max-w-[150px] md:max-w-[250px] bg-gradient-to-r from-transparent via-rose-gold/40 to-gold/60" />
      
      {/* Central Pulsating Heart Icon */}
      <motion.div
        className={`mx-4 text-rose-gold relative ${glow ? 'drop-shadow-[0_0_8px_rgba(224,166,170,0.6)]' : ''}`}
        animate={{
          scale: [1, 1.2, 1, 1.2, 1],
        }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <Heart size={16} fill="currentColor" className="text-rose-gold" />
      </motion.div>

      {/* Right Golden Line */}
      <div className="h-[1px] w-full max-w-[150px] md:max-w-[250px] bg-gradient-to-r from-gold/60 via-rose-gold/40 to-transparent" />
    </div>
  );
}
