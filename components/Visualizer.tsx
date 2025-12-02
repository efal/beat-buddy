import * as React from 'react';

interface VisualizerProps {
    activeBeat: number;
    beatsPerMeasure: number;
    isPlaying: boolean;
    bpm: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ activeBeat, beatsPerMeasure, isPlaying, bpm }) => {
    const dots = Array.from({ length: beatsPerMeasure }, (_, i) => i);
    const [animationKey, setAnimationKey] = React.useState(0);

    // Calculate beat duration in seconds for animation timing
    const beatDuration = 60 / bpm;

    // Restart animation on each beat change
    React.useEffect(() => {
        if (isPlaying && activeBeat >= 0) {
            setAnimationKey(prev => prev + 1);
        }
    }, [activeBeat, isPlaying]);

    return (
        <div className="w-full flex flex-col items-center justify-center py-8">
            {/* Horizontal Track Container */}
            <div className="relative w-full max-w-2xl h-32 mb-8 px-8">
                {/* Track Line */}
                <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-700 rounded-full -translate-y-1/2">
                    {/* Track Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-cyan-500/20 rounded-full blur-sm" />
                </div>

                {/* Beat Markers on Track */}
                <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 flex justify-between">
                    {dots.map((index) => (
                        <div
                            key={index}
                            className={`
                            w-3 h-3 rounded-full transition-all duration-150
                            ${index === 0 ? 'bg-cyan-500' : 'bg-slate-600'}
                        `}
                        />
                    ))}
                </div>

                {/* Sweeping Point - restarts on each beat */}
                {isPlaying && (
                    <div
                        key={animationKey}
                        className="absolute top-1/2 left-8 -translate-y-1/2 sweep-animation"
                    >
                        {/* Outer Glow Ring */}
                        <div className="absolute -inset-4 rounded-full bg-cyan-500/30 blur-xl animate-pulse" />

                        {/* Main Point */}
                        <div className={`
                        relative rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)]
                        ${activeBeat === 0
                                ? 'w-8 h-8 bg-cyan-400'
                                : 'w-6 h-6 bg-cyan-500'
                            }
                    `}>
                            {/* Inner Highlight */}
                            <div className={`
                            absolute inset-1 rounded-full
                            ${activeBeat === 0 ? 'bg-cyan-100' : 'bg-cyan-300'}
                        `} />

                            {/* Pulse Ring on Beat 1 */}
                            {activeBeat === 0 && (
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                            )}
                        </div>
                    </div>
                )}

                {/* Static point when paused */}
                {!isPlaying && (
                    <div className="absolute top-1/2 left-8 -translate-y-1/2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/50">
                            <div className="absolute inset-1 rounded-full bg-cyan-300/50" />
                        </div>
                    </div>
                )}
            </div>

            {/* Beat Counter Dots */}
            <div className="flex gap-3">
                {dots.map((index) => {
                    const isActive = isPlaying && activeBeat === index;
                    const isFirst = index === 0;
                    return (
                        <div
                            key={index}
                            className={`
                            h-4 w-4 rounded-full transition-all duration-100
                            ${isActive
                                    ? (isFirst ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-200 scale-125')
                                    : 'bg-slate-700'
                                }
                        `}
                        />
                    );
                })}
            </div>

            <style jsx>{`
            @keyframes sweepRight {
                from {
                    transform: translateX(0) translateY(-50%);
                }
                to {
                    transform: translateX(calc(100vw - 20rem)) translateY(-50%);
                }
            }
            .sweep-animation {
                animation: sweepRight ${beatDuration}s linear forwards;
            }
        `}</style>
        </div>
    );
};

export default Visualizer;