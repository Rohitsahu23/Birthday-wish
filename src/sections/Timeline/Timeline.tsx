import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import RosePetals from '../../components/effects/RosePetals';
import TimelineCard from '../../components/ui/TimelineCard';
import FullscreenModal from '../../components/ui/FullscreenModal';
import memoriesData from '../../data/memories.json';

gsap.registerPlugin(ScrollTrigger);

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

export default function Timeline() {
  const memories: Memory[] = memoriesData as Memory[];

  // Chapter State Tracker
  const [activeChapter, setActiveChapter] = useState(1);
  const [showTracker, setShowTracker] = useState(false);

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

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLDivElement | null>>([]);

  // GSAP ScrollTrigger for Background Color Morphing and active node tracking
  useEffect(() => {
    const el = timelineContainerRef.current;
    if (!el) return;

    // Background color palette for 14 chapters
    const bgColors = [
      "#120b18", // 1: Hero exit / Sunrise dawn
      "#1b0e21", // 2: Messages / Sunrise sky
      "#241026", // 3: Calls / Warm morning
      "#35122b", // 4: FaceTime / Soft lavender
      "#48122c", // 5: First Date / Peach afternoon
      "#54162e", // 6: Selfie / Rose-gold glow
      "#491932", // 7: Gift / Golden sunset
      "#3d1637", // 8: Funny memories / Sunset orange-violet
      "#2a1435", // 9: Trips / Late evening
      "#1b1030", // 10: Festivals / Twilight indigo
      "#0f1028", // 11: Cabin / Stars
      "#07152b", // 12: Challenges / Aurora
      "#041c2a", // 13: Today / Deep teal
      "#080714", // 14: Forever / Moonlight violet
      "#000000"  // Teaser exit / Fade to Black
    ];

    const ctx = gsap.context(() => {
      // 1. Background color morph timeline
      const bgTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#timeline-cards-container",
          start: "top 60%",
          end: "bottom 30%",
          scrub: 1.2,
        }
      });

      bgColors.forEach((color) => {
        bgTimeline.to(el, { backgroundColor: color, duration: 1 });
      });

      // 2. Animate center progress bar fill height
      gsap.fromTo("#timeline-progress-fill",
        { height: "0%" },
        {
          height: "100%",
          scrollTrigger: {
            trigger: "#timeline-cards-container",
            start: "top 55%",
            end: "bottom 55%",
            scrub: true,
          }
        }
      );

      // 3. Track active chapters and dispatch music sync events
      let currentTrackIndex = 0;

      triggerRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        ScrollTrigger.create({
          trigger: cardEl,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) {
              const chapterIndex = idx + 1;
              setActiveChapter(chapterIndex);

              // Music cross-fade synchronization zones (mapped across 10 chapters)
              let targetTrackIdx = 0;
              if (chapterIndex >= 1 && chapterIndex <= 2) targetTrackIdx = 0;      // Soft Piano (1)
              else if (chapterIndex >= 3 && chapterIndex <= 4) targetTrackIdx = 1;  // Acoustic (2)
              else if (chapterIndex >= 5 && chapterIndex <= 6) targetTrackIdx = 2;  // Violin (3)
              else if (chapterIndex >= 7 && chapterIndex <= 8) targetTrackIdx = 3;  // Reflection Cello (4)
              else if (chapterIndex >= 9 && chapterIndex <= 10) targetTrackIdx = 4; // Orchestra Theme (5)

              if (targetTrackIdx !== currentTrackIndex) {
                currentTrackIndex = targetTrackIdx;
                window.dispatchEvent(
                  new CustomEvent('change-track', { detail: { index: targetTrackIdx } })
                );
              }
            }
          }
        });
      });

      // 4. Toggle visibility of the floating tracker card
      ScrollTrigger.create({
        trigger: "#timeline-cards-container",
        start: "top 80%",
        end: "bottom 20%",
        onToggle: (self) => {
          setShowTracker(self.isActive);
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const openLightbox = (urls: string[], initialIndex: number) => {
    const memory = memories.find(m => m.mediaUrls[0] === urls[0]);
    if (!memory) return;

    setSelectedMedia({
      urls,
      type: memory.mediaType as 'image' | 'video',
      title: memory.title,
      date: memory.date,
      description: memory.description,
      initialIndex,
    });
    setModalOpen(true);
  };

  // Entry transitions for Cards
  const getCardVariants = (idx: number): Variants => ({
    hidden: {
      opacity: 0,
      x: idx % 2 === 0 ? -40 : 40,
      y: 20,
      filter: 'blur(8px)'
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 18 }
    }
  });

  return (
    <div
      ref={timelineContainerRef}
      id="timeline"
      className="relative w-full overflow-hidden transition-colors duration-1000 py-24 bg-love-dark"
    >
      {/* Rose Petals Ambient Effect */}
      <RosePetals />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* HEADER SECTION */}
        <div className="text-center space-y-4 mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.4em] text-gold font-light block"
          >
            Chapter I - X
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-cursive text-6xl md:text-8xl text-soft-pink text-glow-pink font-light leading-none select-none"
          >
            Our Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="font-serif italic text-sm md:text-base text-gold max-w-lg mx-auto leading-relaxed"
          >
            "Every chapter, every smile, every memory... together they became our forever."
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-xs uppercase tracking-widest text-rose-gold/90 font-light block pt-2"
          >
            A beautiful journey with Kashish ❤️
          </motion.span>
          <div className="h-[1.5px] w-12 bg-rose-gold/40 mx-auto mt-4" />
        </div>

        {/* TIMELINE CARDS AREA */}
        <div id="timeline-cards-container" className="relative mt-12 py-8">

          {/* Vertical Center Axis Lines */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 pointer-events-none rounded-full" />

          {/* Growing Progress Line */}
          <div
            id="timeline-progress-fill"
            className="absolute left-4 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-rose-gold via-gold to-rose-gold -translate-x-1/2 pointer-events-none rounded-full"
            style={{ height: '0%', boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)' }}
          />

          {/* Chapters Render */}
          <div className="space-y-16 md:space-y-24">
            {memories.map((m, idx) => {
              const isEven = idx % 2 === 0;
              const isActive = activeChapter === idx + 1;

              return (
                <div
                  key={m.id}
                  ref={(el) => { triggerRefs.current[idx] = el; }}
                  id={`timeline-card-${idx}`}
                  className="grid grid-cols-1 md:grid-cols-9 items-center gap-6 md:gap-12 relative"
                >

                  {/* Left Column Content Spacer/Card */}
                  <div className={`col-span-1 md:col-span-4 order-3 md:order-1 ${isEven ? '' : 'hidden md:block opacity-0 pointer-events-none'}`}>
                    {isEven && (
                      <motion.div
                        variants={getCardVariants(idx)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        <TimelineCard
                          memory={m}
                          index={idx}
                          onMediaClick={openLightbox}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Center Node Column containing Beating Hearts */}
                  <div className="absolute left-4 md:static col-span-1 flex justify-center items-center z-10 order-1 md:order-2">
                    <motion.div
                      animate={isActive ? {
                        scale: [1, 1.3, 1, 1.3, 1],
                        borderColor: '#d4af37',
                        backgroundColor: 'rgba(255, 107, 139, 0.45)',
                        boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)'
                      } : {
                        scale: 1,
                        borderColor: 'rgba(224, 166, 170, 0.4)',
                        backgroundColor: 'rgba(18, 11, 24, 0.85)',
                        boxShadow: 'none'
                      }}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className="w-8 h-8 rounded-full border bg-love-dark flex items-center justify-center -translate-x-1/2 md:translate-x-0 cursor-pointer select-none"
                    >
                      <Heart
                        size={12}
                        fill={isActive ? 'currentColor' : 'none'}
                        className={isActive ? 'text-love-red' : 'text-rose-gold/60'}
                      />
                    </motion.div>
                  </div>

                  {/* Right Column Content Card/Spacer */}
                  <div className={`col-span-1 md:col-span-4 pl-10 md:pl-0 order-2 md:order-3 ${!isEven ? '' : 'hidden md:block opacity-0 pointer-events-none'}`}>
                    {!isEven && (
                      <motion.div
                        variants={getCardVariants(idx)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                      >
                        <TimelineCard
                          memory={m}
                          index={idx}
                          onMediaClick={openLightbox}
                        />
                      </motion.div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* FADE TO BLACK TEASER FOOTER */}
        <div className="pt-24 pb-12 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.5 }}
            className="space-y-4"
          >
            <Heart size={36} className="text-rose-gold/30 mx-auto animate-pulse" />
            <h4 className="font-cursive text-4xl md:text-5xl text-gold text-glow-gold select-none">
              Some memories deserve more than a timeline...
            </h4>
            <p className="text-[10px] uppercase tracking-[0.25em] text-soft-pink/40 font-light max-w-sm mx-auto leading-relaxed">
              Preparing the next chapter. Scroll downwards to enter the Floating Polaroid Memory Gallery.
            </p>
          </motion.div>
        </div>

      </div>

      {/* Floating Progress Tracker Badge */}
      <AnimatePresence>
        {showTracker && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-40 glass-panel-pink px-4 py-2.5 rounded-full border border-white/10 shadow-lg text-[10px] uppercase tracking-widest text-soft-pink font-light flex items-center gap-2 select-none"
          >
            <Heart size={12} fill="currentColor" className="text-love-red animate-pulse" />
            <span>Chapter {activeChapter} of 10</span>
            <span className="text-rose-gold/50">|</span>
            <span className="text-gold font-medium">{Math.round((activeChapter / 10) * 100)}% Completed</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgraded Slideshow Lightbox Fullscreen modal */}
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
