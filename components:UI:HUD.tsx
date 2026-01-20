import React, { useEffect } from 'react';
import { useGameStore } from '../../store';
import { SPEED_LIMIT, POLICE_THRESHOLD, MISSIONS, WeatherType } from '../../constants';

export const HUD = () => {
  const speed = useGameStore((state) => state.speed);
  const money = useGameStore((state) => state.money);
  const activeMissionId = useGameStore((state) => state.activeMissionId);
  const missionTime = useGameStore((state) => state.missionTimeRemaining);
  const weather = useGameStore((state) => state.weather);
  
  const isSpeeding = speed > SPEED_LIMIT;
  const isPoliceActive = speed > POLICE_THRESHOLD;
  const addMoney = useGameStore(state => state.addMoney);

  const activeMission = MISSIONS.find(m => m.id === activeMissionId);

  // Passive income for speeding
  useEffect(() => {
    let interval: any;
    if (isSpeeding && !activeMissionId) { // Disable passive income during missions to focus player
        interval = setInterval(() => {
            addMoney(10);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSpeeding, addMoney, activeMissionId]);

  return (
    <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-start w-full">
            <div className="bg-black/60 backdrop-blur rounded-lg p-2 px-4 border-l-4 border-yellow-400">
            <span className="text-yellow-400 text-sm font-bold block">BANK</span>
            <span className="text-white text-2xl font-mono">${money.toLocaleString()}</span>
            </div>

            <div className="flex flex-col items-end gap-2">
                 {/* Weather Icon/Text */}
                 <div className="bg-black/30 backdrop-blur px-3 py-1 rounded text-xs text-white/70">
                     {weather}
                 </div>

                {isPoliceActive && (
                <div className="animate-pulse bg-red-600/90 text-white px-4 py-2 rounded font-bold tracking-widest border-2 border-white shadow-lg shadow-red-500/50">
                    POLICE PURSUIT
                </div>
                )}
            </div>
        </div>

        {/* Mission Panel */}
        {activeMission && (
             <div className="self-center bg-black/70 backdrop-blur-md border border-white/20 p-4 rounded-xl min-w-[250px] text-center shadow-lg">
                 <h3 className="text-yellow-400 font-bold uppercase text-sm tracking-wider mb-1">Current Job</h3>
                 <div className="text-white font-bold text-lg leading-tight">{activeMission.title}</div>
                 <div className={`text-4xl font-mono font-black mt-2 ${missionTime < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                     {missionTime.toFixed(1)}s
                 </div>
             </div>
        )}
      </div>

      {/* Speedometer */}
      <div className="self-end mb-32 md:mb-8 flex items-end gap-4">
         <div className="bg-white/10 backdrop-blur rounded-full w-24 h-24 border-4 border-white flex flex-col items-center justify-center relative overflow-hidden">
            <span className={`text-3xl font-black italic ${isSpeeding ? 'text-red-500' : 'text-white'}`}>
                {speed}
            </span>
            <span className="text-xs text-gray-300 font-bold">KM/H</span>
            
            {/* Speed Limit Indicator */}
            <div className="absolute bottom-2 w-full text-center">
                <span className="text-[10px] bg-white text-black px-1 rounded font-bold">LIMIT {SPEED_LIMIT}</span>
            </div>
         </div>
      </div>
    </div>
  );
};