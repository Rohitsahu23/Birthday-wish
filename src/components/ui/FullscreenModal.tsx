import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrls: string[];
  mediaType: 'image' | 'video';
  title: string;
  date?: string;
  description?: string;
  initialIndex?: number;
}

export default function FullscreenModal({
  isOpen,
  onClose,
  mediaUrls = [],
  mediaType = 'image',
  title,
  date,
  description,
  initialIndex = 0,
}: FullscreenModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Sync index when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleNext = useCallback(() => {
    if (mediaUrls.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % mediaUrls.length);
  }, [mediaUrls]);

  const handlePrev = useCallback(() => {
    if (mediaUrls.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  }, [mediaUrls]);

  // Keyboard navigation listeners
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mediaUrls, activeIndex, handleNext, handlePrev, onClose]);

  if (!isOpen || mediaUrls.length === 0) return null;

  const currentMediaUrl = mediaUrls[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full z-50 bg-love-dark/95 backdrop-blur-2xl flex flex-col justify-center items-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Top Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.2 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full glass-panel-pink text-soft-pink hover:text-gold hover:border-gold transition-colors duration-300 cursor-pointer hover-target"
        aria-label="Close modal"
      >
        <X size={20} />
      </motion.button>

      {/* Main Glass Media Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()} // prevent modal close on clicking container
        className="glass-panel-pink rounded-3xl overflow-hidden max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row relative border border-white/10"
      >
        {/* Media Frame & Slideshow Controls */}
        <div className="md:w-3/5 bg-black/40 flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-[480px] relative group/frame">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              {mediaType === 'video' ? (
                <video
                  src={currentMediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-[80vh]"
                />
              ) : (
                <img
                  src={currentMediaUrl}
                  alt={title}
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-[80vh]"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          {mediaUrls.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-soft-pink hover:text-gold hover:border-gold transition-all duration-300 opacity-60 group-hover/frame:opacity-100 cursor-pointer hover-target"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Right Arrow */}
          {mediaUrls.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass-panel text-soft-pink hover:text-gold hover:border-gold transition-all duration-300 opacity-60 group-hover/frame:opacity-100 cursor-pointer hover-target"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Image Counter Badge */}
          {mediaUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass-panel text-[10px] uppercase tracking-widest text-soft-pink/80 select-none">
              {activeIndex + 1} of {mediaUrls.length}
            </div>
          )}
        </div>

        {/* Narrative Panel */}
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            {date && (
              <span className="text-[10px] uppercase tracking-widest text-gold font-light block">
                {date}
              </span>
            )}
            <h3 className="font-serif text-xl md:text-2xl text-soft-pink tracking-wide leading-tight">
              {title}
            </h3>
          </div>

          <div className="h-[1px] w-12 bg-rose-gold/40" />

          {description && (
            <p className="text-xs md:text-sm font-light text-soft-pink/70 leading-relaxed max-h-[220px] overflow-y-auto pr-2">
              {description}
            </p>
          )}

          <div className="pt-2 text-[9px] uppercase tracking-widest text-rose-gold/40 font-light select-none">
            {mediaUrls.length > 1 ? 'Use arrows or keyboard to navigate' : 'Click outside to close'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
