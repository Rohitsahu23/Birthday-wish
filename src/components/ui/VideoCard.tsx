import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Clock } from 'lucide-react';

interface VideoData {
  id: string;
  title: string;
  date?: string;
  duration: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  favorite: boolean;
}

interface VideoCardProps {
  video: VideoData;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const { title, duration, description, videoUrl, favorite } = video;
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play/pause video preview based on hover state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isHovered) {
      // Small delay to prevent play spamming on fast hovers
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Silent catch for browser autoplay block overrides
          console.log('Autoplay preview blocked:', err);
        });
      }
    } else {
      videoElement.pause();
      videoElement.currentTime = 0; // reset preview
    }
  }, [isHovered]);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`glass-panel-pink rounded-3xl overflow-hidden shadow-lg border border-white/5 hover:border-gold/30 transition-colors duration-500 cursor-pointer hover-target flex flex-col h-full group ${
        favorite ? 'shadow-[0_0_15px_rgba(212,175,55,0.2)] border-gold/25' : ''
      }`}
    >
      {/* Video Preview Frame */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        
        {/* Autoplay Video player (acts as thumbnail preview when not hovered) */}
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Shadow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
          {favorite && (
            <span className="bg-gold/90 text-love-dark px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-semibold flex items-center gap-1 shadow-sm">
              <Heart size={8} fill="currentColor" /> Favorite
            </span>
          )}
        </div>

        {/* Duration badge bottom-right */}
        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white/95 font-mono tracking-wider flex items-center gap-1 z-10">
          <Clock size={10} className="text-rose-gold" /> {duration}
        </div>

        {/* Floating Play Button Indicator on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            animate={isHovered ? { scale: 1.15, opacity: 1 } : { scale: 1, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 rounded-full glass-panel-pink flex items-center justify-center text-gold shadow-lg border border-gold/30"
          >
            <Play size={18} fill="currentColor" className="translate-x-0.5 text-gold" />
          </motion.div>
        </div>

      </div>

      {/* Description metadata */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
        <h4 className="font-serif text-sm md:text-base text-soft-pink tracking-wide group-hover:text-soft-pink transition-colors duration-300">
          {title}
        </h4>
        <p className="text-[11px] font-light text-soft-pink/65 leading-relaxed font-sans line-clamp-2">
          {description}
        </p>
      </div>

    </motion.div>
  );
}
