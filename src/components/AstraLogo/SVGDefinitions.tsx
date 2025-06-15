
import React from 'react';

const SVGDefinitions = () => {
  return (
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
  );
};

export default SVGDefinitions;
