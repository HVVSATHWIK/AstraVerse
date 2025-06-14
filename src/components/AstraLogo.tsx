
import React from 'react';

interface AstraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AstraLogo = ({ className = '', size = 'md' }: AstraLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient1)"
          strokeWidth="3"
          fill="none"
          className="animate-pulse"
        />
        
        {/* Inner geometric pattern */}
        <path
          d="M30 35 L50 25 L70 35 L65 50 L50 60 L35 50 Z"
          fill="url(#gradient2)"
          className="drop-shadow-lg"
        />
        
        {/* Central star/AI symbol */}
        <polygon
          points="50,30 55,40 65,40 57,47 60,57 50,52 40,57 43,47 35,40 45,40"
          fill="url(#gradient3)"
        />
        
        {/* Neural network nodes */}
        <circle cx="25" cy="25" r="3" fill="#60A5FA" className="animate-pulse" />
        <circle cx="75" cy="25" r="3" fill="#A78BFA" className="animate-pulse" />
        <circle cx="25" cy="75" r="3" fill="#34D399" className="animate-pulse" />
        <circle cx="75" cy="75" r="3" fill="#F59E0B" className="animate-pulse" />
        
        {/* Connection lines */}
        <line x1="25" y1="25" x2="45" y2="40" stroke="#60A5FA" strokeWidth="1" opacity="0.6" />
        <line x1="75" y1="25" x2="55" y2="40" stroke="#A78BFA" strokeWidth="1" opacity="0.6" />
        <line x1="25" y1="75" x2="45" y2="60" stroke="#34D399" strokeWidth="1" opacity="0.6" />
        <line x1="75" y1="75" x2="55" y2="60" stroke="#F59E0B" strokeWidth="1" opacity="0.6" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AstraLogo;
