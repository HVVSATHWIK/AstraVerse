
import React from 'react';

const CentralLogo = () => {
  return (
    <g className="animate-pulse" style={{ animationDuration: '1.8s' }}>
      {/* Main A */}
      <path
        d="M60 40 L48 70 L53 70 L55.5 64 L64.5 64 L67 70 L72 70 L60 40 Z M58.5 50 L62 58 L59 58 L58.5 50 Z"
        fill="url(#glitchGradient)"
        filter="url(#holographicGlow)"
      />
      
      {/* Glitch copies */}
      <path
        d="M60 40 L48 70 L53 70 L55.5 64 L64.5 64 L67 70 L72 70 L60 40 Z M58.5 50 L62 58 L59 58 L58.5 50 Z"
        fill="#ff0080"
        opacity="0.3"
        transform="translate(1, 0)"
      />
      <path
        d="M60 40 L48 70 L53 70 L55.5 64 L64.5 64 L67 70 L72 70 L60 40 Z M58.5 50 L62 58 L59 58 L58.5 50 Z"
        fill="#00ffff"
        opacity="0.3"
        transform="translate(-1, 0)"
      />
    </g>
  );
};

export default CentralLogo;
