import React from 'react';

interface InvenAILogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const InvenAILogo = ({ className = '', size = 'md' }: InvenAILogoProps) => {
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
        <defs>
          {/* Background gradient */}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f2027"/>
            <stop offset="50%" stopColor="#203a43"/>
            <stop offset="100%" stopColor="#2c5364"/>
          </linearGradient>
          
          {/* Element gradient for AI/circuit elements */}
          <linearGradient id="elementGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe"/>
            <stop offset="100%" stopColor="#4facfe"/>
          </linearGradient>
          
          {/* EV battery gradient */}
          <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981"/>
            <stop offset="100%" stopColor="#34D399"/>
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle cx="60" cy="60" r="55" fill="url(#bgGradient)" stroke="url(#elementGradient)" strokeWidth="2"/>

        {/* AI Brain/Head */}
        <circle cx="60" cy="40" r="18" fill="url(#elementGradient)" opacity="0.9"/>
        
        {/* Circuit connections from brain */}
        <path d="M45 45 Q60 42 75 45" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <path d="M50 50 Q60 48 70 50" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.5"/>
        
        {/* Inventory/Storage containers */}
        <rect x="35" y="65" width="15" height="12" fill="url(#batteryGradient)" rx="2"/>
        <rect x="55" y="65" width="15" height="12" fill="url(#batteryGradient)" rx="2"/>
        <rect x="75" y="65" width="15" height="12" fill="url(#batteryGradient)" rx="2"/>
        
        {/* Connection lines from AI to inventory */}
        <line x1="52" y1="55" x2="42" y2="65" stroke="url(#elementGradient)" strokeWidth="1.5" opacity="0.8"/>
        <line x1="60" y1="58" x2="62" y2="65" stroke="url(#elementGradient)" strokeWidth="1.5" opacity="0.8"/>
        <line x1="68" y1="55" x2="82" y2="65" stroke="url(#elementGradient)" strokeWidth="1.5" opacity="0.8"/>
        
        {/* Lightning bolt for power/efficiency */}
        <path d="M60 75 L55 85 H60 L57 95 H65 L62 85 H67 Z" fill="#00f2fe" opacity="0.9"/>
        
        {/* Data flow indicators */}
        <circle cx="40" cy="55" r="2" fill="#4facfe">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="52" r="2" fill="#4facfe">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="0.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="80" cy="55" r="2" fill="#4facfe">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" begin="1s" repeatCount="indefinite"/>
        </circle>
        
        {/* Border highlight */}
        <circle cx="60" cy="60" r="55" fill="none" stroke="url(#elementGradient)" strokeWidth="1" opacity="0.3"/>
      </svg>
    </div>
  );
};

export default InvenAILogo;