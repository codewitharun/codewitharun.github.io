"use client";

// The hero centerpiece: a low-poly "titan" form that's deliberately
// imperfect — distorted, not a clean sphere — as a literal rendering of
// the brand idea ("titen", not "titan": built while imperfect, shipped
// anyway). Wrapped in its own Suspense-friendly Canvas so the rest of the
// page never depends on WebGL being available.

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";

// Note: deliberately no <Environment> here — drei's presets fetch an HDR
// map from an external CDN at runtime, which is a network dependency this
// scene doesn't need (the two colored point lights below already do the
// job) and one less thing that can fail on a restricted network.

function TitanCore() {
  const meshRef = useRef<Mesh>(null);
  const wireRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.08;
      meshRef.current.rotation.y += delta * 0.12;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.05;
      wireRef.current.rotation.y -= delta * 0.09;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 4]} />
        <MeshDistortMaterial
          color="#a668ff"
          emissive="#3a1a66"
          emissiveIntensity={0.6}
          distort={0.42}
          speed={1.6}
          roughness={0.15}
          metalness={0.5}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.22}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#00ffa4" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function TitanShape() {
  return (
    <div className="h-full w-full" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4.6], fov: 42 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 2, 4]} intensity={12} color="#00ffa4" />
          <pointLight position={[-3, -2, -2]} intensity={10} color="#a668ff" />
          <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
            <TitanCore />
          </Float>
          <Sparkles count={60} scale={5} size={2} speed={0.3} color="#c9c6d6" opacity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
