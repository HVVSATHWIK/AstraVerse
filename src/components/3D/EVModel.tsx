import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, PresentationControls, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface EVModelProps {
  onPartSelect?: (part: string) => void;
  selectedPart?: string | null;
  debugMode?: boolean;
}

// Debug indicator component
const DebugBox = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Box ref={meshRef} position={[3, 3, 0]} args={[0.5, 0.5, 0.5]}>
      <meshStandardMaterial color="red" wireframe />
    </Box>
  );
};

// EV Car Body Component
const EVCarBody = ({ selectedPart, onPartSelect }: { selectedPart?: string | null, onPartSelect?: (part: string) => void }) => {
  const bodyRef = useRef<THREE.Mesh>(null);
  
  const handleClick = () => {
    console.log('🚗 Car body clicked');
    onPartSelect?.('body');
  };

  return (
    <group>
      {/* Main body */}
      <Box 
        ref={bodyRef}
        position={[0, 0.5, 0]} 
        args={[3, 1, 1.5]} 
        onClick={handleClick}
      >
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#4ade80' : '#3b82f6'} 
          metalness={0.7}
          roughness={0.3}
        />
      </Box>
      
      {/* Hood */}
      <Box position={[1.2, 0.8, 0]} args={[0.6, 0.3, 1.4]} onClick={handleClick}>
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#4ade80' : '#2563eb'} 
          metalness={0.6}
          roughness={0.4}
        />
      </Box>
      
      {/* Roof */}
      <Box position={[0, 1.2, 0]} args={[2, 0.1, 1.3]} onClick={handleClick}>
        <meshStandardMaterial 
          color={selectedPart === 'body' ? '#4ade80' : '#1d4ed8'} 
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
    </group>
  );
};

// EV Wheels Component
const EVWheels = ({ selectedPart, onPartSelect }: { selectedPart?: string | null, onPartSelect?: (part: string) => void }) => {
  const wheelRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  
  useFrame((state) => {
    wheelRefs.forEach(ref => {
      if (ref.current) {
        ref.current.rotation.x += 0.02;
      }
    });
  });

  const handleClick = () => {
    console.log('🛞 Wheel clicked');
    onPartSelect?.('wheels');
  };

  const wheelPositions: [number, number, number][] = [
    [-1.2, -0.3, 0.8],   // Front left
    [-1.2, -0.3, -0.8],  // Front right
    [1.2, -0.3, 0.8],    // Rear left
    [1.2, -0.3, -0.8]    // Rear right
  ];

  return (
    <group>
      {wheelPositions.map((position, index) => (
        <Cylinder
          key={index}
          ref={wheelRefs[index]}
          position={position}
          args={[0.4, 0.4, 0.2, 16]}
          rotation={[0, 0, Math.PI / 2]}
          onClick={handleClick}
        >
          <meshStandardMaterial 
            color={selectedPart === 'wheels' ? '#fbbf24' : '#374151'} 
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>
      ))}
    </group>
  );
};

// EV Battery Component
const EVBattery = ({ selectedPart, onPartSelect }: { selectedPart?: string | null, onPartSelect?: (part: string) => void }) => {
  const handleClick = () => {
    console.log('🔋 Battery clicked');
    onPartSelect?.('battery');
  };

  return (
    <Box position={[0, -0.2, 0]} args={[2.5, 0.3, 1]} onClick={handleClick}>
      <meshStandardMaterial 
        color={selectedPart === 'battery' ? '#10b981' : '#065f46'} 
        metalness={0.4}
        roughness={0.6}
        emissive={selectedPart === 'battery' ? '#065f46' : '#000000'}
        emissiveIntensity={selectedPart === 'battery' ? 0.2 : 0}
      />
    </Box>
  );
};

// EV Lights Component
const EVLights = ({ selectedPart, onPartSelect }: { selectedPart?: string | null, onPartSelect?: (part: string) => void }) => {
  const handleClick = () => {
    console.log('💡 Lights clicked');
    onPartSelect?.('lights');
  };

  return (
    <group>
      {/* Headlights */}
      <Sphere position={[1.6, 0.6, 0.5]} args={[0.15, 8, 8]} onClick={handleClick}>
        <meshStandardMaterial 
          color={selectedPart === 'lights' ? '#ffffff' : '#fbbf24'} 
          emissive={selectedPart === 'lights' ? '#fbbf24' : '#fbbf24'}
          emissiveIntensity={selectedPart === 'lights' ? 0.8 : 0.3}
        />
      </Sphere>
      <Sphere position={[1.6, 0.6, -0.5]} args={[0.15, 8, 8]} onClick={handleClick}>
        <meshStandardMaterial 
          color={selectedPart === 'lights' ? '#ffffff' : '#fbbf24'} 
          emissive={selectedPart === 'lights' ? '#fbbf24' : '#fbbf24'}
          emissiveIntensity={selectedPart === 'lights' ? 0.8 : 0.3}
        />
      </Sphere>
      
      {/* Taillights */}
      <Sphere position={[-1.6, 0.6, 0.5]} args={[0.12, 8, 8]} onClick={handleClick}>
        <meshStandardMaterial 
          color={selectedPart === 'lights' ? '#ffffff' : '#dc2626'} 
          emissive={selectedPart === 'lights' ? '#dc2626' : '#dc2626'}
          emissiveIntensity={selectedPart === 'lights' ? 0.6 : 0.2}
        />
      </Sphere>
      <Sphere position={[-1.6, 0.6, -0.5]} args={[0.12, 8, 8]} onClick={handleClick}>
        <meshStandardMaterial 
          color={selectedPart === 'lights' ? '#ffffff' : '#dc2626'} 
          emissive={selectedPart === 'lights' ? '#dc2626' : '#dc2626'}
          emissiveIntensity={selectedPart === 'lights' ? 0.6 : 0.2}
        />
      </Sphere>
    </group>
  );
};

// Main EV Model Component
const EVModel = ({ onPartSelect, selectedPart, debugMode = true }: EVModelProps) => {
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [performanceInfo, setPerformanceInfo] = useState<string>('');

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
      setCanvasError('WebGL is not supported in this browser');
      console.error('❌ WebGL not supported');
    } else {
      console.log('✅ WebGL is supported');
    }

    // Performance monitoring
    if (debugMode) {
      const updatePerformance = () => {
        const memory = (performance as any).memory;
        if (memory) {
          setPerformanceInfo(`Memory: ${(memory.usedJSHeapSize / 1048576).toFixed(1)}MB`);
        }
      };
      const interval = setInterval(updatePerformance, 1000);
      return () => clearInterval(interval);
    }
  }, [debugMode]);

  const handleCanvasCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    console.log('✅ Canvas created successfully');
    console.log('✅ WebGL Renderer:', gl);
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  };

  const handleCanvasError = (error: any) => {
    console.error('❌ Canvas error:', error);
    setCanvasError(error.message || 'Canvas rendering error');
  };

  if (!webglSupported) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900/50 border border-red-500/50 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-400 text-lg font-semibold mb-2">WebGL Not Supported</div>
          <div className="text-slate-400 text-sm">Please use a modern browser with WebGL enabled</div>
        </div>
      </div>
    );
  }

  if (canvasError) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900/50 border border-red-500/50 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-400 text-lg font-semibold mb-2">3D Rendering Error</div>
          <div className="text-slate-400 text-sm">{canvasError}</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-full w-full relative"
    >
      {/* Debug Panel */}
      {debugMode && (
        <div className="absolute top-4 left-4 z-10 bg-black/70 text-white text-xs p-2 rounded border border-slate-600">
          <div>🔍 Debug Mode: ON</div>
          <div>🌐 WebGL: {webglSupported ? 'Enabled' : 'Disabled'}</div>
          <div>📊 {performanceInfo}</div>
          <div>🎯 Selected: {selectedPart || 'None'}</div>
        </div>
      )}

      <Canvas
        style={{ 
          display: 'block',
          width: '100%',
          height: '100%',
          minHeight: '500px'
        }}
        camera={{ 
          position: [5, 3, 5], 
          fov: 50,
          near: 0.1,
          far: 1000 
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true
        }}
        onCreated={handleCanvasCreated}
        onError={handleCanvasError}
      >
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#3b82f6" />
        <spotLight 
          position={[0, 15, 0]} 
          intensity={0.8} 
          angle={0.3} 
          penumbra={0.1}
          castShadow
        />

        {/* Interactive Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={1}
          minDistance={3}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.8}
        />

        {/* Presentation Controls for better UX */}
        <PresentationControls
          global
          snap={true}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Float
            speed={1.4}
            rotationIntensity={0.1}
            floatIntensity={0.2}
            floatingRange={[0, 0.1]}
          >
            {/* EV Model Components */}
            <EVCarBody selectedPart={selectedPart} onPartSelect={onPartSelect} />
            <EVWheels selectedPart={selectedPart} onPartSelect={onPartSelect} />
            <EVBattery selectedPart={selectedPart} onPartSelect={onPartSelect} />
            <EVLights selectedPart={selectedPart} onPartSelect={onPartSelect} />
          </Float>
        </PresentationControls>

        {/* Debug Visual Indicator */}
        {debugMode && <DebugBox />}

        {/* Ground plane for better depth perception */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#1e293b" 
            transparent 
            opacity={0.3}
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      </Canvas>
    </motion.div>
  );
};

export default EVModel;