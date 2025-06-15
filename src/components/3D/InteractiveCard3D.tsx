
import React, { useRef, useEffect, useState } from 'react';

interface InteractiveCard3DProps {
  children: React.ReactNode;
  intensity?: number;
  delay?: number;
  className?: string;
}

const InteractiveCard3D = ({ 
  children, 
  intensity = 15, 
  delay = 0,
  className = '' 
}: InteractiveCard3DProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState('');

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / rect.height) * intensity;
      const rotateY = (mouseX / rect.width) * intensity;
      
      setTransform(
        `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale3d(1.05, 1.05, 1.05)`
      );
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)');
    };

    document.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered, intensity]);

  return (
    <div
      ref={cardRef}
      className={`transform-gpu transition-all duration-300 ease-out ${className}`}
      style={{ 
        transform,
        transformStyle: 'preserve-3d',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="relative">
        {children}
        {/* Enhanced glow effect */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 -z-10 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default InteractiveCard3D;
