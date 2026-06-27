import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';

interface CinemaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function CinemaPlayer({ isOpen, onClose, videoUrl, title }: CinemaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef<any>(null);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, resetControlsTimeout]);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('cinema-video-play'));
    } else {
      window.dispatchEvent(new CustomEvent('cinema-video-pause'));
    }
  }, [isOpen]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      window.dispatchEvent(new CustomEvent('cinema-video-pause'));
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
      window.dispatchEvent(new CustomEvent('cinema-video-play'));
    }
    resetControlsTimeout();
  }, [isPlaying, resetControlsTimeout]);

  // Keyboard controls listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, togglePlay, onClose]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newProgress = Number(e.target.value);
    const newTime = (newProgress / 100) * duration;
    video.currentTime = newTime;
    setProgress(newProgress);
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = Number(e.target.value);
    setVolume(newVol);
    video.volume = newVol;
    video.muted = newVol === 0;
    setIsMuted(newVol === 0);
    resetControlsTimeout();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.log('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full z-50 bg-love-dark/95 backdrop-blur-2xl flex justify-center items-center p-4 md:p-8"
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
        aria-label="Close Cinema Player"
      >
        <X size={20} />
      </motion.button>

      {/* Main Theater container */}
      <motion.div
        ref={playerContainerRef}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        onClick={(e) => e.stopPropagation()} // stop event bubbling
        onMouseMove={handleMouseMove}
        className="glass-panel-pink rounded-3xl overflow-hidden max-w-5xl w-full aspect-[16/9] relative border border-white/10 shadow-2xl flex flex-col group/player bg-black"
      >
        {/* HTML5 Video element */}
        <video
          ref={videoRef}
          src={videoUrl}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain cursor-pointer"
          autoPlay
        />

        {/* Custom Controls Bar */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col gap-3 md:gap-4 transition-opacity duration-500 z-20 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Timeline Seek Bar */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/70 font-mono select-none">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="flex-grow h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold hover:h-1.5 transition-all duration-200"
              style={{
                background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${progress}%, rgba(255,255,255,0.2) ${progress}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <span className="text-[10px] text-white/70 font-mono select-none">
              {formatTime(duration)}
            </span>
          </div>

          {/* Lower controls bar row */}
          <div className="flex items-center justify-between gap-4">
            
            {/* Play/Pause & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-full hover:bg-white/10 text-white hover:text-gold transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              
              <div className="hidden sm:block text-left">
                <span className="text-[9px] uppercase tracking-widest text-gold block font-light select-none">
                  Reliving Memory
                </span>
                <span className="text-xs text-white/80 font-serif font-light truncate max-w-[200px] block">
                  {title}
                </span>
              </div>
            </div>

            {/* Volume slider & Fullscreen */}
            <div className="flex items-center gap-4">
              {/* Volume Slider controller */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white hover:text-gold transition-colors cursor-pointer"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 md:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold"
                  style={{
                    background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-full hover:bg-white/10 text-white hover:text-gold transition-colors cursor-pointer"
                aria-label="Toggle fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>

          </div>

        </div>

      </motion.div>
    </motion.div>
  );
}
