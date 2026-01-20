import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Sky, Environment } from '@react-three/drei';
import { City } from './World';
import { PlayerCar } from './PlayerCar';
import { TrafficSystem } from './Traffic';
import { WeatherSystem } from './WeatherSystem';
import { useGameStore } from '../store';
import { GameState } from '../constants';

export const GameScene = () => {
  const gameState = useGameStore(state => state.gameState);

  return (
    <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
      <Suspense fallback={null}>
        <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />
        <Environment preset="city" />
        
        <WeatherSystem />

        <Physics gravity={[0, -9.8, 0]} broadphase="SAP">
          <City />
          
          {gameState === GameState.PLAYING && (
            <>
              <PlayerCar />
              <TrafficSystem />
            </>
          )}
        </Physics>
      </Suspense>
    </Canvas>
  );
};
