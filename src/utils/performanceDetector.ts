
export interface PerformanceLevel {
  level: 'low' | 'medium' | 'high';
  maxParticles: number;
  enableAdvancedEffects: boolean;
  enableParallax: boolean;
  enableInteractive: boolean;
  animationQuality: 'basic' | 'enhanced' | 'premium';
}

export const detectPerformance = (): PerformanceLevel => {
  // Check for various performance indicators
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  // Basic performance indicators
  const memory = (navigator as any).deviceMemory || 4; // Default to 4GB if unknown
  const cores = navigator.hardwareConcurrency || 2; // Default to 2 cores if unknown
  const connection = (navigator as any).connection;
  
  // Check if WebGL is available and get renderer info
  let isLowEndGPU = false;
  if (gl && gl instanceof WebGLRenderingContext) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Check for integrated/low-end GPUs
      isLowEndGPU = /intel|integrated|software/i.test(renderer);
    }
  }

  // Check for slower connections
  const isSlowConnection = connection && (
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' || 
    connection.effectiveType === '3g'
  );

  // Performance scoring
  let score = 0;
  
  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;
  
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;
  
  if (gl && !isLowEndGPU) score += 2;
  else if (gl) score += 1;
  
  if (isSlowConnection) score -= 1;

  // Determine performance level
  if (score >= 5) {
    return {
      level: 'high',
      maxParticles: 60,
      enableAdvancedEffects: true,
      enableParallax: true,
      enableInteractive: true,
      animationQuality: 'premium'
    };
  } else if (score >= 3) {
    return {
      level: 'medium',
      maxParticles: 30,
      enableAdvancedEffects: true,
      enableParallax: true,
      enableInteractive: true,
      animationQuality: 'enhanced'
    };
  } else {
    return {
      level: 'low',
      maxParticles: 15,
      enableAdvancedEffects: false,
      enableParallax: false,
      enableInteractive: false,
      animationQuality: 'basic'
    };
  }
};

// Throttle function for scroll events
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce function for resize events
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};
