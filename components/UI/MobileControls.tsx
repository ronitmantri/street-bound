import React from 'react';
import { useControls } from '../../utils/input';

export const MobileControls = () => {
  const setControl = useControls((state) => state.setControl);

  // Helper for touch events to ensure they don't propagate and cause scrolling
  const bind = (control: any) => ({
    onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); setControl(control, true); },
    onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); setControl(control, false); },
    // Handle mouse events for testing on desktop
    onMouseDown: () => setControl(control, true),
    onMouseUp: () => setControl(control, false),
    onMouseLeave: () => setControl(control, false),
  });

  const btnBase = "select-none touch-none active:scale-95 transition-transform flex items-center justify-center backdrop-blur-md shadow-lg border-2";

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-end pb-6 px-6 select-none">
      <div className="flex justify-between items-end w-full pointer-events-auto">
        
        {/* Steering - Left Side */}
        <div className="flex gap-4 mb-2">
          <button
            className={`${btnBase} w-20 h-20 rounded-full bg-black/40 border-white/30 active:bg-white/20`}
            {...bind('left')}
            aria-label="Steer Left"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
          
          <button
            className={`${btnBase} w-20 h-20 rounded-full bg-black/40 border-white/30 active:bg-white/20`}
            {...bind('right')}
            aria-label="Steer Right"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        {/* Pedals - Right Side */}
        <div className="flex gap-4 items-end mb-2">
           {/* Handbrake */}
           <button
            className={`${btnBase} w-16 h-16 rounded-full bg-red-900/40 border-red-500/50 active:bg-red-600/40 mb-4`}
            {...bind('brake')}
            aria-label="Handbrake"
          >
             <span className="text-white font-bold text-xs tracking-wider">DRIFT</span>
          </button>

           {/* Brake / Reverse */}
          <button
            className={`${btnBase} w-20 h-24 rounded-2xl bg-gray-900/60 border-gray-500/50 active:bg-gray-700/60`}
            {...bind('backward')}
            aria-label="Reverse / Brake"
          >
             <span className="text-white font-bold text-sm">REV</span>
          </button>

           {/* Gas */}
           <button
            className={`${btnBase} w-24 h-40 rounded-2xl bg-green-600/40 border-green-400/50 active:bg-green-500/40`}
            {...bind('forward')}
            aria-label="Accelerate"
          >
             <span className="text-white font-bold text-lg rotate-90">GAS</span>
          </button>
        </div>
      </div>
      
      {/* Reset Button */}
       <div className="absolute top-24 right-6 pointer-events-auto">
        <button 
            className={`${btnBase} w-10 h-10 rounded-full bg-gray-800/60 border-white/20 text-white text-xs`}
            onClick={() => {
                useControls.getState().setControl('reset', true);
                setTimeout(() => useControls.getState().setControl('reset', false), 100);
            }}
            aria-label="Reset Car"
        >
            R
        </button>
      </div>
    </div>
  );
};
