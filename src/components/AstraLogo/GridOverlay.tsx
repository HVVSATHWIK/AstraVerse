
import React from 'react';

const GridOverlay = () => {
  return (
    <>
      {/* Holographic grid */}
      <g opacity="0.2" stroke="#00ffff" strokeWidth="0.5">
        <line x1="30" y1="30" x2="90" y2="30" />
        <line x1="30" y1="45" x2="90" y2="45" />
        <line x1="30" y1="60" x2="90" y2="60" />
        <line x1="30" y1="75" x2="90" y2="75" />
        <line x1="30" y1="90" x2="90" y2="90" />
        
        <line x1="30" y1="30" x2="30" y2="90" />
        <line x1="45" y1="30" x2="45" y2="90" />
        <line x1="60" y1="30" x2="60" y2="90" />
        <line x1="75" y1="30" x2="75" y2="90" />
        <line x1="90" y1="30" x2="90" y2="90" />
      </g>

      {/* Scanning beam effect */}
      <g className="animate-pulse" style={{ animationDuration: '1s' }}>
        <rect x="10" y="58" width="100" height="4" fill="url(#scanBeam)" opacity="0.6" />
      </g>
    </>
  );
};

export default GridOverlay;
