
import React from 'react';

const MatrixRain = () => {
  return (
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
  );
};

export default MatrixRain;
