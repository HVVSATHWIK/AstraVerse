
import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Enhanced3DBackground from '@/components/Background3D/Enhanced3DBackground';
import OptimizedScrollEffects from '@/components/3D/OptimizedScrollEffects';
import { detectPerformance, PerformanceLevel } from '@/utils/performanceDetector';

const Index = () => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel | null>(null);

  useEffect(() => {
    // Detect performance on mount
    const performance = detectPerformance();
    setPerformanceLevel(performance);
    
    console.log('Detected performance level:', performance.level);
  }, []);

  // Show a loading state while detecting performance
  if (!performanceLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced 3D Background with performance-based settings */}
      <Enhanced3DBackground 
        enableParticles={true}
        enableShapes={performanceLevel.enableAdvancedEffects}
        enableGrid={performanceLevel.enableAdvancedEffects && performanceLevel.level === 'high'}
        enableInteractive={performanceLevel.enableInteractive}
        particleCount={performanceLevel.maxParticles}
        performance={performanceLevel.level}
      />

      {/* Optimized scroll-triggered effects */}
      <OptimizedScrollEffects 
        enableParallax={performanceLevel.enableParallax}
        animationQuality={performanceLevel.animationQuality}
      />

      {/* Hero Section */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* Features Grid */}
      <div className="relative z-10">
        <FeaturesSection />
      </div>

      {/* Pricing Section */}
      <div className="relative z-10">
        <PricingSection />
      </div>

      {/* CTA Section */}
      <div className="relative z-10">
        <CTASection />
      </div>
    </div>
  );
};

export default Index;
