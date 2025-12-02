import * as React from 'react';
import { SoundType } from '../types';

interface ControlsProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  isPlaying: boolean;
  onToggle: () => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const Controls: React.FC<ControlsProps> = ({ 
    bpm, 
    setBpm, 
    isPlaying, 
    onToggle,
    volume,
    setVolume
}) => {
    const [tapHistory, setTapHistory] = React.useState<number[]>([]);
    
    // Handle BPM slider change
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBpm(Number(e.target.value));
    };

    // Handle increments
    const adjustBpm = (amount: number) => {
        setBpm(Math.max(20, Math.min(300, bpm + amount)));
    };

    // Tap Tempo Logic
    const handleTap = () => {
        const now = Date.now();
        // Remove taps older than 2 seconds to keep it fresh
        const newHistory = [...tapHistory.filter(t => now - t < 2000), now];
        setTapHistory(newHistory);

        if (newHistory.length > 1) {
            // Calculate intervals
            const intervals = [];
            for (let i = 1; i < newHistory.length; i++) {
                intervals.push(newHistory[i] - newHistory[i-1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const newBpm = Math.round(60000 / avgInterval);
            if (newBpm >= 20 && newBpm <= 300) {
                setBpm(newBpm);
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center space-y-6">
            
            {/* BPM Display */}
            <div className="flex items-center justify-between w-full">
                <button 
                    onClick={() => adjustBpm(-1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 active:bg-slate-700 text-2xl font-bold"
                >
                    -
                </button>
                <div className="text-center">
                    <div className="text-6xl font-black text-white tabular-nums tracking-tighter">
                        {bpm}
                    </div>
                    <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold">BPM</div>
                </div>
                <button 
                    onClick={() => adjustBpm(1)}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 active:bg-slate-700 text-2xl font-bold"
                >
                    +
                </button>
            </div>

            {/* Slider */}
            <input 
                type="range" 
                min="20" 
                max="300" 
                value={bpm} 
                onChange={handleSliderChange}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />

            {/* Main Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
                <button 
                    onClick={handleTap}
                    className="py-4 px-6 rounded-2xl bg-slate-800 text-cyan-400 font-bold uppercase tracking-wider text-sm border-2 border-transparent active:border-cyan-500/50 transition-all hover:bg-slate-750"
                >
                    TAP
                </button>
                <button 
                    onClick={onToggle}
                    className={`
                        py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-sm text-white shadow-lg transition-all transform active:scale-95
                        ${isPlaying 
                            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-900/20' 
                            : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-900/20'}
                    `}
                >
                    {isPlaying ? 'STOP' : 'START'}
                </button>
            </div>

             {/* Volume Slider - Small */}
             <div className="w-full flex items-center space-x-3 pt-2">
                <span className="text-xs text-slate-500">VOL</span>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
            </div>
        </div>
    );
};

export default Controls;