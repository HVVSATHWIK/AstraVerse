
import React from 'react';

const GradientMesh = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        {/* Primary mesh layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/15 to-cyan-900/20 animate-background-float"></div>
        
        {/* Secondary mesh layer */}
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900/15 via-purple-900/10 to-pink-900/15 animate-float-3d"></div>
        
        {/* Tertiary mesh layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-green-900/10 animate-pulse-3d"></div>
        
        {/* Radial gradients for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-600/20 to-transparent rounded-full animate-background-float blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-radial from-blue-600/20 to-transparent rounded-full animate-float-3d blur-3xl"></div>
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-gradient-radial from-cyan-600/15 to-transparent rounded-full animate-pulse-3d blur-2xl"></div>
        
        {/* Conic gradients for dynamic effects */}
        <div className="absolute top-1/2 right-1/4 w-72 h-72 opacity-30 animate-wiggle-3d blur-2xl"
             style={{
               background: 'conic-gradient(from 0deg, rgba(124, 58, 237, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3), rgba(124, 58, 237, 0.3))',
               borderRadius: '50%'
             }}>
        </div>
        
        {/* Moving light spots */}
        <div className="absolute w-full h-full">
          <div className="absolute w-32 h-32 bg-gradient-radial from-white/10 to-transparent rounded-full animate-background-float blur-xl"
               style={{ top: '20%', left: '30%' }}>
          </div>
          <div className="absolute w-24 h-24 bg-gradient-radial from-purple-400/20 to-transparent rounded-full animate-float-3d blur-lg"
               style={{ top: '60%', left: '70%' }}>
          </div>
          <div className="absolute w-40 h-40 bg-gradient-radial from-blue-400/15 to-transparent rounded-full animate-pulse-3d blur-xl"
               style={{ top: '80%', left: '10%' }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientMesh;
