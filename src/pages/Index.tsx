
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
import Enhanced3DBackground from '@/components/Background3D/Enhanced3DBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced 3D Background */}
      <Enhanced3DBackground 
        enableParticles={true}
        enableShapes={true}
        enableGrid={true}
        enableInteractive={true}
        particleCount={40}
        performance="high"
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
