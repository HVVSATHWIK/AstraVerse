
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
        {/* Holographic scanning lines */}
        <g className="animate-pulse" style={{ animationDuration: '1.5s' }}>
          <line x1="10" y1="20" x2="110" y2="20" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.6" />
          <line x1="10" y1="40" x2="110" y2="40" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.4" />
          <line x1="10" y1="60" x2="110" y2="60" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.8" />
          <line x1="10" y1="80" x2="110" y2="80" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.3" />
          <line x1="10" y1="100" x2="110" y2="100" stroke="url(#scanGradient)" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* Matrix-style digital rain effect */}
        <g opacity="0.3" className="animate-pulse" style={{ animationDuration: '2s' }}>
          <text x="15" y="25" fill="#00ff41" fontSize="6" fontFamily="monospace">01</text>
          <text x="30" y="35" fill="#00ff41" fontSize="6" fontFamily="monospace">10</text>
          <text x="45" y="25" fill="#00ff41" fontSize="6" fontFamily="monospace">11</text>
          <text x="75" y="30" fill="#00ff41" fontSize="6" fontFamily="monospace">01</text>
          <text x="90" y="25" fill="#00ff41" fontSize="6" fontFamily="monospace">10</text>
          
          <text x="20" y="70" fill="#00ff41" fontSize="6" fontFamily="monospace">11</text>
          <text x="35" y="80" fill="#00ff41" fontSize="6" fontFamily="monospace">01</text>
          <text x="50" y="75" fill="#00ff41" fontSize="6" fontFamily="monospace">10</text>
          <text x="80" y="75" fill="#00ff41" fontSize="6" fontFamily="monospace">11</text>
          <text x="95" y="80" fill="#00ff41" fontSize="6" fontFamily="monospace">01</text>
        </g>

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

        {/* Holographic "A" with glitch effect */}
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

        {/* Cyberpunk corner brackets */}
        <g stroke="url(#bracketGradient)" strokeWidth="2" fill="none">
          <path d="M25 25 L25 15 L35 15" className="animate-pulse" style={{ animationDuration: '3s' }} />
          <path d="M95 25 L95 15 L85 15" className="animate-pulse" style={{ animationDuration: '3.2s' }} />
          <path d="M25 95 L25 105 L35 105" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
          <path d="M95 95 L95 105 L85 105" className="animate-pulse" style={{ animationDuration: '3.1s' }} />
        </g>

        {/* Energy orbs */}
        <g className="animate-spin" style={{ animationDuration: '8s', transformOrigin: '60px 60px' }}>
          <circle cx="60" cy="30" r="3" fill="url(#energyOrb1)" className="animate-pulse">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="60" r="3" fill="url(#energyOrb2)" className="animate-pulse">
            <animate attributeName="r" values="2;4;2" dur="2.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="90" r="3" fill="url(#energyOrb3)" className="animate-pulse">
            <animate attributeName="r" values="2;4;2" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="60" r="3" fill="url(#energyOrb4)" className="animate-pulse">
            <animate attributeName="r" values="2;4;2" dur="2.1s" repeatCount="indefinite" />
          </circle>
        </g>

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

        {/* Gradients and Effects */}
        <defs>
          {/* Cyberpunk gradients */}
          <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0080" />
            <stop offset="33%" stopColor="#00ffff" />
            <stop offset="66%" stopColor="#ff0080" />
            <stop offset="100%" stopColor="#00ff41" />
          </linearGradient>
          
          <radialGradient id="cyberFillGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0080" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00ffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ff0080" stopOpacity="0.05" />
          </radialGradient>

          <linearGradient id="holoFrameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="25%" stopColor="#ff0080" />
            <stop offset="50%" stopColor="#00ff41" />
            <stop offset="75%" stopColor="#ff0080" />
            <stop offset="100%" stopColor="#00ffff" />
          </linearGradient>

          <linearGradient id="glitchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="33%" stopColor="#00ffff" />
            <stop offset="66%" stopColor="#ff0080" />
            <stop offset="100%" stopColor="#00ff41" />
          </linearGradient>

          <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#ff0080" />
          </linearGradient>

          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00ffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="scanBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff0080" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff0080" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
          </linearGradient>

          {/* Energy orb gradients */}
          <radialGradient id="energyOrb1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#0080ff" />
          </radialGradient>

          <radialGradient id="energyOrb2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0080" />
            <stop offset="100%" stopColor="#ff4080" />
          </radialGradient>

          <radialGradient id="energyOrb3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff41" />
            <stop offset="100%" stopColor="#40ff80" />
          </radialGradient>

          <radialGradient id="energyOrb4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffff00" />
            <stop offset="100%" stopColor="#ff8000" />
          </radialGradient>

          {/* Holographic glow effect */}
          <filter id="holographicGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Advanced shadow effect */}
          <filter id="cyberShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="2" dy="2" result="offset"/>
            <feFlood floodColor="#ff0080" floodOpacity="0.3"/>
            <feComposite in2="offset" operator="in"/>
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
