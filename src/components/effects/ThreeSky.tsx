import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

// Camera controller to apply mouse parallax
function CameraRig() {
  useFrame((state) => {
    // pointer values range from -1 to 1 representing normalized mouse coordinates
    const targetX = state.pointer.x * 1.5;
    const targetY = state.pointer.y * 1.5;

    // Smoothly interpolate (lerp) camera position for cinematic inertia
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0, -10);
  });

  return null;
}

// Glowing Moon component using layered transparent spheres
function GlowingMoon() {
  const moonRef = useRef<THREE.Mesh>(null);

  // Slow rotation for the moon
  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group position={[2.5, 1.8, -12]}>
      {/* Outer Glow 3 */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#fffdd0" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      {/* Outer Glow 2 */}
      <mesh>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial color="#fffdd0" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      {/* Outer Glow 1 */}
      <mesh>
        <sphereGeometry args={[1.15, 16, 16]} />
        <meshBasicMaterial color="#fffdd0" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
      {/* Core Moon Sphere */}
      <mesh ref={moonRef}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial color="#fffef0" />
      </mesh>
    </group>
  );
}

export default function ThreeSky() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-20 overflow-hidden bg-gradient-to-b from-love-dark via-love-dark/95 to-love-mid/90">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        {/* Soft background ambient light */}
        <ambientLight intensity={0.5} />
        
        {/* Magic Glowing Moon */}
        <GlowingMoon />

        {/* Twinkling Starfield */}
        <Stars
          radius={120}       // Radius of the inner sphere
          depth={50}         // Depth of star field
          count={1500}       // Star count
          factor={4}         // Size factor
          saturation={0.5}   // Saturation
          fade               // Fade on scroll/edge
          speed={0.8}        // Twinkle speed
        />

        {/* Interactive Camera Rig */}
        <CameraRig />
      </Canvas>
    </div>
  );
}
