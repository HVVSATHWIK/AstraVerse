
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
        {/* Hexagonal base */}
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          stroke="url(#hexGradient)"
          strokeWidth="2"
          fill="url(#hexFill)"
          className="animate-pulse"
        />
        
        {/* Central diamond */}
        <path
          d="M50 20 L70 40 L50 60 L30 40 Z"
          fill="url(#diamondGradient)"
          className="drop-shadow-lg"
        />
        
        {/* Top triangle */}
        <path
          d="M50 15 L60 35 L40 35 Z"
          fill="url(#triangleGradient)"
        />
        
        {/* Side triangles */}
        <path
          d="M25 50 L40 40 L40 60 Z"
          fill="url(#sideGradient1)"
        />
        <path
          d="M75 50 L60 40 L60 60 Z"
          fill="url(#sideGradient2)"
        />
        
        {/* Energy orbs */}
        <circle cx="35" cy="30" r="4" fill="#00D9FF" className="animate-pulse" />
        <circle cx="65" cy="30" r="4" fill="#FF6B6B" className="animate-pulse" />
        <circle cx="35" cy="70" r="4" fill="#4ECDC4" className="animate-pulse" />
        <circle cx="65" cy="70" r="4" fill="#FFE66D" className="animate-pulse" />
        
        {/* Connection lines */}
        <line x1="35" y1="30" x2="50" y2="40" stroke="#00D9FF" strokeWidth="1.5" opacity="0.7" />
        <line x1="65" y1="30" x2="50" y2="40" stroke="#FF6B6B" strokeWidth="1.5" opacity="0.7" />
        <line x1="35" y1="70" x2="50" y2="60" stroke="#4ECDC4" strokeWidth="1.5" opacity="0.7" />
        <line x1="65" y1="70" x2="50" y2="60" stroke="#FFE66D" strokeWidth="1.5" opacity="0.7" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667EEA" />
            <stop offset="50%" stopColor="#764BA2" />
            <stop offset="100%" stopColor="#F093FB" />
          </linearGradient>
          <linearGradient id="hexFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667EEA" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#764BA2" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#4ECDC4" />
          </linearGradient>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE66D" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
          <linearGradient id="sideGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#667EEA" />
          </linearGradient>
          <linearGradient id="sideGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#44A08D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AstraLogo;
