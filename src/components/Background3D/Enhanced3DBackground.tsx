
import React, { memo } from 'react';
import ParticleSystem from './ParticleSystem';
import GeometricShapes from './GeometricShapes';
import GradientMesh from './GradientMesh';
import DepthGrid from './DepthGrid';
import InteractiveLayer from './InteractiveLayer';

interface Enhanced3DBackgroundProps {
  enableParticles?: boolean;
  enableShapes?: boolean;
  enableGrid?: boolean;
  enableInteractive?: boolean;
  particleCount?: number;
  performance?: 'low' | 'medium' | 'high';
}

const Enhanced3DBackground = memo(({
  enableParticles = true,
  enableShapes = true,
  enableGrid = true,
  enableInteractive = true,
  particleCount = 30,
  performance = 'medium'
}: Enhanced3DBackgroundProps) => {
  // Adjust settings based on performance level
  const getPerformanceSettings = () => {
    switch (performance) {
      case 'low':
        return {
          particles: Math.min(particleCount, 20),
          enableAdvancedEffects: false
        };
      case 'high':
        return {
          particles: particleCount,
          enableAdvancedEffects: true
        };
      default:
        return {
          particles: Math.min(particleCount, 40),
          enableAdvancedEffects: true
        };
    }
  };

  const settings = getPerformanceSettings();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient mesh - always enabled */}
      <GradientMesh />
      
      {/* Geometric shapes layer */}
      {enableShapes && <GeometricShapes />}
      
      {/* Depth grid layer */}
      {enableGrid && settings.enableAdvancedEffects && <DepthGrid />}
      
      {/* Particle system layer */}
      {enableParticles && (
        <ParticleSystem 
          particleCount={settings.particles}
          speed={performance === 'low' ? 0.3 : 0.5}
        />
      )}
      
      {/* Interactive layer */}
      {enableInteractive && settings.enableAdvancedEffects && <InteractiveLayer />}
    </div>
  );
});

Enhanced3DBackground.displayName = 'Enhanced3DBackground';

export default Enhanced3DBackground;
