import * as React from 'react';

interface VisualizerProps {
    activeBeat: number;
    beatsPerMeasure: number;
    isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ activeBeat, beatsPerMeasure, isPlaying }) => {
    const dots = Array.from({ length: beatsPerMeasure }, (_, i) => i);

    // Calculate horizontal position (0-100%)
    const getPointPosition = () => {
        if (!isPlaying || activeBeat < 0) return 0;

        // Move from 0% to 100% across all beats
        const progress = activeBeat / (beatsPerMeasure - 1);
        return progress * 100;
    };

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

                {/* Sweeping Point */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-linear"
                    style={{
                        left: `calc(8% + ${getPointPosition()}% * 0.84)`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Outer Glow Ring */}
                    <div className={`
                    absolute inset-0 rounded-full transition-all duration-150
                    ${isPlaying
                            ? 'w-16 h-16 bg-cyan-500/30 blur-xl animate-pulse'
                            : 'w-12 h-12 bg-cyan-500/10 blur-lg'
                        }
                `} style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} />

                    {/* Main Point */}
                    <div className={`
                    relative rounded-full transition-all duration-150 shadow-[0_0_20px_rgba(6,182,212,0.6)]
                    ${isPlaying && activeBeat === 0
                            ? 'w-8 h-8 bg-cyan-400'
                            : 'w-6 h-6 bg-cyan-500'
                        }
                `}>
                        {/* Inner Highlight */}
                        <div className={`
                        absolute inset-1 rounded-full
                        ${isPlaying && activeBeat === 0 ? 'bg-cyan-100' : 'bg-cyan-300'}
                    `} />

                        {/* Pulse Ring on Beat 1 */}
                        {isPlaying && activeBeat === 0 && (
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                        )}
                    </div>
                </div>
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
        </div>
    );
};

export default Visualizer;