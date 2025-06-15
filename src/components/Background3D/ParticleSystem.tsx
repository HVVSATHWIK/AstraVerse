
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

interface ParticleSystemProps {
  particleCount?: number;
  speed?: number;
  colors?: string[];
}

const ParticleSystem = ({ 
  particleCount = 60, 
  speed = 0.8, 
  colors = ['rgba(124, 58, 237, 0.4)', 'rgba(59, 130, 246, 0.4)', 'rgba(16, 185, 129, 0.4)', 'rgba(236, 72, 153, 0.3)']
}: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  const createParticle = (): Particle => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    z: Math.random() * 200 - 100,
    vx: (Math.random() - 0.5) * speed,
    vy: (Math.random() - 0.5) * speed,
    vz: (Math.random() - 0.5) * speed * 0.5,
    life: 0,
    maxLife: 300 + Math.random() * 500,
    size: 1 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    mass: 0.1 + Math.random() * 0.5,
    gravity: -0.002 + Math.random() * 0.004
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, createParticle);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle, index) => {
        // Mouse attraction force
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.005;
          particle.vy += (dy / distance) * force * 0.005;
        }

        // Physics-based movement
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.life++;

        // Apply drag
        particle.vx *= 0.998;
        particle.vy *= 0.998;
        particle.vz *= 0.998;

        // Boundary wrapping with smooth transition
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Reset particle if life exceeded
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle();
          return;
        }

        // Enhanced 3D depth effect
        const scale = 1 + (particle.z * 0.008);
        const alpha = (1 - (particle.life / particle.maxLife)) * (0.3 + Math.sin(particle.life * 0.02) * 0.2);
        
        // Draw particle with enhanced effects
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Enhanced connection system
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const dz = particle.z - otherParticle.z;
          const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance3D < 120) {
            const connectionAlpha = (1 - distance3D / 120) * alpha * 0.4;
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, 
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, otherParticle.color);
            
            ctx.save();
            ctx.globalAlpha = connectionAlpha;
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 5;
            ctx.shadowColor = particle.color;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, speed, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ParticleSystem;
