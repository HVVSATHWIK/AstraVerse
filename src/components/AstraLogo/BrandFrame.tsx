
import React from 'react';

const BrandFrame = () => {
  return (
    <>
      {/* Outer professional frame */}
      <rect 
        x="20" 
        y="20" 
        width="80" 
        height="80" 
        fill="none" 
        stroke="url(#frameGradient)" 
        strokeWidth="1.5" 
        rx="8"
        className="animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* Corner accent marks */}
      <g stroke="url(#accentGradient)" strokeWidth="2" fill="none">
        <path d="M25 30 L25 25 L30 25" className="animate-pulse" style={{ animationDuration: '3s' }} />
        <path d="M95 30 L95 25 L90 25" className="animate-pulse" style={{ animationDuration: '3.2s' }} />
        <path d="M25 90 L25 95 L30 95" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
        <path d="M95 90 L95 95 L90 95" className="animate-pulse" style={{ animationDuration: '3.1s' }} />
      </g>

      {/* Brand circle */}
      <circle 
        cx="60" 
        cy="60" 
        r="30" 
        fill="none" 
        stroke="url(#brandCircleGradient)" 
        strokeWidth="1" 
        strokeDasharray="5 3"
        className="animate-spin"
        style={{ animationDuration: '20s', transformOrigin: '60px 60px' }}
        opacity="0.4"
      />
    </>
  );
};

export default BrandFrame;
