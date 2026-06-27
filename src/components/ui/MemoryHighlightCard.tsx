import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface MemoryHighlightCardProps {
  photoUrl: string;
  date: string;
  caption: string;
  onClick?: () => void;
}

export default function MemoryHighlightCard({
  photoUrl,
  date,
  caption,
  onClick,
}: MemoryHighlightCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-panel-pink rounded-3xl overflow-hidden shadow-md border border-white/5 hover:border-gold/30 transition-colors duration-500 cursor-pointer hover-target flex flex-col h-full group"
    >
      {/* Photo Showcase */}
      <div className="relative aspect-[4/3] overflow-hidden bg-love-dark/20">
        <img
          src={photoUrl}
          alt={caption}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-love-dark/50 via-transparent to-transparent pointer-events-none" />
        
        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 bg-love-dark/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5 text-[9px] uppercase tracking-widest text-gold font-light shadow-sm">
          {date}
        </div>
      </div>

      {/* Narrative Info */}
      <div className="p-4 flex-grow flex items-center justify-between gap-4">
        <p className="text-xs font-light text-soft-pink/80 leading-relaxed group-hover:text-soft-pink transition-colors duration-300">
          {caption}
        </p>
        
        {/* Heart Icon indicator */}
        <motion.div
          whileHover={{ scale: 1.25 }}
          className="text-love-red/40 group-hover:text-love-red drop-shadow-[0_0_4px_rgba(255,51,102,0)] group-hover:drop-shadow-[0_0_6px_rgba(255,51,102,0.4)] transition-all duration-300 flex-shrink-0"
        >
          <Heart size={13} fill="currentColor" />
        </motion.div>
      </div>
    </motion.div>
  );
}
