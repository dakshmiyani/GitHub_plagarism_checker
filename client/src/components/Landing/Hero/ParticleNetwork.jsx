import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleNetwork = () => {
  const pointsRef = useRef();
  const linesRef = useRef();

  const particleCount = 2000;
  const maxDistance = 1.5;

  // Generate random positions and velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = [];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        )
      );
    }
    return [pos, vel];
  }, []);

  const pointShaderMaterial = useMemo(() => new THREE.PointsMaterial({
    color: 0x00F5FF,
    size: 0.03,
    transparent: true,
    opacity: 0.4
  }), []);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x00F5FF,
    transparent: true,
    opacity: 0.1
  }), []);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    const linePositions = [];

    // Drift particles
    for (let i = 0; i < particleCount; i++) {
      positionsArray[i * 3] += velocities[i].x;
      positionsArray[i * 3 + 1] += velocities[i].y;
      positionsArray[i * 3 + 2] += velocities[i].z;

      // Bounce off boundaries loosely
      if (Math.abs(positionsArray[i * 3]) > 10) velocities[i].x *= -1;
      if (Math.abs(positionsArray[i * 3 + 1]) > 10) velocities[i].y *= -1;
      if (Math.abs(positionsArray[i * 3 + 2] + 5) > 5) velocities[i].z *= -1;

      // Check distance for lines (only check a random subset for performance)
      if (i % 10 === 0) {
        for (let j = i + 1; j < particleCount; j += 10) {
          const dx = positionsArray[i * 3] - positionsArray[j * 3];
          const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
          const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistance * maxDistance) {
            linePositions.push(
              positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2],
              positionsArray[j * 3], positionsArray[j * 3 + 1], positionsArray[j * 3 + 2]
            );
          }
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update lines
    const lineGeo = linesRef.current.geometry;
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={pointShaderMaterial} attach="material" />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <primitive object={lineMaterial} attach="material" />
      </lineSegments>
    </group>
  );
};

export default ParticleNetwork;
