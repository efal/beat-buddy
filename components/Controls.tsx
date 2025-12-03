import * as React from 'react';
import { SoundType } from '../types';

interface ControlsProps {
    bpm: number;
    setBpm: (bpm: number) => void;
    isPlaying: boolean;
    onToggle: () => void;
}

const Controls: React.FC<ControlsProps> = ({
    bpm,
    setBpm,
    isPlaying,
    onToggle
}) => {
    const [tapTimes, setTapTimes] = React.useState<number[]>([]);
    const tapTimeoutRef = React.useRef<number | null>(null);

    // Handle increments
    const adjustBpm = (amount: number) => {
        setBpm(Math.max(20, Math.min(300, bpm + amount)));
    };

    // Handle tap tempo
    const handleTap = () => {
        const now = Date.now();

        // Clear timeout if exists
        if (tapTimeoutRef.current) {
            window.clearTimeout(tapTimeoutRef.current);
        }

        setTapTimes(prevTimes => {
            const newTimes = [...prevTimes, now];

            // Keep only last 4 taps
            const recentTimes = newTimes.slice(-4);

            // Calculate BPM if we have at least 2 taps
            if (recentTimes.length >= 2) {
                const intervals: number[] = [];
                for (let i = 1; i < recentTimes.length; i++) {
                    intervals.push(recentTimes[i] - recentTimes[i - 1]);
                }

                // Average interval in milliseconds
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

                // Convert to BPM
                const calculatedBpm = Math.round(60000 / avgInterval);

                // Set BPM if it's in valid range
                if (calculatedBpm >= 20 && calculatedBpm <= 300) {
                    setBpm(calculatedBpm);
                }
            }

            return recentTimes;
        });

        // Reset tap times after 2 seconds of inactivity
        tapTimeoutRef.current = window.setTimeout(() => {
            setTapTimes([]);
        }, 2000);
    };

    return (
        <div className="w-full flex flex-col items-center space-y-6">

            {/* BPM Display with +/- buttons and TAP */}
            <div className="flex items-center justify-center gap-4 w-full">
                <button
                    onClick={() => adjustBpm(-1)}
                    className="w-16 h-16 flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-3xl font-bold shadow-lg active:scale-95 transition-all"
                >
                    −
                </button>

                <div className="flex flex-col items-center bg-slate-800/50 px-12 py-6 rounded-2xl border-2 border-slate-700">
                    <div className="text-8xl font-black text-white tabular-nums tracking-tighter">
                        {bpm}
                    </div>
                </div>

                <button
                    onClick={() => adjustBpm(1)}
                    className="w-16 h-16 flex items-center justify-center rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-3xl font-bold shadow-lg active:scale-95 transition-all"
                >
                    +
                </button>
            </div>

            {/* TAP Tempo Button */}
            <button
                onClick={handleTap}
                className="px-8 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-400 font-bold uppercase tracking-wider text-sm shadow-lg active:scale-95 transition-all border-2 border-slate-600"
            >
                TAP Tempo {tapTimes.length > 0 && `(${tapTimes.length})`}
            </button>

            {/* Start/Stop Button */}
            <button
                onClick={onToggle}
                className={`
                    w-full max-w-md py-6 rounded-2xl font-bold uppercase tracking-wider text-xl text-white shadow-2xl transition-all transform active:scale-98
                    ${isPlaying
                        ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'}`}
            >
                {isPlaying ? 'Stop' : 'Start'}
            </button>
        </div>
    );
};

export default Controls;