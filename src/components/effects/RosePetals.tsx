import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  color: string;
  wobble: number;
  wobbleSpeed: number;
}

export default function RosePetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];
    const maxPetals = 35; // keep small for performance

    const petalColors = [
      'rgba(255, 183, 197, 0.45)', // soft pink
      'rgba(255, 77, 109, 0.4)',   // warm rose red
      'rgba(224, 166, 170, 0.45)', // rose gold tint
      'rgba(255, 107, 139, 0.35)', // soft magenta pink
    ];

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const createPetal = (initY = false): Petal => {
      const x = Math.random() * canvas.width;
      const y = initY ? Math.random() * -canvas.height : -20; // scatter initially or spawn above
      const size = Math.random() * 12 + 8; // size range 8px to 20px
      const speedY = Math.random() * 0.8 + 0.5; // slow drift speed
      const speedX = (Math.random() - 0.5) * 0.4;
      const angle = Math.random() * Math.PI * 2;
      const spin = (Math.random() - 0.5) * 0.015;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const wobble = Math.random() * Math.PI * 2;
      const wobbleSpeed = Math.random() * 0.02 + 0.01;

      return {
        x,
        y,
        size,
        speedY,
        speedX,
        angle,
        spin,
        color,
        wobble,
        wobbleSpeed,
      };
    };

    // Populate petals
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    const drawPetal = (context: CanvasRenderingContext2D, p: Petal) => {
      context.save();
      context.translate(p.x, p.y);
      // Rotate on axis
      context.rotate(p.angle);
      // Wobble scaling to simulate flipping in 3D space
      context.scale(Math.sin(p.wobble), 1);

      context.beginPath();
      // Draw organic petal drop shape
      context.moveTo(0, 0);
      context.bezierCurveTo(-p.size / 2, p.size / 3, -p.size / 2, p.size * 1.2, 0, p.size * 1.5);
      context.bezierCurveTo(p.size / 2, p.size * 1.2, p.size / 2, p.size / 3, 0, 0);
      context.closePath();

      context.fillStyle = p.color;
      // Add subtle glow outline
      context.shadowColor = p.color;
      context.shadowBlur = 4;

      context.fill();
      context.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p, index) => {
        // Move downwards
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.25;
        p.angle += p.spin;
        p.wobble += p.wobbleSpeed;

        drawPetal(ctx, p);

        // Reset if offscreen
        if (p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
          petals[index] = createPetal(false);
        }
      });

      // Clear shadow
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
    />
  );
}
