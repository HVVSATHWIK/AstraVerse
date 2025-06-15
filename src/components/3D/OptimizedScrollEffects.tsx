
import React, { useEffect, useRef, useState } from 'react';
import { throttle } from '@/utils/performanceDetector';

interface OptimizedScrollEffectsProps {
  enableParallax?: boolean;
  animationQuality?: 'basic' | 'enhanced' | 'premium';
}

const OptimizedScrollEffects = ({ 
  enableParallax = true, 
  animationQuality = 'enhanced' 
}: OptimizedScrollEffectsProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const effectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use different throttle rates based on performance
    const throttleRate = animationQuality === 'basic' ? 100 : 
                        animationQuality === 'enhanced' ? 50 : 16;

    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
    }, throttleRate);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (effectsRef.current) {
      observer.observe(effectsRef.current);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [animationQuality]);

  if (!isVisible) return null;

  // Reduce parallax intensity for lower performance
  const parallaxMultiplier = animationQuality === 'basic' ? 0.1 : 
                           animationQuality === 'enhanced' ? 0.2 : 0.3;

  const parallaxOffset1 = enableParallax ? scrollY * parallaxMultiplier : 0;
  const parallaxOffset2 = enableParallax ? scrollY * (parallaxMultiplier * 1.5) : 0;
  const parallaxOffset3 = enableParallax ? scrollY * (parallaxMultiplier * 0.8) : 0;

  // Reduce number of elements for basic performance
  const elementCount = animationQuality === 'basic' ? 2 : 
                      animationQuality === 'enhanced' ? 4 : 8;

  return (
    <div ref={effectsRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Basic parallax layer */}
      <div
        className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
        style={{ transform: `translateY(${parallaxOffset1}px)` }}
      >
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full animate-float-3d blur-3xl"></div>
        {animationQuality !== 'basic' && (
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-cyan-500/5 to-green-500/5 rounded-2xl animate-background-float blur-2xl"></div>
        )}
      </div>

      {/* Enhanced parallax layer - only for medium+ performance */}
      {animationQuality !== 'basic' && (
        <div
          className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
          style={{ transform: `translateY(${parallaxOffset2}px) rotateZ(${scrollY * 0.05}deg)` }}
        >
          <div 
            className="absolute top-1/3 right-1/5 w-20 h-20 bg-gradient-to-br from-pink-500/8 to-purple-500/8 animate-wiggle-3d blur-xl"
            style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-500/8 to-red-500/8 animate-pulse-3d blur-lg"
            style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)' }}
          ></div>
        </div>
      )}

      {/* Premium effects - only for high performance */}
      {animationQuality === 'premium' && (
        <>
          <div
            className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
            style={{ transform: `translateY(${parallaxOffset3}px) scale(${1 + scrollY * 0.0001})` }}
          >
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl animate-float-3d blur-md"></div>
            <div className="absolute bottom-1/6 right-1/3 w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full animate-background-float blur-sm"></div>
          </div>

          {/* Scroll-activated sparkles */}
          {scrollY > 100 && (
            <div className="absolute inset-0">
              {Array.from({ length: elementCount }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
                  style={{
                    top: `${20 + (i * 10)}%`,
                    left: `${10 + (i * 12)}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedScrollEffects;
