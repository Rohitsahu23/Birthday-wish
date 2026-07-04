import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Heart, Sparkles } from 'lucide-react';

interface PolaroidData {
  id: string;
  title?: string;
  date?: string;
  location?: string;
  caption?: string;
  mediaUrls: string[];
  mediaType: string;
  favorite: boolean;
  rotation: number;
  scale: number;
}

interface PolaroidCardProps {
  polaroid: PolaroidData;
  onClick: (mediaUrls: string[], initialIndex: number) => void;
}

export default function PolaroidCard({ polaroid, onClick }: PolaroidCardProps) {
  const { title, date, location, caption, mediaUrls, favorite, rotation, scale } = polaroid;

  // 3D Tilt Hook
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Translate mouse coordinate grids into rotate angle limits (-15deg to +15deg)
  const rotateX = useTransform(y, [-150, 150], [12, -12]);
  const rotateY = useTransform(x, [-150, 150], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(mediaUrls, 0)}
      style={{
        rotate: rotation,
        scale: scale,
        rotateX: rotateX,
        rotateY: rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ 
        y: -15, 
        scale: scale * 1.03,
        zIndex: 30,
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className={`relative w-64 p-3.5 pb-6 bg-[#fbfaf6] border border-[#e8e6df] shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer select-none group border-b-[18px] border-b-[#fcfbf9] rounded-[2px] ${
        favorite 
          ? 'shadow-[0_0_20px_rgba(212,175,55,0.25)] border-gold/40 hover:border-gold/60' 
          : ''
      }`}
    >
      {/* Decorative Washi Tape Sticker on top */}
      <div 
        className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 opacity-70 group-hover:opacity-90 transition-opacity rotate-1 z-10 border shadow-xs select-none pointer-events-none ${
          favorite 
            ? 'bg-gold/25 border-gold/30 backdrop-blur-xs' 
            : 'bg-rose-gold/20 border-rose-gold/20 backdrop-blur-xs'
        }`}
        style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)' }}
      />

      {/* Gold Ribbon Overlay for Favorites */}
      {favorite && (
        <div className="absolute -top-1 -right-1 w-14 h-14 overflow-hidden pointer-events-none z-10 select-none">
          <div className="absolute top-2 right-[-24px] rotate-45 w-20 py-0.5 bg-gold border border-white/20 text-[6px] uppercase tracking-widest text-center text-love-dark font-medium shadow-sm">
            Favorite
          </div>
        </div>
      )}

      {/* Main Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-love-dark/5 border border-[#e2decb]/60 rounded-[1px]">
        <img
          src={mediaUrls[0]}
          alt={title || "Polaroid Memory"}
          className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
          loading="lazy"
        />
        {/* Paper texture overlay shadow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Scrapbook handwritten labels and descriptors */}
      <div className="pt-4 px-1 space-y-2 relative">
        {(date || location) && (
          <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-soft-pink/60 font-medium">
            <span>{date}</span>
            {location && (
              <span className="flex items-center gap-0.5 text-gold/80 font-light">
                <MapPin size={8} /> {location}
              </span>
            )}
          </div>
        )}

        {caption && (
          <p className="font-cursive text-sm text-[#4e3e3b] leading-tight text-glow-none text-left tracking-wide">
            {caption}
          </p>
        )}

        {/* Tiny heart doodle in the bottom corner */}
        <div className="absolute -bottom-2 right-1 text-love-red/20 group-hover:text-love-red group-hover:scale-120 transition-all duration-300">
          <Heart size={11} fill={favorite ? 'currentColor' : 'none'} className="animate-pulse" />
        </div>
        
        {/* Floating star sparkles on hover for favorite memory */}
        {favorite && (
          <div className="absolute top-[-30px] left-2 text-gold/30 group-hover:text-gold group-hover:scale-125 transition-all duration-500 pointer-events-none">
            <Sparkles size={12} className="animate-bounce" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
