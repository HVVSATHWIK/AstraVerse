
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
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer rotating ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          stroke="url(#outerRingGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 5"
          className="animate-spin"
          style={{ animationDuration: '8s' }}
        />
        
        {/* Neural network background grid */}
        <g opacity="0.3">
          {/* Neural connection lines */}
          <line x1="20" y1="20" x2="40" y2="35" stroke="#00D9FF" strokeWidth="0.5" opacity="0.6" />
          <line x1="40" y1="35" x2="60" y2="25" stroke="#FF6B6B" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="25" x2="80" y2="35" stroke="#4ECDC4" strokeWidth="0.5" opacity="0.6" />
          <line x1="80" y1="35" x2="100" y2="20" stroke="#FFE66D" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="20" y1="60" x2="35" y2="60" stroke="#00D9FF" strokeWidth="0.5" opacity="0.6" />
          <line x1="35" y1="60" x2="60" y2="45" stroke="#FF6B6B" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="45" x2="85" y2="60" stroke="#4ECDC4" strokeWidth="0.5" opacity="0.6" />
          <line x1="85" y1="60" x2="100" y2="60" stroke="#FFE66D" strokeWidth="0.5" opacity="0.6" />
          
          <line x1="20" y1="100" x2="40" y2="85" stroke="#00D9FF" strokeWidth="0.5" opacity="0.6" />
          <line x1="40" y1="85" x2="60" y2="95" stroke="#FF6B6B" strokeWidth="0.5" opacity="0.6" />
          <line x1="60" y1="95" x2="80" y2="85" stroke="#4ECDC4" strokeWidth="0.5" opacity="0.6" />
          <line x1="80" y1="85" x2="100" y2="100" stroke="#FFE66D" strokeWidth="0.5" opacity="0.6" />
          
          {/* Neural nodes */}
          <circle cx="20" cy="20" r="2" fill="#00D9FF" opacity="0.8" />
          <circle cx="40" cy="35" r="1.5" fill="#FF6B6B" opacity="0.8" />
          <circle cx="60" cy="25" r="2" fill="#4ECDC4" opacity="0.8" />
          <circle cx="80" cy="35" r="1.5" fill="#FFE66D" opacity="0.8" />
          <circle cx="100" cy="20" r="2" fill="#00D9FF" opacity="0.8" />
          
          <circle cx="20" cy="60" r="1.5" fill="#FF6B6B" opacity="0.8" />
          <circle cx="35" cy="60" r="2" fill="#4ECDC4" opacity="0.8" />
          <circle cx="85" cy="60" r="2" fill="#FFE66D" opacity="0.8" />
          <circle cx="100" cy="60" r="1.5" fill="#00D9FF" opacity="0.8" />
          
          <circle cx="20" cy="100" r="2" fill="#4ECDC4" opacity="0.8" />
          <circle cx="40" cy="85" r="1.5" fill="#FFE66D" opacity="0.8" />
          <circle cx="60" cy="95" r="2" fill="#00D9FF" opacity="0.8" />
          <circle cx="80" cy="85" r="1.5" fill="#FF6B6B" opacity="0.8" />
          <circle cx="100" cy="100" r="2" fill="#4ECDC4" opacity="0.8" />
        </g>
        
        {/* Main hexagonal structure */}
        <g className="animate-pulse" style={{ animationDuration: '3s' }}>
          <path
            d="M60 10 L95 30 L95 70 L60 90 L25 70 L25 30 Z"
            stroke="url(#mainHexGradient)"
            strokeWidth="3"
            fill="url(#hexFillGradient)"
            className="drop-shadow-2xl"
          />
        </g>
        
        {/* Central AI core with rotating elements */}
        <g className="animate-spin" style={{ animationDuration: '4s', transformOrigin: '60px 60px' }}>
          {/* Inner rotating core */}
          <circle
            cx="60"
            cy="60"
            r="25"
            stroke="url(#coreGradient)"
            strokeWidth="2"
            fill="url(#coreFillGradient)"
            strokeDasharray="5 3"
          />
          
          {/* Core energy rings */}
          <circle cx="60" cy="60" r="20" stroke="#00D9FF" strokeWidth="1" opacity="0.4" strokeDasharray="3 2" />
          <circle cx="60" cy="60" r="15" stroke="#FF6B6B" strokeWidth="1" opacity="0.6" strokeDasharray="2 1" />
          <circle cx="60" cy="60" r="10" stroke="#4ECDC4" strokeWidth="1" opacity="0.8" strokeDasharray="1 1" />
        </g>
        
        {/* Central "A" symbol for Astra */}
        <g className="animate-pulse" style={{ animationDuration: '2s' }}>
          <path
            d="M60 45 L52 65 L56 65 L57.5 61 L62.5 61 L64 65 L68 65 L60 45 Z M59 52 L61.5 58 L58.5 58 L59 52 Z"
            fill="url(#letterGradient)"
            className="drop-shadow-lg"
          />
        </g>
        
        {/* Orbiting data nodes */}
        <g className="animate-spin" style={{ animationDuration: '6s', transformOrigin: '60px 60px', animationDirection: 'reverse' }}>
          <circle cx="85" cy="35" r="4" fill="#00D9FF" className="animate-pulse drop-shadow-lg">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="85" r="4" fill="#FF6B6B" className="animate-pulse drop-shadow-lg">
            <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="85" r="4" fill="#4ECDC4" className="animate-pulse drop-shadow-lg">
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="35" r="4" fill="#FFE66D" className="animate-pulse drop-shadow-lg">
            <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Energy connecting lines */}
        <g opacity="0.7">
          <line x1="85" y1="35" x2="60" y2="35" stroke="url(#energyGradient1)" strokeWidth="2" opacity="0.8" className="animate-pulse" />
          <line x1="85" y1="85" x2="60" y2="85" stroke="url(#energyGradient2)" strokeWidth="2" opacity="0.8" className="animate-pulse" />
          <line x1="35" y1="85" x2="60" y2="85" stroke="url(#energyGradient3)" strokeWidth="2" opacity="0.8" className="animate-pulse" />
          <line x1="35" y1="35" x2="60" y2="35" stroke="url(#energyGradient4)" strokeWidth="2" opacity="0.8" className="animate-pulse" />
        </g>
        
        {/* Corner accent triangles */}
        <g opacity="0.6">
          <path d="M15 15 L25 15 L20 25 Z" fill="url(#accentGradient1)" />
          <path d="M95 15 L105 15 L100 25 Z" fill="url(#accentGradient2)" />
          <path d="M15 105 L25 105 L20 95 Z" fill="url(#accentGradient3)" />
          <path d="M95 105 L105 105 L100 95 Z" fill="url(#accentGradient4)" />
        </g>
        
        {/* Gradients and Effects */}
        <defs>
          {/* Enhanced gradients */}
          <linearGradient id="outerRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="25%" stopColor="#667EEA" />
            <stop offset="50%" stopColor="#764BA2" />
            <stop offset="75%" stopColor="#F093FB" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
          
          <linearGradient id="mainHexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667EEA" />
            <stop offset="33%" stopColor="#764BA2" />
            <stop offset="66%" stopColor="#F093FB" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
          
          <radialGradient id="hexFillGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#667EEA" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#764BA2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F093FB" stopOpacity="0.05" />
          </radialGradient>
          
          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="50%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
          
          <radialGradient id="coreFillGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#4ECDC4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.1" />
          </radialGradient>
          
          <linearGradient id="letterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          
          {/* Energy line gradients */}
          <linearGradient id="energyGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="energyGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="energyGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.2" />
          </linearGradient>
          
          <linearGradient id="energyGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFE66D" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFE66D" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Corner accent gradients */}
          <linearGradient id="accentGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#667EEA" />
          </linearGradient>
          
          <linearGradient id="accentGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#F093FB" />
          </linearGradient>
          
          <linearGradient id="accentGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
          
          <linearGradient id="accentGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE66D" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
          
          {/* Glow effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="dropShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AstraLogo;
