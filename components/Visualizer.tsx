import * as React from 'react';

interface VisualizerProps {
    activeBeat: number;
    beatsPerMeasure: number;
    isPlaying: boolean;
}

const Visualizer: React.FC<VisualizerProps> = ({ activeBeat, beatsPerMeasure, isPlaying }) => {
    const dots = Array.from({ length: beatsPerMeasure }, (_, i) => i);

    // Calculate pendulum rotation based on active beat
    // Swing from -30deg to +30deg over the beats
    const getPendulumRotation = () => {
        if (!isPlaying || activeBeat < 0) return 0;

        // Create smooth pendulum swing across all beats
        const progress = activeBeat / (beatsPerMeasure - 1);
        const angle = Math.sin(progress * Math.PI) * 30; // Swing ±30 degrees

        // Alternative: Simple left-right swing
        const swingRange = 30;
        const step = (swingRange * 2) / (beatsPerMeasure - 1);
        return -swingRange + (activeBeat * step);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center py-8">
            {/* Pendulum Container */}
            <div className="relative w-64 h-64 mb-8">
                {/* Pendulum Pivot Point */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-700 z-10 shadow-lg" />

                {/* Pendulum Arm */}
                <div
                    className="absolute top-0 left-1/2 origin-top transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-50%) rotate(${getPendulumRotation()}deg)`,
                        width: '4px',
                        height: '140px',
                        background: 'linear-gradient(180deg, #475569 0%, #06b6d4 100%)',
                        borderRadius: '2px'
                    }}
                >
                    {/* Pendulum Bob (Weight) */}
                    <div className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full transition-all duration-150
                    ${isPlaying && activeBeat === 0
                            ? 'w-12 h-12 bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.8)]'
                            : 'w-10 h-10 bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        }
                    ${isPlaying ? 'scale-100' : 'scale-90 opacity-70'}
                `}>
                        {/* Inner Glow */}
                        <div className={`
                        absolute inset-2 rounded-full transition-all
                        ${isPlaying && activeBeat === 0 ? 'bg-cyan-100' : 'bg-cyan-400'}
                    `} />
                    </div>
                </div>

                {/* Arc Background (Optional subtle guide) */}
                <svg className="absolute inset-0 opacity-20" viewBox="0 0 256 256">
                    <path
                        d="M 64 40 A 100 100 0 0 1 192 40"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>
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