import * as React from 'react';

interface VisualizerProps {
    activeBeat: number;
    beatsPerMeasure: number;
    isPlaying: boolean;
    bpm: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ activeBeat, beatsPerMeasure, isPlaying, bpm }) => {
    const [targetAngle, setTargetAngle] = React.useState(0);

    // Calculate beat duration in milliseconds for animation timing
    const beatDuration = (60 / bpm) * 1000;

    // Update target angle when beat changes
    React.useEffect(() => {
        if (isPlaying && activeBeat >= 0) {
            // Swing pattern: 0 -> left (-40deg), 1 -> right (+40deg), etc.
            const maxAngle = 40;
            const newAngle = activeBeat % 2 === 0 ? -maxAngle : maxAngle;
            setTargetAngle(newAngle);
        } else {
            setTargetAngle(0);
        }
    }, [activeBeat, isPlaying]);

    return (
        <div className="w-full flex flex-col items-center justify-center scale-75">
            {/* Metronome Container - More Compact */}
            <div className="relative w-56 h-64 flex items-center justify-center">
                {/* Metronome Body - Pyramid Shape */}
                <svg
                    viewBox="0 0 200 300"
                    className="w-full h-full"
                    style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))' }}
                >
                    {/* Main pyramid body */}
                    <path
                        d="M 100 30 L 160 270 L 40 270 Z"
                        fill="#d1d5db"
                        stroke="#9ca3af"
                        strokeWidth="2"
                    />

                    {/* Inner detail lines (tempo markings) */}
                    <line x1="55" y1="240" x2="145" y2="240" stroke="#6b7280" strokeWidth="1.5" />
                    <line x1="60" y1="210" x2="140" y2="210" stroke="#6b7280" strokeWidth="1.5" />
                    <line x1="65" y1="180" x2="135" y2="180" stroke="#6b7280" strokeWidth="1.5" />
                    <line x1="70" y1="150" x2="130" y2="150" stroke="#6b7280" strokeWidth="1.5" />
                    <line x1="75" y1="120" x2="125" y2="120" stroke="#6b7280" strokeWidth="1.5" />
                    <line x1="80" y1="90" x2="120" y2="90" stroke="#6b7280" strokeWidth="1.5" />
                    <line x1="85" y1="60" x2="115" y2="60" stroke="#6b7280" strokeWidth="1.5" />

                    {/* Base - darker, more 3D */}
                    <ellipse
                        cx="100"
                        cy="270"
                        rx="65"
                        ry="12"
                        fill="#1f2937"
                    />
                    <ellipse
                        cx="100"
                        cy="270"
                        rx="50"
                        ry="8"
                        fill="#374151"
                    />

                    {/* Pendulum - ANCHORED AT BOTTOM (270), swings at top */}
                    <g
                        style={{
                            transition: isPlaying ? `transform ${beatDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1)` : 'none',
                            transformOrigin: '100px 270px',
                            transform: `rotate(${targetAngle}deg)`
                        }}
                    >
                        {/* Pendulum rod - from bottom (270) to top (50) */}
                        <line
                            x1="100"
                            y1="270"
                            x2="100"
                            y2="50"
                            stroke="#f59e0b"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />

                        {/* Pendulum weight at TOP */}
                        <circle
                            cx="100"
                            cy="50"
                            r="10"
                            fill="#f59e0b"
                            stroke="#ea580c"
                            strokeWidth="2"
                        />

                        {/* Pendulum glow when playing */}
                        {isPlaying && (
                            <circle
                                cx="100"
                                cy="50"
                                r="16"
                                fill="#f59e0b"
                                opacity="0.4"
                            />
                        )}
                    </g>

                    {/* Anchor point at bottom - visible mount */}
                    <circle
                        cx="100"
                        cy="270"
                        r="6"
                        fill="#374151"
                        stroke="#6b7280"
                        strokeWidth="2"
                    />
                </svg>
            </div>

            {/* Beat Count Display - Compact */}
            <div className="text-center mt-2">
                <div className="text-lg font-bold text-white">
                    Beat: {isPlaying && activeBeat >= 0 ? activeBeat + 1 : '-'}
                </div>
            </div>
        </div>
    );
};

export default Visualizer;