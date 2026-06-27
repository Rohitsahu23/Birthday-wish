import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ChevronUp, ChevronDown } from 'lucide-react';
import tracksData from '../../data/music.json';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export default function MusicPlayer() {
  const tracks: Track[] = tracksData;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('love-music-volume');
    return saved !== null ? parseFloat(saved) : 0.4;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('love-music-muted');
    return saved !== null ? saved === 'true' : false;
  });
  const [isMinimized, setIsMinimized] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const visualizerRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const currentTrack = tracks[currentIdx];

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio(currentTrack.url);
    audio.volume = isMuted ? 0 : volume;
    audio.loop = false;
    audioRef.current = audio;

    // Audio Event Listeners
    const handleTimeUpdate = () => {
      if (!audio) return;
      const curr = audio.currentTime;
      const dur = audio.duration || 0;
      setProgress(dur > 0 ? (curr / dur) * 100 : 0);
      setCurrentTime(formatTime(curr));
    };

    const handleLoadedMetadata = () => {
      if (!audio) return;
      setDuration(formatTime(audio.duration));
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.volume = 0; // start at silence
      audio.play().then(() => {
        // Fade in volume over 1.5 seconds
        let currentVol = 0;
        const targetVol = isMuted ? 0 : volume;
        const fadeInterval = setInterval(() => {
          currentVol += 0.03;
          if (currentVol >= targetVol) {
            audio.volume = targetVol;
            clearInterval(fadeInterval);
          } else {
            audio.volume = currentVol;
          }
        }, 100);
      }).catch((err) => {
        console.log("Audio autoplay blocked or failed: ", err);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Persist volume state
  useEffect(() => {
    localStorage.setItem('love-music-volume', volume.toString());
  }, [volume]);

  // Persist mute state
  useEffect(() => {
    localStorage.setItem('love-music-muted', isMuted.toString());
  }, [isMuted]);

  // Listen to video play/pause signals to mute/resume background track
  useEffect(() => {
    const handleVideoPlay = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    };
    const handleVideoPause = () => {
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
      }
    };
    window.addEventListener('cinema-video-play', handleVideoPlay);
    window.addEventListener('cinema-video-pause', handleVideoPause);
    return () => {
      window.removeEventListener('cinema-video-play', handleVideoPlay);
      window.removeEventListener('cinema-video-pause', handleVideoPause);
    };
  }, [volume, isMuted]);

  // Listen to global play-love-music event for opening autoplay bridge and fade-in
  useEffect(() => {
    const handlePlayEvent = () => {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Global play trigger failed: ", err);
        });

        // Volume fade in from 0 to target volume (default is 0.4) over 2.5 seconds
        let currentVol = 0;
        audioRef.current.volume = 0;
        const targetVol = isMuted ? 0 : volume;

        const interval = setInterval(() => {
          currentVol += 0.025;
          if (currentVol >= targetVol) {
            if (audioRef.current) audioRef.current.volume = targetVol;
            clearInterval(interval);
          } else {
            if (audioRef.current) audioRef.current.volume = currentVol;
          }
        }, 150);
      }
    };

    window.addEventListener('play-love-music', handlePlayEvent);
    return () => {
      window.removeEventListener('play-love-music', handlePlayEvent);
    };
  }, [volume, isMuted]);

  // Listen to global change-track event for scroll-linked music changes with crossfades
  useEffect(() => {
    const handleTrackChangeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      const targetIdx = customEvent.detail.index;

      if (targetIdx === currentIdx || !audioRef.current) return;

      // Cross-fade: fade out current audio volume over 1.5 seconds
      let fadeOutVolume = audioRef.current.volume;
      const step = fadeOutVolume / 10;
      
      const fadeOutInterval = setInterval(() => {
        fadeOutVolume -= step;
        if (fadeOutVolume <= 0) {
          clearInterval(fadeOutInterval);
          if (audioRef.current) {
            audioRef.current.volume = 0;
            // Switch active track index
            setCurrentIdx(targetIdx);
          }
        } else {
          if (audioRef.current) audioRef.current.volume = fadeOutVolume;
        }
      }, 100);
    };

    window.addEventListener('change-track', handleTrackChangeEvent);
    return () => {
      window.removeEventListener('change-track', handleTrackChangeEvent);
    };
  }, [currentIdx, volume, isMuted]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Canvas Waveform Visualizer Loop
  useEffect(() => {
    const canvas = visualizerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 120;
    canvas.height = 30;

    const barCount = 18;
    const barWidth = 4;
    const barGap = 2;
    const heights = new Array(barCount).fill(2);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < barCount; i++) {
        // Target height based on playing state
        let targetHeight = 2;
        if (isPlaying) {
          // Generate a smooth pulsing wave index offset
          const time = Date.now() * 0.004;
          const sineValue = Math.sin(time + i * 0.4);
          targetHeight = Math.abs(sineValue) * 22 + Math.random() * 6 + 2;
        }

        // Interpolate current height for smoother frames
        heights[i] += (targetHeight - heights[i]) * 0.2;

        const x = i * (barWidth + barGap);
        const y = canvas.height - heights[i];

        // Draw bar with romantic pink-gold gradient
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, '#d4af37'); // gold top
        gradient.addColorStop(1, '#e0a6aa'); // rose-gold bottom

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Rounded top bars
        ctx.roundRect(x, y, barWidth, heights[i], 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-30 select-none">
      <AnimatePresence initial={false} mode="wait">
        {isMinimized ? (
          /* Minimized State (Compact Floating Disc) */
          <motion.div
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 rounded-full glass-panel-pink flex items-center justify-center cursor-pointer shadow-lg hover:border-gold hover:shadow-[0_0_15px_rgba(224,166,170,0.4)] relative hover-target"
          >
            {/* Spinning Disc Cover Outline */}
            <motion.div
              className="absolute inset-1 rounded-full border border-gold/40 border-dashed"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { duration: 10, repeat: Infinity, ease: 'linear' } : {}}
            />
            <Music size={20} className="text-soft-pink animate-pulse" />
            <div className="absolute -top-1 -right-1 bg-gold text-love-dark p-0.5 rounded-full">
              <ChevronUp size={12} />
            </div>
          </motion.div>
        ) : (
          /* Maximized State (Elegant Audio Player Card) */
          <motion.div
            key="maximized"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="w-72 glass-panel-pink rounded-3xl p-4 shadow-xl border border-white/10"
          >
            {/* Minimize Icon */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] uppercase tracking-widest text-gold font-light">Surprise Melody</span>
              <button 
                onClick={() => setIsMinimized(true)}
                className="text-soft-pink/60 hover:text-gold cursor-pointer p-0.5 rounded transition-colors hover-target"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-3 mb-4">
              {/* Disc Artwork */}
              <motion.div 
                className="w-12 h-12 rounded-full overflow-hidden border border-gold/40 flex-shrink-0"
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { duration: 15, repeat: Infinity, ease: 'linear' } : {}}
              >
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    // Fallback to simple gradient if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </motion.div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-medium text-soft-pink truncate">{currentTrack.title}</h4>
                <p className="text-[10px] text-soft-pink/60 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Custom Progress Bar */}
            <div className="mb-3">
              <div 
                onClick={handleSeek}
                className="h-1 bg-white/10 rounded-full cursor-pointer relative hover-target group"
              >
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-gold to-gold rounded-full"
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute w-2 h-2 rounded-full bg-gold -top-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 4px)` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-soft-pink/55 mt-1 font-light">
                <span>{currentTime}</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between mt-2">
              {/* Audio Visualizer Canvas */}
              <canvas ref={visualizerRef} className="w-[100px] h-[25px] opacity-80" />

              {/* Play buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev} 
                  className="text-soft-pink/70 hover:text-gold p-1.5 transition-colors cursor-pointer hover-target"
                  title="Previous"
                >
                  <SkipBack size={14} />
                </button>
                <button 
                  onClick={togglePlay} 
                  className="w-8 h-8 rounded-full bg-gold hover:bg-gold/80 text-love-dark flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer hover-target shadow-md"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>
                <button 
                  onClick={handleNext} 
                  className="text-soft-pink/70 hover:text-gold p-1.5 transition-colors cursor-pointer hover-target"
                  title="Next"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              {/* Mute/Volume controller with range slider */}
              <div className="flex items-center gap-1 group/vol">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-soft-pink/70 hover:text-gold p-1.5 transition-colors cursor-pointer hover-target"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : Math.round(volume * 100)}
                  onChange={(e) => {
                    const newVol = Number(e.target.value) / 100;
                    setVolume(newVol);
                    if (newVol > 0) setIsMuted(false);
                  }}
                  className="w-10 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold group-hover/vol:w-14 transition-all duration-300"
                  aria-label="Volume slider"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
