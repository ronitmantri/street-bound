/// <reference lib="dom" />
import React, { useEffect, useState } from 'react';
import { GameScene } from './components/GameScene';
import { HUD } from './components/UI/HUD';
import { MainMenu } from './components/UI/MainMenu';
import { MobileControls } from './components/UI/MobileControls';
import { useGameStore } from './store';
import { GameState } from './constants';

function App() {
  const gameState = useGameStore(state => state.gameState);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const urlParam = new URLSearchParams(window.location.search).has('mobile');
      setIsMobile(userAgent || urlParam);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <GameScene />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {gameState === GameState.PLAYING && (
            <>
                <HUD />
                <div className="pointer-events-auto">
                    {/* Controls allow pointer events */}
                    {isMobile && <MobileControls />}
                </div>
            </>
        )}
      </div>

      {/* Menu Layer (Top) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="pointer-events-auto w-full h-full">
            <MainMenu />
          </div>
      </div>
    </div>
  );
}

export default App;