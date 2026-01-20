import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import { MISSIONS } from '../constants';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export const MissionManager = ({ playerPosition }: { playerPosition: THREE.Vector3 }) => {
  const activeMissionId = useGameStore(state => state.activeMissionId);
  const checkpointIndex = useGameStore(state => state.missionCheckpointIndex);
  const nextCheckpoint = useGameStore(state => state.nextCheckpoint);
  const endMission = useGameStore(state => state.endMission);
  const tickTimer = useGameStore(state => state.tickMissionTimer);
  const addMoney = useGameStore(state => state.addMoney);

  const mission = MISSIONS.find(m => m.id === activeMissionId);

  useFrame((state, delta) => {
    if (!mission) return;

    tickTimer(delta);

    // Check distance to current checkpoint
    const currentCheckpoint = mission.checkpoints[checkpointIndex];
    if (currentCheckpoint) {
        const cpPos = new THREE.Vector3(...currentCheckpoint);
        const dist = playerPosition.distanceTo(cpPos);
        
        // Checkpoint radius 10 units
        if (dist < 10) {
            if (checkpointIndex >= mission.checkpoints.length - 1) {
                // Mission Complete
                addMoney(mission.reward);
                endMission();
                alert(`Mission Complete! Reward: $${mission.reward}`);
            } else {
                nextCheckpoint();
            }
        }
    }
  });

  if (!mission) return null;

  const currentCp = mission.checkpoints[checkpointIndex];

  return (
    <group>
        {currentCp && (
            <group position={new THREE.Vector3(...currentCp)}>
                {/* Visual Marker */}
                <mesh position={[0, 2, 0]}>
                    <torusGeometry args={[4, 0.5, 16, 100]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
                </mesh>
                <mesh position={[0, 2, 0]} rotation={[Math.PI/2, 0, 0]}>
                    <torusGeometry args={[4, 0.5, 16, 100]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
                </mesh>
                
                {/* Vertical Beam */}
                <mesh position={[0, 50, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 100, 8]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
                </mesh>

                <Html position={[0, 6, 0]} center>
                    <div className="bg-black/50 text-white px-2 py-1 rounded font-bold whitespace-nowrap">
                        CHECKPOINT
                    </div>
                </Html>
            </group>
        )}
    </group>
  );
};
