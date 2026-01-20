import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRaycastVehicle, useBox } from '@react-three/cannon';
import { useControls } from '../utils/input';
import { useGameStore } from '../store';
import { CARS, RIM_STYLES, SPOILER_TYPES, WeatherType } from '../constants';
import { MissionManager } from './MissionManager';
import * as THREE from 'three';

// Wheel component for visual representation
const Wheel = React.forwardRef<THREE.Group, { radius: number; width: number; style: number }>(({ radius, width, style }, ref) => {
  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, width, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* Rim Visuals based on style */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {style === 1 ? ( // Sport
             <cylinderGeometry args={[radius * 0.6, radius * 0.6, width + 0.05, 5]} />
        ) : style === 2 ? ( // Blade
             <boxGeometry args={[radius * 1.2, width + 0.05, radius * 0.2]} />
        ) : style === 3 ? ( // Solid
             <cylinderGeometry args={[radius * 0.5, radius * 0.5, width + 0.05, 32]} />
        ) : ( // Standard
             <cylinderGeometry args={[radius * 0.6, radius * 0.6, width + 0.05, 8]} />
        )}
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
});

const TireSmoke = ({ wheels, braking, speed, weather }: { wheels: React.MutableRefObject<THREE.Group | null>[], braking: boolean, speed: number, weather: WeatherType }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const particles = useRef<Array<{
        position: THREE.Vector3;
        velocity: THREE.Vector3;
        scale: number;
        life: number;
    }>>([]);

    // Initialize pool
    useEffect(() => {
        particles.current = [];
        for(let i=0; i<50; i++) {
            particles.current.push({
                position: new THREE.Vector3(0, -1000, 0),
                velocity: new THREE.Vector3(),
                scale: 0,
                life: 0
            });
        }
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        
        const dt = Math.min(delta, 0.1);

        // Spawn logic: only from rear wheels (index 2 and 3)
        if (braking && Math.abs(speed) > 20) {
             [2, 3].forEach(wheelIdx => {
                 const wheel = wheels[wheelIdx].current;
                 if (wheel) {
                     // Find dead particle
                     const p = particles.current.find(part => part.life <= 0);
                     if (p) {
                        const worldPos = new THREE.Vector3();
                        wheel.getWorldPosition(worldPos);
                        
                        // Offset slightly to ground and back
                        p.position.copy(worldPos).setY(0.2);
                        
                        p.life = 1.0; 
                        p.scale = 0.5 + Math.random() * 0.5;
                        p.velocity.set(
                            (Math.random() - 0.5) * 2,
                            Math.random() * 1.5,
                            (Math.random() - 0.5) * 2
                        );
                     }
                 }
             })
        }

        // Update logic
        let activeCount = 0;
        particles.current.forEach((p, i) => {
            if (p.life > 0) {
                p.life -= dt * 1.0; // Fade speed
                p.position.addScaledVector(p.velocity, dt);
                p.scale += dt * 3.0; // Expand
                
                dummy.position.copy(p.position);
                // Scale affects size. To simulate fade, we can shrink quickly at end or just depend on opacity if we had custom shader.
                // Simple scaling approach:
                dummy.scale.setScalar(p.scale * Math.max(0, p.life)); 
                
                dummy.rotation.set(0, 0, 0); 
                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
                activeCount++;
            } else {
                // Hide
                dummy.position.set(0, -1000, 0);
                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
            }
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });
    
    const smokeColor = weather === WeatherType.RAIN ? "#d1d5db" : "#6b7280"; // Light grey in rain (steam), Darker grey normally
    const opacity = weather === WeatherType.RAIN ? 0.3 : 0.5
