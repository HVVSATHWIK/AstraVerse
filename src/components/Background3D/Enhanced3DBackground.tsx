
import React, { memo } from 'react';
import OptimizedParticleSystem from './OptimizedParticleSystem';
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
          particles: Math.min(particleCount, 15),
          quality: 'basic' as const,
          enableAdvancedEffects: false
        };
      case 'high':
        return {
          particles: particleCount,
          quality: 'premium' as const,
          enableAdvancedEffects: true
        };
      default:
        return {
          particles: Math.min(particleCount, 30),
          quality: 'enhanced' as const,
          enableAdvancedEffects: true
        };
    }
  };

  const settings = getPerformanceSettings();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient mesh - always enabled but simplified for low performance */}
      <GradientMesh />
      
      {/* Geometric shapes layer - only for medium+ performance */}
      {enableShapes && performance !== 'low' && <GeometricShapes />}
      
      {/* Depth grid layer - only for high performance */}
      {enableGrid && settings.enableAdvancedEffects && performance === 'high' && <DepthGrid />}
      
      {/* Optimized particle system layer */}
      {enableParticles && (
        <OptimizedParticleSystem 
          particleCount={settings.particles}
          speed={performance === 'low' ? 0.2 : 0.5}
          quality={settings.quality}
        />
      )}
      
      {/* Interactive layer - only for medium+ performance */}
      {enableInteractive && performance !== 'low' && <InteractiveLayer />}
    </div>
  );
});

Enhanced3DBackground.displayName = 'Enhanced3DBackground';

export default Enhanced3DBackground;
