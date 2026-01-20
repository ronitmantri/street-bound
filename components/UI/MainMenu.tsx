import React, { useState } from 'react';
import { useGameStore } from '../../store';
import { CARS, GameState, MISSIONS, PAINT_COLORS, RIM_STYLES, SPOILER_TYPES } from '../../constants';

export const MainMenu = () => {
  const { 
    gameState, 
    setGameState, 
    money, 
    ownedCars, 
    selectedCarId, 
    buyCar, 
    selectCar,
    carConfigs,
    updateCarConfig,
    startMission
  } = useGameStore();

  const [garageMode, setGarageMode] = useState<'SELECT' | 'CUSTOMIZE' | 'MISSIONS'>('SELECT');

  if (gameState !== GameState.MENU && gameState !== GameState.GARAGE) return null;

  const currentCar = CARS.find(c => c.id === selectedCarId);
  const currentConfig = carConfigs[selectedCarId] || { color: currentCar?.color || '#fff', rim: 0, spoiler: 0 };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-white p-6">
      
      {gameState === GameState.MENU ? (
        <div className="text-center space-y-8 animate-fade-in">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
              STREETBOUND
            </h1>
            <p className="text-gray-400 mt-2">OPEN WORLD DRIVING</p>
          </div>
          
          <div className="flex flex-col gap-4 w-64 mx-auto">
            <button 
              onClick={() => setGameState(GameState.PLAYING)}
              className="bg-white text-black font-bold py-3 px-6 rounded hover:scale-105 transition-transform"
            >
              DRIVE
            </button>
            <button 
              onClick={() => setGameState(GameState.GARAGE)}
              className="bg-transparent border border-white/30 text-white font-bold py-3 px-6 rounded hover:bg-white/10 transition-colors"
            >
              GARAGE & MISSIONS
            </button>
          </div>

          <div className="text-xs text-gray-600 mt-8">
            Created by Ronit Mantri
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
                <button 
                    onClick={() => setGarageMode('SELECT')} 
                    className={`text-2xl font-bold ${garageMode === 'SELECT' ? 'text-white underline' : 'text-gray-500'}`}
                >
                    GARAGE
                </button>
                <button 
                    onClick={() => setGarageMode('CUSTOMIZE')} 
                    className={`text-2xl font-bold ${garageMode === 'CUSTOMIZE' ? 'text-white underline' : 'text-gray-500'}`}
                >
                    CUSTOMIZE
                </button>
                <button 
                    onClick={() => setGarageMode('MISSIONS')} 
                    className={`text-2xl font-bold ${garageMode === 'MISSIONS' ? 'text-white underline' : 'text-gray-500'}`}
                >
                    JOBS
                </button>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded text-green-400 font-mono">
              ${money.toLocaleString()}
            </div>
          </div>

          {/* CAR SELECTION */}
          {garageMode === 'SELECT' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pb-20">
                {CARS.map(car => {
                const isOwned = ownedCars.includes(car.id);
                const isSelected = selectedCarId === car.id;
                const config = carConfigs[car.id] || { color: car.color };

                return (
                    <div 
                    key={car.id} 
                    className={`bg-gray-900 rounded-xl p-4 border-2 transition-all ${isSelected ? 'border-yellow-400 shadow-lg shadow-yellow-500/20' : 'border-gray-800'}`}
                    >
                    <div className="h-24 bg-gray-800 rounded mb-4 flex items-center justify-center overflow-hidden">
                        <div className="w-16 h-8 rounded" style={{ backgroundColor: config.color }}></div>
                    </div>
                    
                    <h3 className="font-bold text-lg">{car.name}</h3>
                    
                    <div className="space-y-2 my-4 text-sm text-gray-400">
                        <div className="flex justify-between">
                        <span>Speed</span>
                        <div className="w-20 bg-gray-700 h-2 rounded overflow-hidden">
                            <div className="bg-white h-full" style={{ width: `${(car.speed / 200) * 100}%` }}></div>
                        </div>
                        </div>
                        <div className="flex justify-between">
                        <span>Accel</span>
                        <div className="w-20 bg-gray-700 h-2 rounded overflow-hidden">
                            <div className="bg-white h-full" style={{ width: `${(car.acceleration / 60) * 100}%` }}></div>
                        </div>
                        </div>
                    </div>

                    {isOwned ? (
                        <button 
                        onClick={() => selectCar(car.id)}
                        disabled={isSelected}
                        className={`w-full py-2 rounded font-bold ${isSelected ? 'bg-green-500/20 text-green-400' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                        {isSelected ? 'SELECTED' : 'SELECT'}
                        </button>
                    ) : (
                        <button 
                        onClick={() => buyCar(car.id)}
                        className={`w-full py-2 rounded font-bold ${money >= car.price ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                        >
                        BUY ${car.price}
                        </button>
                    )}
                    </div>
                );
                })}
            </div>
          )}

          {/* CUSTOMIZATION */}
          {garageMode === 'CUSTOMIZE' && (
              <div className="flex flex-col gap-8">
                  <div className="bg-gray-900 p-6 rounded-xl">
                      <h3 className="text-xl font-bold mb-4">Paint Color</h3>
                      <div className="flex gap-4 flex-wrap">
                          {PAINT_COLORS.map(color => (
                              <button
                                key={color}
                                onClick={() => updateCarConfig(selectedCarId, { color })}
                                className={`w-12 h-12 rounded-full border-4 ${currentConfig.color === color ? 'border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                              />
                          ))}
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4">Rims</h3>
                        <div className="flex flex-col gap-2">
                            {RIM_STYLES.map((style, idx) => (
                                <button
                                    key={style}
                                    onClick={() => updateCarConfig(selectedCarId, { rim: idx })}
                                    className={`p-3 rounded text-left ${currentConfig.rim === idx ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl">
                        <h3 className="text-xl font-bold mb-4">Body Kit (Spoiler)</h3>
                        <div className="flex flex-col gap-2">
                            {SPOILER_TYPES.map((style, idx) => (
                                <button
                                    key={style}
                                    onClick={() => updateCarConfig(selectedCarId, { spoiler: idx })}
                                    className={`p-3 rounded text-left ${currentConfig.spoiler === idx ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-800 hover:bg-gray-700'}`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>
                  </div>
              </div>
          )}

          {/* MISSIONS */}
          {garageMode === 'MISSIONS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MISSIONS.map(mission => (
                      <div key={mission.id} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-yellow-400">{mission.title}</h3>
                            <span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded font-mono">${mission.reward}</span>
                          </div>
                          <p className="text-gray-400 text-sm mb-4">{mission.description}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                              <span>Type: {mission.type}</span>
                              <span>Time: {mission.timeLimit}s</span>
                          </div>
                          <button 
                            onClick={() => startMission(mission.id, mission.timeLimit)}
                            className="w-full py-2 bg-white text-black font-bold rounded hover:bg-gray-200"
                          >
                              START JOB
                          </button>
                      </div>
                  ))}
              </div>
          )}

          <button 
            onClick={() => setGameState(GameState.MENU)}
            className="absolute bottom-6 left-6 text-white/50 hover:text-white flex items-center gap-2"
          >
            ← BACK
          </button>
        </div>
      )}
    </div>
  );
};
