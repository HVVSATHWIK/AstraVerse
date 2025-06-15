
import React from 'react';

const BrandElements = () => {
  return (
    <g>
      {/* AI indicators */}
      <g opacity="0.6">
        <rect x="35" y="35" width="3" height="3" fill="url(#indicatorGradient)" rx="1" className="animate-pulse" style={{ animationDuration: '2s' }} />
        <rect x="82" y="35" width="3" height="3" fill="url(#indicatorGradient)" rx="1" className="animate-pulse" style={{ animationDuration: '2.3s' }} />
        <rect x="35" y="82" width="3" height="3" fill="url(#indicatorGradient)" rx="1" className="animate-pulse" style={{ animationDuration: '1.8s' }} />
        <rect x="82" y="82" width="3" height="3" fill="url(#indicatorGradient)" rx="1" className="animate-pulse" style={{ animationDuration: '2.1s' }} />
      </g>

      {/* Subtle data flow lines */}
      <g opacity="0.3" className="animate-pulse" style={{ animationDuration: '5s' }}>
        <path d="M30 60 Q45 50 60 60 Q75 70 90 60" stroke="url(#flowGradient)" strokeWidth="1" fill="none" />
        <path d="M60 30 Q70 45 60 60 Q50 75 60 90" stroke="url(#flowGradient)" strokeWidth="1" fill="none" />
      </g>

      {/* Brand signature dots */}
      <g className="animate-pulse" style={{ animationDuration: '3s' }}>
        <circle cx="60" cy="25" r="1" fill="url(#signatureGradient)" />
        <circle cx="95" cy="60" r="1" fill="url(#signatureGradient)" />
        <circle cx="60" cy="95" r="1" fill="url(#signatureGradient)" />
        <circle cx="25" cy="60" r="1" fill="url(#signatureGradient)" />
      </g>
    </g>
  );
};

export default BrandElements;
