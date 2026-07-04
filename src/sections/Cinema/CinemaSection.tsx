import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Play, Heart, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import VideoCard from '../../components/ui/VideoCard';
import CinemaPlayer from '../../components/ui/CinemaPlayer';
import videosData from '../../data/videos.json';

gsap.registerPlugin(ScrollTrigger);

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

// ----------------- Sky Lantern Particle Engine -----------------
function SkyLanternCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lanterns: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      glow: number;
      glowSpeed: number;
      sway: number;
      swaySpeed: number;
    }> = [];
    const maxLanterns = 15;

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const createLantern = (initY = false) => {
      const x = Math.random() * canvas.width;
      const y = initY ? Math.random() * canvas.height : canvas.height + 30;
      const size = Math.random() * 8 + 6; // width of lantern
      const speedY = Math.random() * 0.4 + 0.3; // slowly float up
      const speedX = (Math.random() - 0.5) * 0.15;
      const glow = Math.random() * Math.PI;
      const glowSpeed = Math.random() * 0.02 + 0.01;
      const sway = Math.random() * Math.PI * 2;
      const swaySpeed = Math.random() * 0.01 + 0.005;

      return { x, y, size, speedY, speedX, glow, glowSpeed, sway, swaySpeed };
    };

    for (let i = 0; i < maxLanterns; i++) {
      lanterns.push(createLantern(true));
    }

    const drawLantern = (c: CanvasRenderingContext2D, l: typeof lanterns[0]) => {
      c.save();
      c.translate(l.x, l.y);

      // Sway offset
      const currentSway = Math.sin(l.sway) * 4;
      c.translate(currentSway, 0);

      // Pulsating glow size
      const currentGlow = (Math.sin(l.glow) + 1.2) * 5;

      // Draw lantern rectangle with rounded top
      c.beginPath();
      c.moveTo(-l.size / 2, -l.size * 0.7);
      c.quadraticCurveTo(0, -l.size * 1.5, l.size / 2, -l.size * 0.7);
      c.lineTo(l.size / 2, l.size * 0.7);
      c.lineTo(-l.size / 2, l.size * 0.7);
      c.closePath();

      // Warm yellow lantern glow fill
      const grad = c.createLinearGradient(0, -l.size * 1.2, 0, l.size * 0.7);
      grad.addColorStop(0, 'rgba(255, 230, 150, 0.95)');
      grad.addColorStop(0.5, 'rgba(255, 160, 60, 0.85)');
      grad.addColorStop(1, 'rgba(230, 80, 40, 0.7)');

      c.fillStyle = grad;
      c.shadowColor = 'rgba(255, 170, 50, 0.85)';
      c.shadowBlur = currentGlow;

      c.fill();
      c.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lanterns.forEach((l, index) => {
        l.y -= l.speedY;
        l.x += l.speedX;
        l.glow += l.glowSpeed;
        l.sway += l.swaySpeed;

        drawLantern(ctx, l);

        // Reset if off top/sides
        if (l.y < -30 || l.x < -30 || l.x > canvas.width + 30) {
          lanterns[index] = createLantern(false);
        }
      });

      ctx.shadowBlur = 0; // clear shadow
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-70"
    />
  );
}

// ----------------- MAIN CINEMA SECTION -----------------
export default function CinemaSection() {
  const videos: VideoData[] = videosData as VideoData[];

  const [playerOpen, setPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({
    url: '',
    title: '',
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const projectorIntervalRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize Film Projector ticking sounds (rhythmic clicking)
  const startProjector = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      projectorIntervalRef.current = setInterval(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(8, ctx.currentTime + 0.035);

        gain.gain.setValueAtTime(0.012, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.035);
      }, 125); // rhythmic cinema speed (approx 8 clicks per sec)
    } catch (err) {
      console.log('Projector sound synthesis blocked by policy:', err);
    }
  };

  const stopProjector = () => {
    if (projectorIntervalRef.current) {
      clearInterval(projectorIntervalRef.current);
      projectorIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  // Scroll Trigger setup to play sounds on viewport entry
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Background color morphing for cinema section
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1.2,
        }
      })
      .to(el, { backgroundColor: "#1c0d18", duration: 1 }) // Dawn violet
      .to(el, { backgroundColor: "#0c0812", duration: 1 }); // Deep cinema black

      // 2. Play projector gears sound when section is active in view
      ScrollTrigger.create({
        trigger: el,
        start: "top 60%",
        end: "bottom 40%",
        onToggle: (self) => {
          if (self.isActive) {
            startProjector();
          } else {
            stopProjector();
          }
        }
      });
    }, el);

    return () => {
      ctx.revert();
      stopProjector(); // cleanup
    };
  }, []);

  const openPlayer = (video: VideoData) => {
    setSelectedVideo({
      url: video.videoUrl,
      title: video.title,
    });
    setPlayerOpen(true);
  };

  const featuredVideo = videos[0];
  const gridVideos = videos.slice(1);

  return (
    <div
      ref={sectionRef}
      id="quotes"
      className="relative w-full overflow-hidden transition-colors duration-1000 py-24 bg-love-dark"
    >
      {/* Cinematic Projector light beam overlay flickers */}
      <motion.div
        animate={{ opacity: [0.12, 0.22, 0.08, 0.26, 0.15] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ffe4a0]/5 rounded-full pointer-events-none blur-3xl -z-10"
        style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-20">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 relative">
          
          {/* Flickering Projector Logo badge */}
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-gold flex-shrink-0 animate-pulse"
            >
              <Film size={22} />
            </motion.div>
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.35em] text-gold font-light block"
          >
            Chapter III
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-light text-soft-pink tracking-wide"
          >
            Our Love in Motion
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.65 }}
            viewport={{ once: true }}
            className="font-serif italic text-xs md:text-sm text-gold/80 max-w-md mx-auto"
          >
            "Some moments are too beautiful for photographs... they deserve to be relived."
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            className="font-cursive text-sm text-rose-gold select-none"
          >
            Every frame holds a piece of our story, Kashish.
          </motion.div>
          
          <div className="h-[1px] w-10 bg-rose-gold/40 mx-auto mt-4" />
        </div>

        {/* 1. CINEMATIC FEATURED VIDEO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: 'spring', damping: 20 }}
          onClick={() => openPlayer(featuredVideo)}
          className="glass-panel-pink rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover-target cursor-pointer flex flex-col md:flex-row relative group/featured"
        >
          {/* Video Thumbnail block */}
          <div className="md:w-3/5 aspect-[16/10] bg-black relative overflow-hidden flex items-center justify-center">
            <video
              src={featuredVideo.videoUrl}
              preload="metadata"
              muted
              playsInline
              className="w-full h-full object-cover group-hover/featured:scale-104 transition-transform duration-1000 ease-out"
            />
            {/* Dark mask overlay */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />
            
            {/* Pulsating Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full glass-panel-pink flex items-center justify-center text-gold shadow-2xl border border-gold/40"
              >
                <Play size={24} fill="currentColor" className="translate-x-0.5 text-gold" />
              </motion.div>
            </div>
          </div>

          {/* Featured details column */}
          <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <span className="bg-gold/15 text-gold border border-gold/25 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-light inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles size={10} /> Cinematic
              </span>
              <h3 className="font-serif text-lg md:text-xl lg:text-2xl text-soft-pink tracking-wide leading-tight pt-1">
                {featuredVideo.title}
              </h3>
            </div>
            
            <div className="h-[1px] w-10 bg-rose-gold/40" />

            <p className="text-xs md:text-sm font-light text-soft-pink/70 leading-relaxed font-sans">
              {featuredVideo.description}
            </p>

            <span className="text-[10px] uppercase tracking-widest text-gold/80 font-light flex items-center gap-1.5 pt-2 select-none">
              Click to Play featured clip
            </span>
          </div>
        </motion.div>

        {/* 2. NETFLIX-STYLE VIDEO SHELF GRID */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[10px] uppercase tracking-widest text-soft-pink/55 font-light">
              More Chapters in Motion
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gold font-light animate-pulse select-none">
              Hover to preview
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gridVideos.map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                onClick={() => openPlayer(v)}
              />
            ))}
          </div>
        </div>

        {/* 3. ROMANTIC QUOTE INTERCEPT DIVIDER */}
        <div className="py-8 text-center max-w-2xl mx-auto border-t border-b border-white/5 relative">
          <blockquote className="font-serif italic text-base md:text-lg text-soft-pink/85 leading-relaxed pl-4">
            "Every laugh, every glance, every single second recorded with Kashish is a priceless piece of forever. Time may pass, but these moments will stay alive, playing in my heart."
          </blockquote>
        </div>

        {/* 4. EMOTIONAL ENDING FADE TO LANTERNS */}
        <div className="relative pt-24 pb-12 w-full min-h-[350px] rounded-3xl overflow-hidden bg-black/20 border border-white/5 flex flex-col items-center justify-center text-center px-6">
          
          {/* Floating Lanterns Canvas Particle layer */}
          <SkyLanternCanvas />

          <div className="space-y-5 max-w-md relative z-10">
            <Heart size={30} className="text-love-red/20 mx-auto animate-pulse" />
            
            <h4 className="font-cursive text-4xl md:text-5xl text-gold text-glow-gold select-none">
              Some stories are written in words...
            </h4>
            
            <motion.h4
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="font-cursive text-4xl md:text-5xl text-soft-pink text-glow-pink select-none"
            >
              Ours was written in moments.
            </motion.h4>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="text-[10px] uppercase tracking-[0.25em] text-soft-pink/40 font-light leading-relaxed pt-2"
            >
              And I still have so many more memories to create with you, Kashish.
            </motion.p>
          </div>
        </div>

      </div>

      {/* Immersive Cinema Custom Controls Modal */}
      <AnimatePresence>
        {playerOpen && (
          <CinemaPlayer
            isOpen={playerOpen}
            onClose={() => setPlayerOpen(false)}
            videoUrl={selectedVideo.url}
            title={selectedVideo.title}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
