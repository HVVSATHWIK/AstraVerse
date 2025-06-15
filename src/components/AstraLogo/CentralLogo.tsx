
import React from 'react';

const CentralLogo = () => {
  return (
    <g className="transform-gpu">
      {/* Main Brand "A" */}
      <path
        d="M60 35 L50 65 L54 65 L56 58 L64 58 L66 65 L70 65 L60 35 Z M58 48 L62 52 L58 52 Z"
        fill="url(#brandGradient)"
        className="animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      
      {/* Geometric accent lines */}
      <line x1="45" y1="50" x2="75" y2="50" stroke="url(#accentGradient)" strokeWidth="2" opacity="0.8" />
      <line x1="52" y1="42" x2="68" y2="42" stroke="url(#accentGradient)" strokeWidth="1.5" opacity="0.6" />
      
      {/* Neural connection nodes */}
      <circle cx="45" cy="50" r="2" fill="url(#nodeGradient)" className="animate-pulse" style={{ animationDuration: '2s' }} />
      <circle cx="75" cy="50" r="2" fill="url(#nodeGradient)" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
      <circle cx="52" cy="42" r="1.5" fill="url(#nodeGradient)" className="animate-pulse" style={{ animationDuration: '1.8s' }} />
      <circle cx="68" cy="42" r="1.5" fill="url(#nodeGradient)" className="animate-pulse" style={{ animationDuration: '2.2s' }} />
    </g>
  );
};

export default CentralLogo;
