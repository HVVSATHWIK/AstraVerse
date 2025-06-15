
import React from 'react';

const HolographicEffects = () => {
  return (
    <g className="animate-pulse" style={{ animationDuration: '1.5s' }}>
      <line x1="10" y1="20" x2="110" y2="20" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.6" />
      <line x1="10" y1="40" x2="110" y2="40" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.4" />
      <line x1="10" y1="60" x2="110" y2="60" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.8" />
      <line x1="10" y1="80" x2="110" y2="80" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="100" x2="110" y2="100" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.5" />
    </g>
  );
};

export default HolographicEffects;
