import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CarProps {
  carColor: string;
  speed: number;
}

function SimpleCar({ carColor, speed }: CarProps) {
  const carRef = useRef<Group>(null);
  
  useFrame(() => {
    if (carRef.current) {
      carRef.current.rotation.y += speed * 0.01;
    }
  });

  return (
    <group ref={carRef} position={[0, 0, 0]}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshStandardMaterial color={carColor} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Car Roof */}
      <mesh position={[0.2, 1.2, 0]}>
        <boxGeometry args={[2, 0.8, 1.3]} />
        <meshStandardMaterial color={carColor} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[1, 0, 0.8]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1, 0, -0.8]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-1, 0, 0.8]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-1, 0, -0.8]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function CarVisualization() {
  const [carColor, setCarColor] = useState('#4F46E5');
  const [speed, setSpeed] = useState(1);

  const colorPresets = [
    { name: 'Electric Blue', color: '#4F46E5' },
    { name: 'Tesla Red', color: '#DC2626' },
    { name: 'Forest Green', color: '#059669' },
    { name: 'Pearl White', color: '#F8FAFC' },
    { name: 'Midnight Black', color: '#1F2937' },
  ];

  return (
    <div className="w-full h-full space-y-6">
      {/* 3D Canvas */}
      <div className="h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden">
        <Canvas camera={{ position: [6, 4, 6], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[10, 5, 10]} intensity={0.5} color="#00f2fe" />
            
            <SimpleCar 
              carColor={carColor}
              speed={speed}
            />
            
            <OrbitControls enablePan={false} />
            
            {/* Ground */}
            <mesh position={[0, -1, 0]}>
              <boxGeometry args={[20, 0.1, 20]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      {/* Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">EV Customization Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                variant={carColor === preset.color ? "default" : "outline"}
                className={`justify-start ${
                  carColor === preset.color 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setCarColor(preset.color)}
              >
                <div 
                  className="w-4 h-4 rounded-full mr-2 border border-slate-400"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.name}
                {carColor === preset.color && (
                  <Badge className="ml-auto" variant="secondary">Active</Badge>
                )}
              </Button>
            ))}
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={() => setSpeed(speed === 0 ? 1 : 0)}
            >
              {speed === 0 ? 'Start' : 'Stop'} Rotation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CarVisualization;