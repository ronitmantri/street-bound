import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CARS, CarStats, GameState, WeatherType } from './constants';

export interface CarConfig {
  color: string;
  rim: number;
  spoiler: number;
}

interface GameStore {
  money: number;
  ownedCars: string[];
  selectedCarId: string;
  gameState: GameState;
  
  // Customization State
  carConfigs: Record<string, CarConfig>;
  updateCarConfig: (carId: string, config: Partial<CarConfig>) => void;

  // Weather State
  weather: WeatherType;
  setWeather: (w: WeatherType) => void;

  // Runtime State
  speed: number;
  isSpeeding: boolean;
  wantedLevel: number; // 0 to 3
  wantedTimer: number;

  // Mission State
  activeMissionId: string | null;
  missionCheckpointIndex: number;
  missionTimeRemaining: number;
  missionCompleted: boolean;
  
  // Actions
  addMoney: (amount: number) => void;
  buyCar: (carId: string) => void;
  selectCar: (carId: string) => void;
  setGameState: (state: GameState) => void;
  setSpeed: (speed: number) => void;
  setWantedLevel: (level: number) => void;
  
  // Mission Actions
  startMission: (missionId: string, timeLimit: number) => void;
  nextCheckpoint: () => void;
  tickMissionTimer: (delta: number) => void;
  endMission: () => void;

  // Reset for new sessions (optional)
  resetRuntime: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      money: 0,
      ownedCars: ['starter'],
      selectedCarId: 'starter',
      gameState: GameState.MENU,
      carConfigs: {},
      
      weather: WeatherType.SUNNY,
      
      speed: 0,
      isSpeeding: false,
      wantedLevel: 0,
      wantedTimer: 0,
      
      activeMissionId: null,
      missionCheckpointIndex: 0,
      missionTimeRemaining: 0,
      missionCompleted: false,

      addMoney: (amount) => set((state) => ({ money: state.money + amount })),
      buyCar: (carId) => set((state) => {
        const car = CARS.find(c => c.id === carId);
        if (car && state.money >= car.price && !state.ownedCars.includes(carId)) {
          return {
            money: state.money - car.price,
            ownedCars: [...state.ownedCars, carId],
            selectedCarId: carId
          };
        }
        return state;
      }),
      selectCar: (carId) => set({ selectedCarId: carId }),
      
      updateCarConfig: (carId, config) => set((state) => ({
        carConfigs: {
          ...state.carConfigs,
          [carId]: {
            ...(state.carConfigs[carId] || { color: CARS.find(c => c.id === carId)?.color || '#fff', rim: 0, spoiler: 0 }),
            ...config
          }
        }
      })),

      setGameState: (state) => set({ gameState: state }),
      setWeather: (w) => set({ weather: w }),
      
      setSpeed: (speed) => set((state) => ({ 
        speed,
        isSpeeding: state.gameState === GameState.PLAYING && speed > 75 
      })),
      
      setWantedLevel: (level) => set({ wantedLevel: level }),
      
      startMission: (missionId, timeLimit) => set({
        activeMissionId: missionId,
        missionCheckpointIndex: 0,
        missionTimeRemaining: timeLimit,
        missionCompleted: false,
        gameState: GameState.PLAYING
      }),

      nextCheckpoint: () => set((state) => ({
        missionCheckpointIndex: state.missionCheckpointIndex + 1
      })),

      tickMissionTimer: (delta) => set((state) => {
        if (!state.activeMissionId || state.missionCompleted) return {};
        const newTime = state.missionTimeRemaining - delta;
        if (newTime <= 0) {
          // Fail
          return { missionTimeRemaining: 0, activeMissionId: null };
        }
        return { missionTimeRemaining: newTime };
      }),

      endMission: () => set({ activeMissionId: null, missionCompleted: false }),
      
      resetRuntime: () => set({
        speed: 0,
        isSpeeding: false,
        wantedLevel: 0,
        wantedTimer: 0,
        activeMissionId: null
      })
    }),
    {
      name: 'streetbound-save',
      partialize: (state) => ({ 
        money: state.money, 
        ownedCars: state.ownedCars, 
        selectedCarId: state.selectedCarId,
        carConfigs: state.carConfigs
      }), 
    }
  )
);