
import React, { useEffect, useState, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

const InteractiveLayer = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsMouseMoving(true);
    
    // Reset mouse moving state after a delay
    setTimeout(() => setIsMouseMoving(false), 150);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.02,
    y: (mousePosition.y - window.innerHeight / 2) * 0.02
  };

  const strongParallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.05,
    y: (mousePosition.y - window.innerHeight / 2) * 0.05
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mouse-following gradient */}
      <div
        className="absolute w-96 h-96 bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          opacity: isMouseMoving ? 0.8 : 0.3,
          transform: `scale(${isMouseMoving ? 1.2 : 1})`
        }}
      />
      
      {/* Parallax background elements */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-float-3d blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-2xl animate-background-float blur-lg"></div>
      </div>
      
      {/* Stronger parallax layer */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${strongParallaxOffset.x}px, ${strongParallaxOffset.y}px)`
        }}
      >
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-br from-yellow-500/15 to-orange-500/15 rounded-xl animate-wiggle-3d blur-md"></div>
        <div className="absolute bottom-1/4 left-1/5 w-20 h-20 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-full animate-pulse-3d blur-lg"></div>
      </div>
      
      {/* Interactive ripple effect */}
      {isMouseMoving && (
        <div
          className="absolute w-64 h-64 border border-white/20 rounded-full animate-ping"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1'
          }}
        />
      )}
    </div>
  );
};

export default InteractiveLayer;
