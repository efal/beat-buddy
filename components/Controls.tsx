import * as React from 'react';
import { SoundType } from '../types';

interface ControlsProps {
    bpm: number;
    setBpm: (bpm: number) => void;
    isPlaying: boolean;
    onToggle: () => void;
    volume: number;
    setVolume: (volume: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
    bpm,
    setBpm,
    isPlaying,
    onToggle,
    volume,
    setVolume
}) => {
    const [tapTimes, setTapTimes] = React.useState<number[]>([]);
    const tapTimeoutRef = React.useRef<number | null>(null);
    const [previousVolume, setPreviousVolume] = React.useState(0.8);

    const isMuted = volume === 0;

    // Handle mute toggle
    const handleMuteToggle = () => {
        if (isMuted) {
            // Unmute: restore previous volume
            setVolume(previousVolume > 0 ? previousVolume : 0.8);
        } else {
            // Mute: save current volume and set to 0
            setPreviousVolume(volume);
            setVolume(0);
        }
    };

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
        <div className="w-full flex flex-col items-center space-y-5">

            {/* BPM Display with +/- buttons */}
            <div className="flex items-center justify-center gap-3 w-full">
                <button
                    onClick={() => adjustBpm(-1)}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-800/60 backdrop-blur-sm border-2 border-cyan-500/40 text-cyan-400 text-3xl font-bold shadow-lg active:scale-90 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200"
                >
                    −
                </button>

                <div className="flex flex-col items-center bg-slate-900/60 backdrop-blur-sm px-10 py-4 rounded-2xl border-2 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        {bpm}
                    </div>
                </div>

                <button
                    onClick={() => adjustBpm(1)}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-800/60 backdrop-blur-sm border-2 border-cyan-500/40 text-cyan-400 text-3xl font-bold shadow-lg active:scale-90 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200"
                >
                    +
                </button>
            </div>

            {/* TAP Tempo Button */}
            <button
                onClick={handleTap}
                className="px-6 py-2.5 rounded-xl bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700/50 text-purple-400 font-bold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all duration-200 border-2 border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_16px_rgba(168,85,247,0.25)]"
            >
                TAP Tempo {tapTimes.length > 0 && <span className="text-purple-300">({tapTimes.length})</span>}
            </button>

            {/* Start/Stop and Mute Buttons */}
            <div className="flex items-center gap-3 w-full max-w-sm">
                {/* Mute Button */}
                <button
                    onClick={handleMuteToggle}
                    className={`
                        w-16 h-16 flex items-center justify-center rounded-2xl font-bold text-2xl shadow-xl transition-all duration-300 transform active:scale-95 border-2
                        ${isMuted
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] border-amber-400/30 text-white'
                            : 'bg-slate-800/60 backdrop-blur-sm border-slate-600/40 text-slate-400 hover:border-slate-500 hover:text-white'
                        }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    {isMuted ? (
                        // Muted icon (speaker with X)
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        // Unmuted icon (speaker with waves)
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </button>

                {/* Start/Stop Button */}
                <button
                    onClick={onToggle}
                    className={`
                        flex-1 py-5 rounded-2xl font-bold uppercase tracking-widest text-lg text-white shadow-2xl transition-all duration-300 transform active:scale-95
                        ${isPlaying
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-[0_0_30px_rgba(244,63,94,0.4)] border-2 border-rose-400/30'
                            : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] border-2 border-cyan-400/30'}`}
                >
                    {isPlaying ? 'Stop' : 'Start'}
                </button>
            </div>
        </div>
    );
};

export default Controls;