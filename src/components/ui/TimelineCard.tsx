import { Calendar, MapPin, Heart, Quote } from 'lucide-react';
import GlassCard from './GlassCard';

interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  quote: string;
  mediaUrls: string[];
  mediaType: string;
  category: string;
  icon: string;
}

interface TimelineCardProps {
  memory: Memory;
  index: number;
  onMediaClick: (urls: string[], initialIndex: number) => void;
}

export default function TimelineCard({ memory, index: _index, onMediaClick }: TimelineCardProps) {
  const { title, date, location, description, quote, mediaUrls, icon } = memory;

  // Collage presenter based on image count
  const renderCollage = () => {
    if (!mediaUrls || mediaUrls.length === 0) return null;

    if (mediaUrls.length === 1) {
      return (
        <div 
          onClick={() => onMediaClick(mediaUrls, 0)}
          className="w-full aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 cursor-pointer relative group/img"
        >
          <img 
            src={mediaUrls[0]} 
            alt={title} 
            className="w-full h-full object-cover group-hover/img:scale-104 transition-transform duration-700 ease-out" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[10px] uppercase tracking-widest text-gold font-light pointer-events-none">
            Expand Image
          </div>
        </div>
      );
    }

    if (mediaUrls.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-3 aspect-[16/10]">
          {mediaUrls.map((url, i) => (
            <div 
              key={i}
              onClick={() => onMediaClick(mediaUrls, i)}
              className="w-full h-full overflow-hidden rounded-2xl border border-white/5 cursor-pointer relative group/img"
            >
              <img 
                src={url} 
                alt={`${title} ${i}`} 
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[9px] uppercase tracking-widest text-gold font-light pointer-events-none">
                Expand
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 3 or more photos mosaic collage
    return (
      <div className="grid grid-cols-3 gap-3 aspect-[16/10]">
        <div 
          onClick={() => onMediaClick(mediaUrls, 0)}
          className="col-span-2 w-full h-full overflow-hidden rounded-2xl border border-white/5 cursor-pointer relative group/img"
        >
          <img 
            src={mediaUrls[0]} 
            alt={`${title} 0`} 
            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[9px] uppercase tracking-widest text-gold font-light pointer-events-none">
            Expand
          </div>
        </div>
        <div className="grid grid-rows-2 gap-3 h-full">
          {mediaUrls.slice(1, 3).map((url, i) => (
            <div 
              key={i}
              onClick={() => onMediaClick(mediaUrls, i + 1)}
              className="w-full h-full overflow-hidden rounded-2xl border border-white/5 cursor-pointer relative group/img"
            >
              <img 
                src={url} 
                alt={`${title} ${i + 1}`} 
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out" 
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center text-[9px] uppercase tracking-widest text-gold font-light pointer-events-none">
                Expand
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GlassCard 
      tiltEffect={true} 
      className="w-full space-y-5"
    >
      {/* Top Details row */}
      <div className="flex flex-wrap justify-between items-center text-[10px] uppercase tracking-wider text-soft-pink/55 border-b border-white/5 pb-2">
        <span className="flex items-center gap-1.5 font-light">
          <Calendar size={11} className="text-rose-gold" /> {date}
        </span>
        <span className="flex items-center gap-1 font-light">
          <MapPin size={11} className="text-rose-gold" /> {location}
        </span>
      </div>

      {/* Title with Emoji Icon */}
      <div className="flex items-center gap-2.5">
        <span className="text-2xl animate-pulse filter drop-shadow-[0_0_6px_rgba(255,107,139,0.3)] select-none">
          {icon}
        </span>
        <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-soft-pink tracking-wide font-light">
          {title}
        </h3>
      </div>

      {/* Description text */}
      <p className="text-xs md:text-sm font-light text-soft-pink/70 leading-relaxed font-sans">
        {description}
      </p>

      {/* Image Collage component */}
      {renderCollage()}

      {/* Chapter specific romantic quote */}
      {quote && (
        <div className="glass-panel rounded-2xl p-4 border border-rose-gold/10 relative overflow-hidden group">
          <Quote className="absolute -top-1 -left-1 w-10 h-10 text-rose-gold/10 pointer-events-none" />
          <p className="font-serif italic text-xs text-glow-pink text-soft-pink/90 leading-relaxed pl-5 relative z-10">
            "{quote}"
          </p>
          {/* Subtle heartbeat in corner */}
          <Heart size={9} className="absolute bottom-2.5 right-2.5 text-love-red/35 group-hover:text-love-red transition-colors animate-pulse" />
        </div>
      )}
    </GlassCard>
  );
}
