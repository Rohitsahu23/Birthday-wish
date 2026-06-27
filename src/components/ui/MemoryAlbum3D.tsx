import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Sparkles, BookOpen } from 'lucide-react';

interface PageData {
  title: string;
  date: string;
  location?: string;
  description: string;
  quote?: string;
  photoUrl: string;
  stickers: string[]; // array of emojis like 🌸, 💖
}

export default function MemoryAlbum3D() {
  const [activeSheet, setActiveSheet] = useState(0);
  const totalSheets = 5; // Cover, page 1/2, page 3/4, page 5/6, page 7/Back Cover

  // Synthesize realistic paper rustle sweep sound using Web Audio API
  const playPageTurnSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Generate 0.35s white noise buffer
      const duration = 0.35;
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass filter to shape white noise like rustling paper
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + duration - 0.05);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      // Volume gain envelope: rapid rise, exponential decay
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
    } catch (err) {
      console.log('Audio synthesis blocked by browser policy:', err);
    }
  };

  const handleNext = () => {
    if (activeSheet >= totalSheets - 1) return;
    setActiveSheet((prev) => prev + 1);
    playPageTurnSound();
  };

  const handlePrev = () => {
    if (activeSheet <= 0) return;
    setActiveSheet((prev) => prev - 1);
    playPageTurnSound();
  };

  // Scrapbook Spreads Content
  const albumPages: PageData[] = [
    {
      title: "The Day We Met",
      date: "April 12, 2023",
      location: "Central Park Cafe",
      description: "Do you remember the white dress you wore, Kashish? You sat across the table, playing with your coffee cup. The sun peeked through the maples, casting gold shadows. I knew then you were special.",
      quote: "A single look at Kashish, and my heart found its forever home.",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400",
      stickers: ["🌸", "☕", "❤️"]
    },
    {
      title: "Our First Coffee Date",
      date: "April 20, 2023",
      location: "The Cozy Grind Cafe",
      description: "Under warm fairy lights, we talked about everything from favorite songs to space travel. You laughed when a drop of foam landed on your nose. My favorite hour of that entire spring.",
      quote: "Hours turned to seconds when sitting across from you.",
      photoUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=400",
      stickers: ["☕", "✨", "🎈"]
    },
    {
      title: "Our First Selfie",
      date: "April 22, 2023",
      location: "Park Promenade",
      description: "Lean close, smile wide! Squeezing into the camera frame. Your head rested on mine, and we made a silly promise to keep this photo forever. It represents our beginning.",
      quote: "A happy frame holding the two of us close.",
      photoUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400",
      stickers: ["📸", "🧸", "💖"]
    },
    {
      title: "Adventures in the Rain",
      date: "July 04, 2023",
      location: "Park Promenade",
      description: "Getting caught in a sudden summer shower! We stood under a tree sharing a single tiny umbrella that didn't cover either of us. You laughed, and we danced under the gray sky.",
      quote: "Dancing with Kashish is my favorite kind of sunshine.",
      photoUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=400",
      stickers: ["🌧️", "☂️", "💃"]
    },
    {
      title: "Cabin In The Hills",
      date: "December 24, 2023",
      location: "Cozy Hills Cabin",
      description: "Cold winter breezes, hot chocolate cups, and thick cozy socks. We sat beside the fireplace writing wishes and planning a trip. You looked so snug wrapped in that giant plaid blanket.",
      quote: "Cuddled up with Kashish, the winter cold melts away.",
      photoUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400",
      stickers: ["❄️", "🔥", "☕"]
    },
    {
      title: "Forever Begins...",
      date: "The Future",
      location: "All Our Tomorrows",
      description: "To the years of laughter, the road trips, the quiet morning breakfasts, and the beautiful story we are writing day by day. Every single tomorrow is a canvas I want to paint with you.",
      quote: "You are my today and all of my tomorrows, Kashish.",
      photoUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400",
      stickers: ["💍", "✨", "👑"]
    }
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 relative">
      
      {/* SECTION ANCHOR TITLE */}
      <div className="flex items-center gap-2.5 mb-8">
        <BookOpen className="text-gold animate-bounce" size={20} />
        <h3 className="font-serif text-2xl text-soft-pink tracking-wide font-light">
          Open Our Memory Book
        </h3>
      </div>

      {/* 3D BOOK DESKTOP IMPLEMENTATION */}
      <div className="hidden md:block w-[760px] h-[520px] relative perspective-[1500px] select-none">
        
        {/* Book Binding Spine shadow overlay behind */}
        <div className="absolute left-1/2 top-0 w-8 h-full bg-[#1b0c16]/50 blur-xs -translate-x-1/2 z-0 pointer-events-none rounded-full" />

        {/* --- SHEET 0: FRONT COVER & INTRO --- */}
        <div 
          className="absolute inset-0 w-full h-full transform-style-3d transition-transform duration-1000 origin-left"
          style={{
            transform: activeSheet > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            zIndex: activeSheet > 0 ? 10 : 50,
            pointerEvents: activeSheet === 0 ? 'auto' : 'none'
          }}
        >
          {/* FRONT COVER SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-r from-[#2c1323] via-[#3d1830] to-[#2c1323] rounded-r-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-between items-center text-center">
            {/* Gold details */}
            <div className="w-full border-t border-b border-gold/30 py-1.5 text-[10px] tracking-[0.4em] text-gold uppercase font-light">
              Rohit & Kashish
            </div>
            
            <div className="space-y-4">
              <h4 className="font-serif text-4xl text-soft-pink text-glow-pink font-light tracking-widest">
                Our Journey
              </h4>
              <div className="flex justify-center items-center gap-2">
                <div className="h-[1px] w-6 bg-gold/50" />
                <Heart size={16} className="text-love-red animate-pulse" fill="currentColor" />
                <div className="h-[1px] w-6 bg-gold/50" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-gold font-light block">
                Est. April 2023
              </span>
              <button 
                onClick={handleNext}
                className="px-6 py-2 rounded-full border border-gold/40 text-gold text-[10px] uppercase tracking-widest hover:bg-gold/15 hover:border-gold transition-all duration-300 cursor-pointer hover-target"
              >
                Open Book
              </button>
            </div>
          </div>

          {/* BACK OF COVER (DEDICATION SCREEN) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f4] text-love-dark rounded-l-3xl p-10 flex flex-col justify-center items-center text-center shadow-inner border-r border-[#eceae2]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="space-y-6 max-w-sm">
              <Heart size={20} className="text-love-red mx-auto" fill="currentColor" />
              <h5 className="font-serif text-lg tracking-wide italic text-[#4e3c3b]">
                Dedicated to Kashish
              </h5>
              <p className="text-xs font-light text-[#635352] leading-relaxed">
                \"This book holds the pages of our lives, the quiet walks, the messy coffees, and the big laughs. Thank you for filling my years with magic, Kashish. This is our love story.\"
              </p>
              <div className="h-[1px] w-12 bg-rose-gold/50 mx-auto" />
              <span className="font-cursive text-base text-rose-gold">Love always, Rohit</span>
            </div>
          </div>
        </div>

        {/* --- SPREADS SHEETS 1 & 2 & 3 (PAGES CONTENT) --- */}
        {[0, 1, 2].map((sheetIdx) => {
          const leftPage = albumPages[sheetIdx * 2];
          const rightPage = albumPages[sheetIdx * 2 + 1];
          const sheetNum = sheetIdx + 1; // sheet 1, 2, 3

          return (
            <div 
              key={sheetIdx}
              className="absolute inset-0 w-full h-full transform-style-3d transition-transform duration-1000 origin-left"
              style={{
                transform: activeSheet > sheetNum ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                zIndex: activeSheet === sheetNum ? 45 : (activeSheet > sheetNum ? 10 + sheetIdx : 40 - sheetIdx),
                pointerEvents: activeSheet === sheetNum ? 'auto' : 'none'
              }}
            >
              {/* RIGHT PAGE FRONT SIDE (Shows when sheet is flat on right) */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f5] text-love-dark rounded-r-3xl border-l border-[#e2decb]/50 shadow-md p-6 flex flex-col justify-between">
                
                {/* Header */}
                <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-[#8c827c] pb-2 border-b border-[#e2decb]">
                  <span>Page {sheetNum * 2}</span>
                  <span>{rightPage.date}</span>
                </div>

                {/* Main page content layout */}
                <div className="grid grid-cols-12 gap-4 items-center flex-grow py-4">
                  {/* Text columns */}
                  <div className="col-span-7 space-y-3">
                    <h5 className="font-serif text-base font-light text-[#4a3a38] flex items-center gap-1.5">
                      <span className="text-sm select-none">{rightPage.stickers[0]}</span> {rightPage.title}
                    </h5>
                    <p className="text-[11px] font-light text-[#635352] leading-relaxed">
                      {rightPage.description}
                    </p>
                    {rightPage.quote && (
                      <p className="font-serif italic text-[10px] text-rose-gold border-l border-rose-gold/40 pl-2 py-0.5">
                        "{rightPage.quote}"
                      </p>
                    )}
                  </div>
                  {/* Image columns (Polaroid collage look) */}
                  <div className="col-span-5 flex justify-center">
                    <div className="w-28 p-2 pb-4 bg-white border border-[#e5e1d5] shadow-xs rotate-3 rounded-[1px] relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-rose-gold/10 border border-rose-gold/10 rotate-[-4deg]" />
                      <img src={rightPage.photoUrl} alt={rightPage.title} className="w-full aspect-square object-cover" />
                      <span className="font-cursive text-[7px] text-center block pt-1.5 text-[#5e5352]">{rightPage.location}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-2 border-t border-[#e2decb]">
                  <button onClick={handlePrev} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={12} /> Back
                  </button>
                  <button onClick={handleNext} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* LEFT PAGE BACK SIDE (Shows when sheet flips to the left) */}
              <div 
                className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f5] text-love-dark rounded-l-3xl border-r border-[#e2decb]/50 shadow-inner p-6 flex flex-col justify-between"
                style={{ transform: 'rotateY(180deg)' }}
              >
                {/* Header */}
                <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-[#8c827c] pb-2 border-b border-[#e2decb]">
                  <span>{leftPage.date}</span>
                  <span>Page {sheetNum * 2 - 1}</span>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-12 gap-4 items-center flex-grow py-4">
                  {/* Image Columns */}
                  <div className="col-span-5 flex justify-center">
                    <div className="w-28 p-2 pb-4 bg-white border border-[#e5e1d5] shadow-xs -rotate-2 rounded-[1px] relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-rose-gold/10 border border-rose-gold/10 rotate-3" />
                      <img src={leftPage.photoUrl} alt={leftPage.title} className="w-full aspect-square object-cover" />
                      <span className="font-cursive text-[7px] text-center block pt-1.5 text-[#5e5352]">{leftPage.location}</span>
                    </div>
                  </div>
                  {/* Text Columns */}
                  <div className="col-span-7 space-y-3">
                    <h5 className="font-serif text-base font-light text-[#4a3a38] flex items-center gap-1.5">
                      <span className="text-sm select-none">{leftPage.stickers[0]}</span> {leftPage.title}
                    </h5>
                    <p className="text-[11px] font-light text-[#635352] leading-relaxed">
                      {leftPage.description}
                    </p>
                    {leftPage.quote && (
                      <p className="font-serif italic text-[10px] text-rose-gold border-l border-rose-gold/40 pl-2 py-0.5">
                        "{leftPage.quote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center pt-2 border-t border-[#e2decb]">
                  <button onClick={handlePrev} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={12} /> Back
                  </button>
                  <button onClick={handleNext} className="text-[9px] uppercase tracking-widest text-[#8c827c] hover:text-rose-gold flex items-center gap-0.5 cursor-pointer">
                    Next <ChevronRight size={12} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {/* --- SHEET 4: BACK COVER CLOSING --- */}
        <div 
          className="absolute inset-0 w-full h-full transform-style-3d transition-transform duration-1000 origin-left"
          style={{
            transform: activeSheet >= totalSheets ? 'rotateY(-180deg)' : 'rotateY(0deg)',
            zIndex: activeSheet >= totalSheets ? 48 : 20,
            pointerEvents: activeSheet === totalSheets - 1 ? 'auto' : 'none'
          }}
        >
          {/* SPREAD FINAL NOTE SHEET FRONT */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-[#faf8f5] text-love-dark rounded-r-3xl border-l border-[#e2decb]/50 shadow-md p-10 flex flex-col justify-center items-center text-center">
            <div className="space-y-6 max-w-sm">
              <Sparkles className="text-gold mx-auto animate-pulse" size={24} />
              <h5 className="font-serif text-xl text-[#4a3a38] font-light tracking-wide">
                Our Story continues...
              </h5>
              <p className="text-xs font-light text-[#635352] leading-relaxed">
                \"We have filled so many pages, Kashish, but the blank sheets ahead are the ones I look forward to most. Let's write the rest of our chapters, together.\"
              </p>
              <div className="pt-4">
                <button 
                  onClick={handlePrev}
                  className="px-6 py-2 rounded-full border border-rose-gold/30 text-rose-gold text-[9px] uppercase tracking-widest hover:bg-rose-gold/10 hover:border-rose-gold transition-colors duration-300 cursor-pointer"
                >
                  Return to Book
                </button>
              </div>
            </div>
          </div>

          {/* BACK COVER SIDE (Shows closed book back cover) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-l from-[#2c1323] via-[#3d1830] to-[#2c1323] rounded-l-3xl border border-white/10 shadow-2xl p-8 flex flex-col justify-center items-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="text-center space-y-4">
              <Heart size={24} className="text-gold/45 mx-auto" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-light block">
                The End of Chapter I
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3D BOOK MOBILE FALLBACK VIEWER (Single page cards stacked with swipe button controls) */}
      <div className="block md:hidden w-full px-4 max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSheet}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {activeSheet === 0 ? (
              // Cover screen
              <div className="w-full h-[400px] bg-gradient-to-r from-[#2c1323] via-[#3d1830] to-[#2c1323] rounded-3xl border border-white/10 p-6 flex flex-col justify-between items-center text-center shadow-xl">
                <div className="w-full border-t border-b border-gold/30 py-1 text-[8px] tracking-[0.3em] text-gold uppercase font-light">
                  Rohit & Kashish
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-3xl text-soft-pink font-light tracking-wide">
                    Our Journey
                  </h4>
                  <Heart size={14} className="text-love-red mx-auto animate-pulse" fill="currentColor" />
                </div>
                <button 
                  onClick={handleNext}
                  className="px-6 py-2 rounded-full border border-gold/40 text-gold text-[9px] uppercase tracking-widest hover:bg-gold/10 cursor-pointer"
                >
                  Open Album
                </button>
              </div>
            ) : activeSheet >= totalSheets ? (
              // Final screen
              <div className="w-full h-[400px] bg-[#faf8f5] rounded-3xl border border-[#e2decb] p-6 flex flex-col justify-between items-center text-center shadow-xl text-love-dark">
                <Sparkles className="text-gold mt-6 animate-pulse" size={24} />
                <div className="space-y-4 px-2">
                  <h5 className="font-serif text-lg text-[#4a3a38] font-light">
                    Our Story continues...
                  </h5>
                  <p className="text-[11px] font-light text-[#635352] leading-relaxed">
                    \"We have filled so many pages, Kashish, but the blank sheets ahead are the ones I look forward to most. Let's write the rest of our chapters, together.\"
                  </p>
                </div>
                <button 
                  onClick={handlePrev}
                  className="px-6 py-2 mb-4 rounded-full border border-rose-gold/30 text-rose-gold text-[9px] uppercase tracking-widest cursor-pointer"
                >
                  Return to Book
                </button>
              </div>
            ) : (
              // Inside pages
              <div className="w-full h-[420px] bg-[#faf8f5] rounded-3xl border border-[#e2decb] p-5 flex flex-col justify-between shadow-xl text-love-dark">
                {/* Header */}
                <div className="flex justify-between items-center text-[7px] uppercase tracking-widest text-[#8c827c] pb-2 border-b border-[#e2decb]">
                  <span>Page {activeSheet}</span>
                  <span>{albumPages[activeSheet - 1].date}</span>
                </div>

                {/* Content */}
                <div className="flex flex-col items-center gap-3 py-2 flex-grow justify-center">
                  <div className="w-24 p-1.5 pb-3 bg-white border border-[#e5e1d5] shadow-xs rotate-[-2deg] rounded-[1px]">
                    <img src={albumPages[activeSheet - 1].photoUrl} alt="Album memory" className="w-full aspect-square object-cover" />
                  </div>
                  <div className="text-center space-y-1.5">
                    <h5 className="font-serif text-sm font-light text-[#4a3a38]">
                      {albumPages[activeSheet - 1].title}
                    </h5>
                    <p className="text-[10px] font-light text-[#635352] leading-relaxed max-h-[100px] overflow-y-auto px-2">
                      {albumPages[activeSheet - 1].description}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-[#e2decb]">
                  <button onClick={handlePrev} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    <ChevronLeft size={10} /> Back
                  </button>
                  <button onClick={handleNext} className="text-[8px] uppercase tracking-widest text-[#8c827c] flex items-center gap-0.5 cursor-pointer">
                    Next <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
