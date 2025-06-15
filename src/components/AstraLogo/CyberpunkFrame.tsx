
import React from 'react';

const CyberpunkFrame = () => {
  return (
    <>
      {/* Outer holographic frame */}
      <rect 
        x="15" 
        y="15" 
        width="90" 
        height="90" 
        fill="none" 
        stroke="url(#holoFrameGradient)" 
        strokeWidth="2" 
        strokeDasharray="10 5"
        className="animate-spin"
        style={{ animationDuration: '12s', transformOrigin: '60px 60px' }}
      />

      {/* Inner cyberpunk hexagon */}
      <path
        d="M60 25 L80 35 L80 65 L60 75 L40 65 L40 35 Z"
        stroke="url(#cyberGradient)"
        strokeWidth="3"
        fill="url(#cyberFillGradient)"
        className="animate-pulse"
        style={{ animationDuration: '2.5s' }}
      />

      {/* Cyberpunk corner brackets */}
      <g stroke="url(#bracketGradient)" strokeWidth="2" fill="none">
        <path d="M25 25 L25 15 L35 15" className="animate-pulse" style={{ animationDuration: '3s' }} />
        <path d="M95 25 L95 15 L85 15" className="animate-pulse" style={{ animationDuration: '3.2s' }} />
        <path d="M25 95 L25 105 L35 105" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
        <path d="M95 95 L95 105 L85 105" className="animate-pulse" style={{ animationDuration: '3.1s' }} />
      </g>
    </>
  );
};

export default CyberpunkFrame;
