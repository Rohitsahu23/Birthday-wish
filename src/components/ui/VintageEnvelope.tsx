import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface VintageEnvelopeProps {
  letterContent: string[];
  closingText: string;
  closingSign: string;
  onOpenComplete?: () => void;
}

export default function VintageEnvelope({
  letterContent = [],
  closingText,
  closingSign,
  onOpenComplete,
}: VintageEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  
  // Timer reference for text reveal delays
  const [revealedParagraphs, setRevealedParagraphs] = useState<number[]>([]);

  // Synthesize paper sound via Web Audio API
  const playPaperSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const duration = 0.55;
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // White noise fill
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to shape rustling noise
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + duration - 0.08);
      filter.Q.setValueAtTime(1.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (err) {
      console.log('Audio synthesis blocked by policy:', err);
    }
  };

  const handleOpenEnvelope = () => {
    if (isBroken) return;
    setIsBroken(true);
    playPaperSound();

    // 1. Break wax seal, wait 400ms
    setTimeout(() => {
      setIsOpen(true);
      playPaperSound();
    }, 450);

    // 2. Slide letter up, wait 1200ms before starting typing reveal
    setTimeout(() => {
      setStartTyping(true);
      if (onOpenComplete) onOpenComplete();
    }, 1800);
  };

  // Line-by-line typing stagger effect for paragraphs
  useEffect(() => {
    if (!startTyping) return;

    letterContent.forEach((_, idx) => {
      setTimeout(() => {
        setRevealedParagraphs((prev) => [...prev, idx]);
        playPaperSound(); // soft feedback click/rustle per paragraph entrance
      }, idx * 2500); // 2.5 seconds per paragraph reveal
    }, []);
  }, [startTyping, letterContent]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 relative select-none">
      
      {/* Interactive 3D CSS Envelope shell */}
      <div className="relative w-80 h-52 md:w-96 md:h-56 perspective-[1000px] mb-8">
        
        {/* ENVELOPE SHADOW */}
        <div className="absolute inset-0 w-full h-full bg-[#1b0c16]/30 blur-md rounded-2xl pointer-events-none transform translate-y-3 scale-95" />

        {/* INNER LETTER PAGE SHEET */}
        <motion.div
          animate={isOpen ? {
            y: -210, // slide up out of pocket
            scale: 1.25,
            zIndex: 40,
            transition: { delay: 0.6, duration: 1.2, type: 'spring', damping: 18 }
          } : {
            y: 10,
            scale: 0.95,
            zIndex: 10
          }}
          className="absolute inset-x-4 top-4 bg-[#faf8f3] text-love-dark rounded-xl shadow-xl p-5 md:p-6 border border-[#eceae1] overflow-hidden flex flex-col justify-between"
          style={{ minHeight: isOpen ? '360px' : '120px' }}
        >
          {isOpen ? (
            <div className="space-y-4 text-left select-text flex flex-col justify-between h-full">
              <div className="space-y-3 overflow-y-auto max-h-[260px] pr-1.5 scrollbar-thin">
                <span className="font-cursive text-[#4a3a38] text-xl font-medium tracking-wide block border-b border-[#e2decb] pb-2">
                  My Dearest Kashish ❤️
                </span>
                
                {/* Paragraphs typewriter renders */}
                <div className="space-y-3 text-[10px] md:text-xs font-light text-[#5e4e4d] leading-relaxed">
                  {letterContent.map((p, idx) => {
                    const isVisible = revealedParagraphs.includes(idx);
                    return (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.8 }}
                        className={isVisible ? 'block animate-fade-in' : 'hidden'}
                      >
                        {p}
                      </motion.p>
                    );
                  })}
                </div>
              </div>

              {/* Signature block */}
              {revealedParagraphs.includes(letterContent.length - 1) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col items-end border-t border-[#e2decb] pt-2 mt-2"
                >
                  <span className="text-[9px] font-light text-[#8c827c] italic">{closingText}</span>
                  <span className="font-cursive text-lg text-rose-gold select-none">{closingSign}</span>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30 select-none">
              <Heart size={20} className="text-love-red animate-pulse" />
            </div>
          )}
        </motion.div>

        {/* ENVELOPE BACKBODY (Shows the pocket bottom) */}
        <div className="absolute inset-0 w-full h-full bg-[#dfd5c1] border border-[#cfc4b0] rounded-xl shadow-inner z-20 overflow-hidden">
          {/* Internal diagonal side folds representation (clip-path shapes) */}
          <div className="absolute inset-0 bg-[#ebdcb8]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 60%)' }} />
          <div className="absolute inset-0 bg-[#e0d2ae]" style={{ clipPath: 'polygon(0% 100%, 0% 0%, 50% 60%)' }} />
          <div className="absolute inset-0 bg-[#ebdcb8]" style={{ clipPath: 'polygon(100% 100%, 100% 0%, 50% 60%)' }} />
          <div className="absolute inset-0 bg-[#ebdcb8]" style={{ clipPath: 'polygon(0% 100%, 100% 100%, 50% 50%)' }} />
        </div>

        {/* ENVELOPE TOP FLAP */}
        <motion.div
          animate={isOpen ? {
            rotateX: 180,
            zIndex: 15, // drops behind pocket once open
            transition: { duration: 0.6 }
          } : {
            rotateX: 0,
            zIndex: 35 // sits on top of pocket when closed
          }}
          className="absolute inset-x-0 top-0 h-1/2 bg-[#dfd4be] origin-top border-b border-[#cfc4b0] shadow-sm transform-style-3d backface-hidden"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
        >
          {/* Cover envelope address handwritten label */}
          {!isOpen && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
              <span className="font-cursive text-sm text-[#4e3c3b] tracking-wider block">
                For Kashish ❤️
              </span>
            </div>
          )}
        </motion.div>

        {/* INTERACTIVE WAX SEAL BUTTON (Floating in the center) */}
        {!isOpen && (
          <motion.div
            style={{ zIndex: 50 }}
            animate={isBroken ? {
              scale: [1, 1.15, 0],
              opacity: [1, 1, 0],
              transition: { duration: 0.5 }
            } : {
              scale: 1,
              opacity: 1
            }}
            onClick={handleOpenEnvelope}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-tr from-[#990a1f] via-[#c9183b] to-[#990a1f] border-2 border-gold/40 shadow-lg flex items-center justify-center cursor-pointer hover-target hover:scale-106 duration-300 group"
          >
            {/* Glowing heartbeat seal indicator */}
            <Heart size={16} fill="currentColor" className="text-gold/90 group-hover:scale-115 transition-transform animate-pulse" />
            
            {/* Wax seal outer ridges stamp styling */}
            <div className="absolute inset-1 rounded-full border border-gold/20 pointer-events-none" />
            <div className="absolute -inset-0.5 rounded-full border border-gold/10 opacity-30 animate-ping pointer-events-none" />
          </motion.div>
        )}

      </div>
    </div>
  );
}
