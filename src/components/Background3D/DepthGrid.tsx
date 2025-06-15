
import React from 'react';

const DepthGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {/* 3D perspective grid */}
      <div className="absolute inset-0 transform-3d perspective-container">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-background-float"
              style={{
                top: `${i * 5}%`,
                transform: `translateZ(${i * 10}px) rotateX(45deg)`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        
        {/* Vertical grid lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-gradient-to-b from-transparent via-white/30 to-transparent animate-float-3d"
              style={{
                left: `${i * 5}%`,
                transform: `translateZ(${i * 10}px) rotateY(45deg)`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
        
        {/* Depth indicators */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`depth-${i}`}
              className="absolute w-2 h-2 bg-white/40 rounded-full animate-pulse-3d"
              style={{
                top: `${20 + i * 10}%`,
                left: `${15 + i * 8}%`,
                transform: `translateZ(${i * 30}px)`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        {/* Perspective lines */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={`perspective-${i}`}
              className="absolute bg-gradient-to-br from-white/20 to-transparent animate-wiggle-3d"
              style={{
                top: '50%',
                left: '50%',
                width: '2px',
                height: `${300 + i * 100}px`,
                transformOrigin: 'top center',
                transform: `translate(-50%, -50%) rotateZ(${i * 60}deg) translateZ(${i * 20}px)`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepthGrid;
