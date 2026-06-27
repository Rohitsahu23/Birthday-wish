import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

import PolaroidCard from '../../components/ui/PolaroidCard';
import MemoryAlbum3D from '../../components/ui/MemoryAlbum3D';
import FullscreenModal from '../../components/ui/FullscreenModal';
import polaroidsData from '../../data/polaroids.json';

interface PolaroidData {
  id: string;
  title: string;
  date: string;
  location?: string;
  caption: string;
  mediaUrls: string[];
  mediaType: string;
  favorite: boolean;
  rotation: number;
  scale: number;
}

export default function MemoryBookSection() {
  const polaroids: PolaroidData[] = polaroidsData as PolaroidData[];

  // Fullscreen Slideshow Lightbox States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState({
    urls: [] as string[],
    type: 'image' as 'image' | 'video',
    title: '',
    date: '',
    description: '',
    initialIndex: 0,
  });

  const handlePolaroidClick = (urls: string[], initialIndex: number) => {
    const item = polaroids.find(p => p.mediaUrls[0] === urls[0]);
    if (!item) return;

    setSelectedMedia({
      urls,
      type: item.mediaType as 'image' | 'video',
      title: item.title,
      date: item.date,
      description: item.caption,
      initialIndex,
    });
    setModalOpen(true);
  };

  return (
    <div 
      id="gallery" 
      className="relative w-full overflow-hidden bg-gradient-to-b from-love-dark via-[#2b1224] to-love-dark py-20 text-soft-pink"
    >
      {/* 1. SCROLL-INTO CINEMATIC SCENE TRANSITION GATE */}
      <div className="max-w-4xl mx-auto px-6 pb-16 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="space-y-4"
        >
          <p className="font-cursive text-3xl md:text-5xl text-gold text-glow-gold select-none animate-pulse">
            Some memories deserve more than a timeline...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 0.8, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="space-y-2"
        >
          <h4 className="font-serif text-lg md:text-xl font-light text-soft-pink/80 tracking-widest uppercase">
            Let's open our memory book.
          </h4>
          <div className="h-[1px] w-8 bg-rose-gold/40 mx-auto mt-2" />
        </motion.div>
      </div>

      {/* 2. SCRAPBOOK DESK TABLETOP LAYOUT */}
      <div className="relative w-full max-w-6xl mx-auto px-6 py-12 bg-black/10 rounded-[40px] border border-white/5 backdrop-blur-xs shadow-inner overflow-hidden">
        
        {/* Candlelight warm radial glows */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#ff7b4d]/8 opacity-10 pointer-events-none blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#d4af37]/8 opacity-10 pointer-events-none blur-3xl" />

        {/* SECTION HEADER */}
        <div className="text-center space-y-3 mb-16 relative z-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.3em] text-gold font-light block"
          >
            Chapter II
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-3xl md:text-5xl font-light text-soft-pink tracking-wide"
          >
            Our Memory Book
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-serif italic text-xs md:text-sm text-gold/80"
          >
            "Every picture holds a story, every smile holds a memory."
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-cursive text-sm text-rose-gold select-none"
          >
            Made with love for Kashish ❤️
          </motion.div>
        </div>

        {/* FLOATING POLAROID SCATTERED GALLERY */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-14 pb-20 relative z-10">
          {polaroids.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
            >
              <PolaroidCard
                polaroid={p}
                onClick={handlePolaroidClick}
              />
            </motion.div>
          ))}
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

        {/* INTERACTIVE 3D ALBUM */}
        <div className="relative z-10">
          <MemoryAlbum3D />
        </div>

        {/* FADE TO BLACK EXIT TEASER */}
        <div className="pt-20 pb-10 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5 }}
            className="space-y-4"
          >
            <Heart size={30} className="text-love-red/20 mx-auto animate-pulse" />
            <h4 className="font-cursive text-4xl md:text-5xl text-gold text-glow-gold select-none">
              Some feelings are too deep for pictures alone...
            </h4>
            <p className="text-[10px] uppercase tracking-[0.25em] text-soft-pink/40 font-light max-w-sm mx-auto leading-relaxed">
              Moving to Chapter III. Scroll downward to enter our Cinematic Video Memory archive.
            </p>
          </motion.div>
        </div>

      </div>

      {/* Lightbox Slideshow Fullscreen modal */}
      <AnimatePresence>
        {modalOpen && (
          <FullscreenModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            mediaUrls={selectedMedia.urls}
            mediaType={selectedMedia.type}
            title={selectedMedia.title}
            date={selectedMedia.date}
            description={selectedMedia.description}
            initialIndex={selectedMedia.initialIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
