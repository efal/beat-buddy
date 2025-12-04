import * as React from 'react';

interface VisualizerProps {
    activeBeat: number;
    beatsPerMeasure: number;
    isPlaying: boolean;
    bpm: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ activeBeat, beatsPerMeasure, isPlaying, bpm }) => {
    const [targetAngle, setTargetAngle] = React.useState(0); // Start from center
    const [swingRight, setSwingRight] = React.useState(true); // Toggle for swing direction
    const prevBeatRef = React.useRef(-1);

    // Calculate beat duration in milliseconds for animation timing
    const beatDuration = (60 / bpm) * 1000;

    // Reset to center position when stopped
    React.useEffect(() => {
        if (!isPlaying) {
            setTargetAngle(0); // Reset to center
            setSwingRight(true); // Reset swing direction
            prevBeatRef.current = -1;
        }
    }, [isPlaying]);

    // Update target angle when beat changes - toggle direction each beat
    React.useEffect(() => {
        if (isPlaying && activeBeat >= 0 && activeBeat !== prevBeatRef.current) {
            prevBeatRef.current = activeBeat;

            // Swing to the current direction, then toggle for next beat
            const maxAngle = 40;
            const newAngle = swingRight ? maxAngle : -maxAngle;
            setTargetAngle(newAngle);
            setSwingRight(prev => !prev); // Toggle for next beat
        }
    }, [activeBeat, isPlaying, swingRight]);

    // Determine pendulum color based on beat
    const isAccent = activeBeat === 0;
    const pendulumColor = isPlaying
        ? (isAccent ? '#06b6d4' : '#a855f7')  // cyan for accent, purple for others
        : '#06b6d4'; // cyan when stopped

    return (
        <div className="w-full flex flex-col items-center justify-center scale-100 md:scale-[1.28]">
            {/* Metronome Container - wider for pendulum swing */}
            <div className="relative w-72 h-64 flex items-center justify-center">
                {/* Neon Glow Background */}
                <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-30 transition-colors duration-300"
                    style={{
                        background: isPlaying
                            ? (isAccent
                                ? 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)')
                            : 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)'
                    }}
                />

                {/* Metronome Body - Modern Pyramid Shape */}
                <svg
                    viewBox="0 0 200 280"
                    className="w-full h-full relative z-10"
                    style={{ filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6))' }}
                >
                    <defs>
                        {/* Gradient for pyramid body - 30% brighter */}
                        <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#64748b" />
                            <stop offset="50%" stopColor="#475569" />
                            <stop offset="100%" stopColor="#334155" />
                        </linearGradient>

                        {/* Neon glow filter */}
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Pendulum gradient */}
                        <linearGradient id="pendulumGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor={pendulumColor} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={pendulumColor} />
                        </linearGradient>
                    </defs>

                    {/* Main pyramid body */}
                    <path
                        d="M 100 25 L 155 255 L 45 255 Z"
                        fill="url(#pyramidGradient)"
                        stroke="rgba(148, 163, 184, 0.3)"
                        strokeWidth="1"
                    />

                    {/* Inner glass effect */}
                    <path
                        d="M 100 35 L 145 245 L 55 245 Z"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="1"
                    />

                    {/* Tempo marking lines - subtle neon */}
                    {[220, 190, 160, 130, 100, 70].map((y, i) => (
                        <line
                            key={y}
                            x1={60 + i * 2.5}
                            y1={y}
                            x2={140 - i * 2.5}
                            y2={y}
                            stroke="rgba(6, 182, 212, 0.2)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Base - sleek, 30% brighter */}
                    <ellipse
                        cx="100"
                        cy="255"
                        rx="55"
                        ry="10"
                        fill="#334155"
                    />
                    <ellipse
                        cx="100"
                        cy="255"
                        rx="40"
                        ry="6"
                        fill="#475569"
                    />

                    {/* Pendulum - ANCHORED AT BOTTOM, swings at top */}
                    <g
                        style={{
                            transition: isPlaying
                                ? `transform ${beatDuration}ms cubic-bezier(0.35, 0.0, 0.25, 1)`
                                : 'transform 0.3s ease-out',
                            transformOrigin: '100px 255px',
                            transform: `rotate(${targetAngle}deg)`
                        }}
                    >
                        {/* Pendulum rod - neon glow */}
                        <line
                            x1="100"
                            y1="255"
                            x2="100"
                            y2="45"
                            stroke="url(#pendulumGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            filter={isPlaying ? "url(#neonGlow)" : "none"}
                        />

                        {/* Pendulum weight at TOP - neon ball */}
                        <circle
                            cx="100"
                            cy="42"
                            r="12"
                            fill={pendulumColor}
                            filter={isPlaying ? "url(#neonGlow)" : "none"}
                        />

                        {/* Inner highlight */}
                        <circle
                            cx="97"
                            cy="39"
                            r="4"
                            fill="white"
                            opacity="0.4"
                        />

                        {/* Outer glow ring when playing */}
                        {isPlaying && (
                            <circle
                                cx="100"
                                cy="42"
                                r="20"
                                fill={pendulumColor}
                                opacity="0.25"
                                className="animate-pulse"
                            />
                        )}
                    </g>

                    {/* Anchor point at bottom - neon accent */}
                    <circle
                        cx="100"
                        cy="255"
                        r="5"
                        fill="#1e293b"
                        stroke={pendulumColor}
                        strokeWidth="2"
                        opacity="0.8"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Visualizer;