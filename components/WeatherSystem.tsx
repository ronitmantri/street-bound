import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store';
import { WeatherType } from '../constants';

export const WeatherSystem = () => {
  const weather = useGameStore(state => state.weather);
  const setWeather = useGameStore(state => state.setWeather);
  const rainRef = useRef<THREE.Points>(null);
  const [time, setTime] = useState(0);

  // Weather Cycle Logic
  useEffect(() => {
    const cycle = setInterval(() => {
      const r = Math.random();
      if (r < 0.4) setWeather(WeatherType.SUNNY);
      else if (r < 0.7) setWeather(WeatherType.RAIN);
      else setWeather(WeatherType.FOG);
    }, 30000); // Change weather every 30s for demo purposes
    return () => clearInterval(cycle);
  }, [setWeather]);

  // Create Rain Geometry
  const rainCount = 10000;
  const rainGeo = useRef<THREE.BufferGeometry>(null);
  
  useEffect(() => {
    if (rainGeo.current) {
        const positions = new Float32Array(rainCount * 3);
        for(let i=0; i<rainCount; i++) {
            positions[i*3] = (Math.random() - 0.5) * 400; // x
            positions[i*3+1] = Math.random() * 200; // y
            positions[i*3+2] = (Math.random() - 0.5) * 400; // z
        }
        rainGeo.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  useFrame((state, delta) => {
    setTime(t => t + delta);

    // Animate Rain
    if (weather === WeatherType.RAIN && rainRef.current) {
        const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
        for(let i=1; i<positions.length; i+=3) {
            positions[i] -= 50 * delta; // Fall speed
            if (positions[i] < 0) {
                positions[i] = 100;
            }
        }
        rainRef.current.geometry.attributes.position.needsUpdate = true;
        
        // Keep rain around camera
        rainRef.current.position.set(
            state.camera.position.x, 
            0, 
            state.camera.position.z
        );
    }
  });

  return (
    <>
      {/* Fog Control */}
      {weather === WeatherType.FOG && <fog attach="fog" args={['#a0a0a0', 10, 50]} />}
      {weather === WeatherType.RAIN && <fog attach="fog" args={['#334155', 20, 80]} />}
      {weather === WeatherType.SUNNY && <fog attach="fog" args={['#87CEEB', 50, 200]} />}

      {/* Rain Particles */}
      {weather === WeatherType.RAIN && (
        <points ref={rainRef}>
            <bufferGeometry ref={rainGeo}>
                <bufferAttribute
                    attach="attributes-position"
                    count={rainCount}
                    array={new Float32Array(rainCount * 3)}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial 
                color="#a5b4fc" 
                size={0.5} 
                transparent 
                opacity={0.8} 
            />
        </points>
      )}

      {/* Lighting adjustments based on weather */}
      <ambientLight intensity={weather === WeatherType.SUNNY ? 0.6 : 0.3} />
      <directionalLight 
        position={[100, 100, 50]} 
        intensity={weather === WeatherType.SUNNY ? 1 : 0.4} 
        castShadow 
      />
    </>
  );
};
