
import React from 'react';

const GeometricShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating cubes */}
      <div className="absolute top-1/4 left-1/6 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl animate-float-3d transform-3d rotate-45 shadow-2xl backdrop-blur-sm border border-purple-500/20"></div>
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-3xl animate-background-float transform-3d rotate-12 shadow-2xl backdrop-blur-sm border border-cyan-500/20"></div>
      <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl animate-pulse-3d transform-3d -rotate-12 shadow-2xl backdrop-blur-sm border border-orange-500/20"></div>
      
      {/* Hexagonal shapes */}
      <div className="absolute top-1/2 left-1/5 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-purple-500/10 animate-wiggle-3d transform-3d shadow-2xl backdrop-blur-sm border border-pink-500/20"
           style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}>
      </div>
      <div className="absolute bottom-1/4 right-1/6 w-18 h-18 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 animate-float-3d transform-3d rotate-45 shadow-2xl backdrop-blur-sm border border-blue-500/20"
           style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}>
      </div>

      {/* Diamond shapes */}
      <div className="absolute top-1/6 right-1/3 w-14 h-14 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 animate-background-float transform-3d rotate-45 shadow-2xl backdrop-blur-sm border border-yellow-500/20"
           style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
      </div>
      
      {/* Triangular shapes */}
      <div className="absolute bottom-1/6 left-1/4 w-16 h-16 bg-gradient-to-br from-green-500/10 to-teal-500/10 animate-pulse-3d transform-3d shadow-2xl backdrop-blur-sm border border-green-500/20"
           style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
      </div>
      
      {/* Circular elements */}
      <div className="absolute top-3/4 right-1/5 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full animate-float-3d transform-3d shadow-2xl backdrop-blur-sm border border-indigo-500/20"></div>
      
      {/* Large background shapes */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-full animate-background-float blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-600/5 to-green-600/5 rounded-full animate-float-3d blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px',
               animation: 'backgroundFloat 30s linear infinite'
             }}>
        </div>
      </div>
    </div>
  );
};

export default GeometricShapes;
