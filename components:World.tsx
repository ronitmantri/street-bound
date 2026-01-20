import React, { useMemo, useRef } from 'react';
import { Instance, Instances } from '@react-three/drei';
import { useBox, usePlane } from '@react-three/cannon';
import { BLOCK_SIZE, BUILDING_COLORS, CITY_SIZE, ROAD_WIDTH } from '../constants';
import * as THREE from 'three';

const Ground = () => {
  const [ref] = usePlane(() => ({ 
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.1, 0],
    material: { friction: 0.1 } 
  }), useRef<THREE.Mesh>(null));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[CITY_SIZE * BLOCK_SIZE * 2, CITY_SIZE * BLOCK_SIZE * 2]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
  );
};

// Physics collider for a city block (building cluster)
const CityBlockCollider = ({ position, size }: { position: [number, number, number], size: [number, number, number] }) => {
    useBox(() => ({
        args: size,
        position: position,
        type: 'Static'
    }));
    return null;
}

const BuildingInstances = () => {
  // Generate building data
  const buildings = useMemo(() => {
    const data: any[] = [];
    const offset = (CITY_SIZE * BLOCK_SIZE) / 2;

    for (let x = 0; x < CITY_SIZE; x++) {
      for (let z = 0; z < CITY_SIZE; z++) {
        // Position of the block center
        const posX = (x * BLOCK_SIZE) - offset;
        const posZ = (z * BLOCK_SIZE) - offset;
        
        // Don't build on the center (spawn point)
        if (Math.abs(posX) < BLOCK_SIZE && Math.abs(posZ) < BLOCK_SIZE) continue;

        // Create a few buildings per block
        // Building area is BLOCK_SIZE - ROAD_WIDTH
        const buildingArea = BLOCK_SIZE - ROAD_WIDTH;
        
        // Add physics collider for the whole block sidewalk to prevent driving through
        data.push({
            type: 'collider',
            position: [posX, 1, posZ],
            size: [buildingArea, 2, buildingArea]
        });

        // Visual Buildings
        const height = 10 + Math.random() * 40;
        data.push({
            type: 'visual',
            position: [posX, height/2, posZ],
            scale: [buildingArea - 2, height, buildingArea - 2],
            color: BUILDING_COLORS[Math.floor(Math.random() * BUILDING_COLORS.length)]
        });
      }
    }
    return data;
  }, []);

  const visuals = buildings.filter(b => b.type === 'visual');
  const colliders = buildings.filter(b => b.type === 'collider');

  return (
    <group>
        {colliders.map((c, i) => (
            <CityBlockCollider key={`col-${i}`} position={c.position} size={c.size} />
        ))}

        <Instances range={visuals.length}>
            <boxGeometry />
            <meshStandardMaterial />
            {visuals.map((data, i) => (
                <Instance
                    key={i}
                    position={data.position}
                    scale={data.scale}
                    color={data.color}
                />
            ))}
        </Instances>
    </group>
  );
};

// Simple Road Markings
const RoadMarkings = () => {
    // We just draw lines on the ground plane logic visually
    // This is a simplified approach using Instances for lane dashes
    const dashes = useMemo(() => {
        const arr = [];
        const offset = (CITY_SIZE * BLOCK_SIZE) / 2;
        
        // Vertical Roads
        for(let x=0; x <= CITY_SIZE; x++) {
            const posX = (x * BLOCK_SIZE) - offset - (BLOCK_SIZE/2);
            for(let z=0; z < CITY_SIZE * BLOCK_SIZE; z+=10) {
                 arr.push({ pos: [posX, 0.05, z - offset], rot: [Math.PI/2, 0, 0] })
            }
        }
        // Horizontal Roads
        for(let z=0; z <= CITY_SIZE; z++) {
            const posZ = (z * BLOCK_SIZE) - offset - (BLOCK_SIZE/2);
            for(let x=0; x < CITY_SIZE * BLOCK_SIZE; x+=10) {
                 arr.push({ pos: [x - offset, 0.05, posZ], rot: [Math.PI/2, 0, Math.PI/2] })
            }
        }
        return arr;
    }, []);

    return (
        <Instances range={dashes.length}>
            <planeGeometry args={[0.5, 4]} />
            <meshBasicMaterial color="#fbbf24" />
            {dashes.map((d, i) => (
                <Instance key={i} position={d.pos} rotation={d.rot} />
            ))}
        </Instances>
    )
}

export const City = () => {
  return (
    <group>
      <Ground />
      {/* Light managed by WeatherSystem now */}
      <BuildingInstances />
      <RoadMarkings />
    </group>
  );
};