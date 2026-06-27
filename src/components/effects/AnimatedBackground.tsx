import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
  type: 'star' | 'firefly' | 'heart';
  angle?: number;
  angleSpeed?: number;
  scale?: number;
  wobbleSpeed?: number;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 60;

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Draw heart path on canvas
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number
    ) => {
      context.save();
      context.beginPath();
      context.translate(x, y);
      context.scale(size / 30, size / 30);
      context.moveTo(0, -6);
      context.bezierCurveTo(-6, -16, -20, -10, -20, 2);
      context.bezierCurveTo(-20, 14, -10, 20, 0, 32);
      context.bezierCurveTo(10, 20, 20, 14, 20, 2);
      context.bezierCurveTo(20, -10, 6, -16, 0, -6);
      context.closePath();
      context.fillStyle = `rgba(255, 107, 139, ${opacity * 0.4})`; // soft rose-gold/pink
      context.shadowColor = 'rgba(255, 107, 139, 0.5)';
      context.shadowBlur = 8;
      context.fill();
      context.restore();
    };

    // Initialize particles
    const createParticle = (initY = false): Particle => {
      // Weigh particle distribution
      const rand = Math.random();
      const type = rand < 0.5 ? 'star' : rand < 0.85 ? 'firefly' : 'heart';

      const x = Math.random() * canvas.width;
      const y = initY ? Math.random() * canvas.height : canvas.height + 20; // start from bottom or scattered at start
      const size = type === 'star' ? Math.random() * 1.5 + 0.5 : type === 'firefly' ? Math.random() * 3 + 1.5 : Math.random() * 8 + 6;

      const speedX = type === 'firefly' ? (Math.random() - 0.5) * 0.4 : type === 'heart' ? (Math.random() - 0.5) * 0.2 : 0;
      const speedY = type === 'star' ? 0 : type === 'firefly' ? -(Math.random() * 0.3 + 0.1) : -(Math.random() * 0.4 + 0.2); // rising speed

      const opacity = type === 'star' ? Math.random() : 0; // fade in gradually for others
      const maxOpacity = type === 'star' ? Math.random() * 0.6 + 0.4 : type === 'firefly' ? Math.random() * 0.7 + 0.3 : Math.random() * 0.5 + 0.1;
      const fadeSpeed = Math.random() * 0.005 + 0.002;

      return {
        x,
        y,
        size,
        speedX,
        speedY,
        opacity,
        maxOpacity,
        fadeSpeed,
        type,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
      };
    };

    // Pre-populate particles across the screen height
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // Update opacity/twinkle
        if (p.type === 'star') {
          p.opacity += p.fadeSpeed;
          if (p.opacity > p.maxOpacity || p.opacity < 0.1) {
            p.fadeSpeed = -p.fadeSpeed; // reverse fade direction
          }
        } else {
          // Fade in fireflies/hearts as they rise, fade out near top
          if (p.opacity < p.maxOpacity && p.y > 100) {
            p.opacity += 0.01;
          }
          if (p.y <= 100) {
            p.opacity -= 0.008;
          }
        }

        // Update positions
        p.y += p.speedY;

        if (p.type === 'firefly') {
          // Brownian sway
          if (p.angle !== undefined && p.angleSpeed !== undefined) {
            p.angle += p.angleSpeed;
            p.x += Math.sin(p.angle) * 0.3;
          }
        } else if (p.type === 'heart') {
          // Soft pendulum sway
          if (p.angle !== undefined && p.wobbleSpeed !== undefined) {
            p.angle += p.wobbleSpeed;
            p.x += Math.sin(p.angle) * 0.2;
          }
        }

        // Draw particle based on type
        if (p.type === 'star') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ffffff';
          ctx.fill();
        } else if (p.type === 'firefly') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          // glowing firefly golden color
          ctx.fillStyle = `rgba(255, 220, 150, ${p.opacity})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 210, 100, 0.8)';
          ctx.fill();
        } else if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity);
        }

        // Reset particles that float off-screen or fade out
        if (p.y < -30 || p.opacity <= 0 || p.x < -20 || p.x > canvas.width + 20) {
          particles[index] = createParticle(false);
        }
      });

      // Reset canvas shadow for clean redraw
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden pointer-events-none bg-love-dark">
      {/* Aurora Ambient Lighting Layer */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        {/* Soft Pink Aurora Orb */}
        <div 
          className="absolute rounded-full w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] blur-[120px] bg-gradient-to-tr from-soft-pink/20 to-transparent animate-pulse-slow"
          style={{
            top: '-20%',
            left: '-10%',
            animationDuration: '10s'
          }}
        />
        {/* Lavender Aurora Orb */}
        <div 
          className="absolute rounded-full w-[90vw] h-[90vw] md:w-[70vw] md:h-[70vw] blur-[150px] bg-gradient-to-bl from-lavender/15 to-transparent animate-pulse-slow"
          style={{
            bottom: '-10%',
            right: '-15%',
            animationDuration: '12s'
          }}
        />
        {/* Peach Aurora Orb */}
        <div 
          className="absolute rounded-full w-[50vw] h-[50vw] blur-[100px] bg-gradient-to-r from-peach/10 to-transparent animate-pulse-slow"
          style={{
            top: '40%',
            right: '10%',
            animationDuration: '8s'
          }}
        />
      </div>

      {/* Canvas Particle Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Film Grain Texture Layer */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none bg-repeat mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
