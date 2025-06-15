
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  mass: number;
  gravity: number;
}

interface OptimizedParticleSystemProps {
  particleCount?: number;
  speed?: number;
  colors?: string[];
  quality?: 'basic' | 'enhanced' | 'premium';
}

const OptimizedParticleSystem = ({ 
  particleCount = 30, 
  speed = 0.5, 
  colors = ['rgba(124, 58, 237, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)', 'rgba(236, 72, 153, 0.2)'],
  quality = 'enhanced'
}: OptimizedParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastFrameTime = useRef(0);

  const createParticle = (): Particle => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    z: Math.random() * 100 - 50,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    vz: (Math.random() - 0.5) * speed * 0.5,
    life: 0,
    maxLife: 200 + Math.random() * 300,
    size: 1 + Math.random() * (quality === 'basic' ? 2 : 4),
    color: colors[Math.floor(Math.random() * colors.length)],
    mass: 0.1 + Math.random() * 0.3,
    gravity: -0.001 + Math.random() * 0.002
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles with reduced count based on quality
    const effectiveParticleCount = quality === 'basic' ? Math.min(particleCount, 15) : 
                                  quality === 'enhanced' ? Math.min(particleCount, 30) : 
                                  particleCount;
    
    particlesRef.current = Array.from({ length: effectiveParticleCount }, createParticle);

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse updates for better performance
      if (quality === 'basic') return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = (currentTime: number) => {
      // Frame rate limiting for lower performance
      const targetFPS = quality === 'basic' ? 30 : quality === 'enhanced' ? 45 : 60;
      const frameInterval = 1000 / targetFPS;
      
      if (currentTime - lastFrameTime.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        // Simplified physics for basic quality
        if (quality !== 'basic') {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.003;
            particle.vy += (dy / distance) * force * 0.003;
          }
        }

        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.life++;

        // Apply drag
        const dragFactor = quality === 'basic' ? 0.995 : 0.998;
        particle.vx *= dragFactor;
        particle.vy *= dragFactor;
        particle.vz *= dragFactor;

        // Boundary wrapping
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle();
          return;
        }

        // Simplified rendering for basic quality
        const scale = quality === 'basic' ? 1 : 1 + (particle.z * 0.005);
        const alpha = (1 - (particle.life / particle.maxLife)) * 0.6;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        
        if (quality !== 'basic') {
          ctx.shadowBlur = 5;
          ctx.shadowColor = particle.color;
        }
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Simplified connections for better performance
        if (quality === 'premium') {
          particlesRef.current.slice(index + 1, index + 3).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              const connectionAlpha = (1 - distance / 80) * alpha * 0.3;
              
              ctx.save();
              ctx.globalAlpha = connectionAlpha;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          });
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate(0);

    window.addEventListener('resize', resizeCanvas);
    if (quality !== 'basic') {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, speed, colors, quality]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: quality === 'basic' ? 'normal' : 'screen' }}
    />
  );
};

export default OptimizedParticleSystem;
