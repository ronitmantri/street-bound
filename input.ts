/// <reference lib="dom" />
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ControlsState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
  reset: boolean;
  
  setControl: (control: keyof Omit<ControlsState, 'setControl'>, value: boolean) => void;
}

export const useControls = create<ControlsState>()(
  subscribeWithSelector((set) => ({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
    reset: false,
    setControl: (control, value) => set({ [control]: value }),
  }))
);

// Keyboard listeners
const keys: Record<string, keyof Omit<ControlsState, 'setControl'>> = {
  ArrowUp: 'forward',
  w: 'forward',
  ArrowDown: 'backward',
  s: 'backward',
  ArrowLeft: 'left',
  a: 'left',
  ArrowRight: 'right',
  d: 'right',
  ' ': 'brake',
  r: 'reset'
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (keys[e.key]) useControls.getState().setControl(keys[e.key], true);
  });
  window.addEventListener('keyup', (e) => {
    if (keys[e.key]) useControls.getState().setControl(keys[e.key], false);
  });
}