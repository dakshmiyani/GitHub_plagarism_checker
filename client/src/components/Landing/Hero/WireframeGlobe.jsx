import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const WireframeGlobe = () => {
  const globeRef = useRef();

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
      globeRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group position={[4, 3, -2]}>
      <Sphere ref={globeRef} args={[3, 32, 32]}>
        <meshBasicMaterial color="#00F5FF" wireframe={true} transparent opacity={0.15} />
      </Sphere>
    </group>
  );
};

export default WireframeGlobe;
