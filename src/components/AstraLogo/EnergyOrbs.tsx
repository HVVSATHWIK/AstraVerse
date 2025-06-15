
import React from 'react';

const EnergyOrbs = () => {
  return (
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
  );
};

export default EnergyOrbs;
