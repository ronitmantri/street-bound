import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { BLOCK_SIZE, CITY_SIZE, ROAD_WIDTH } from '../constants';
import * as THREE from 'three';

const NPC_COUNT = 30;

const NPCCar = ({ startPos, axis, speed }: { startPos: [number, number, number], axis: 'x' | 'z', speed: number }) => {
    const [ref, api] = useBox(() => ({
        mass: 500,
        position: startPos,
        args: [2, 1.5, 4],
        linearDamping: 0.5,
        angularDamping: 0.5,
        type: 'Kinematic' // Simplified physics, controlled by code
    }));

    const pos = useRef(new THREE.Vector3(startPos[0], startPos[1], startPos[2]));
    const dir = useRef(axis === 'x' ? 1 : 1);
    
    useFrame((state, delta) => {
        // Move car
        if(axis === 'x') {
            pos.current.x += speed * delta * dir.current;
        } else {
            pos.current.z += speed * delta * dir.current;
        }

        // Boundary check (City limits)
        const limit = (CITY_SIZE * BLOCK_SIZE) / 2;
        if(Math.abs(pos.current.x) > limit || Math.abs(pos.current.z) > limit) {
             // Reset to other side or flip direction
             dir.current *= -1;
        }

        api.position.set(pos.current.x, 1, pos.current.z);
        // Set rotation based on direction
        const rotY = axis === 'x' ? (dir.current > 0 ? Math.PI/2 : -Math.PI/2) : (dir.current > 0 ? 0 : Math.PI);
        api.rotation.set(0, rotY, 0);
    });

    return (
        <mesh ref={ref as any}>
            <boxGeometry args={[2, 1.5, 4]} />
            <meshStandardMaterial color="white" />
        </mesh>
    )
}

export const TrafficSystem = () => {
    const npcs = useMemo(() => {
        const items = [];
        const offset = (CITY_SIZE * BLOCK_SIZE) / 2;
        
        for(let i=0; i<NPC_COUNT; i++) {
            // Pick a random road
            const isHorizontal = Math.random() > 0.5;
            const roadIndex = Math.floor(Math.random() * CITY_SIZE);
            const laneOffset = Math.random() > 0.5 ? 3.5 : -3.5; // Right or left lane
            
            let x = 0, z = 0;
            
            if(isHorizontal) {
                // Moving along X, fixed Z
                z = (roadIndex * BLOCK_SIZE) - offset - (BLOCK_SIZE/2) + laneOffset;
                x = (Math.random() * CITY_SIZE * BLOCK_SIZE) - offset;
            } else {
                // Moving along Z, fixed X
                x = (roadIndex * BLOCK_SIZE) - offset - (BLOCK_SIZE/2) + laneOffset;
                z = (Math.random() * CITY_SIZE * BLOCK_SIZE) - offset;
            }

            items.push({
                id: i,
                pos: [x, 2, z] as [number, number, number],
                axis: isHorizontal ? 'x' : 'z' as 'x' | 'z',
                speed: 10 + Math.random() * 15
            });
        }
        return items;
    }, []);

    return (
        <group>
            {npcs.map(npc => (
                <NPCCar key={npc.id} startPos={npc.pos} axis={npc.axis} speed={npc.speed} />
            ))}
        </group>
    )
}
