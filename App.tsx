import * as React from 'react';
import { useMetronome } from './hooks/useMetronome';
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import { SoundType } from './types';

// Tempo markings based on BPM
const getTempoMarking = (bpm: number): string => {
    if (bpm < 40) return 'Grave';
    if (bpm < 60) return 'Largo';
    if (bpm < 66) return 'Larghetto';
    if (bpm < 76) return 'Adagio';
    if (bpm < 108) return 'Andante';
    if (bpm < 120) return 'Moderato';
    if (bpm < 156) return 'Allegro';
    if (bpm < 176) return 'Vivace';
    if (bpm < 200) return 'Presto';
    return 'Prestissimo';
};

const App: React.FC = () => {
    const [bpm, setBpm] = React.useState(120);
    const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);
    const [soundType, setSoundType] = React.useState<SoundType>(SoundType.CLICK);
    const [activeBeat, setActiveBeat] = React.useState(-1);
    const [volume, setVolume] = React.useState(0.8);

    const subdivision = 1;

    const onBeat = React.useCallback((beatIndex: number, isAccent: boolean) => {
        setActiveBeat(beatIndex);
    }, []);

    const { isPlaying, toggle } = useMetronome({
        bpm,
        beatsPerMeasure,
        subdivision,
        soundType,
        volume,
        onBeat
    });

    const tempoMarking = getTempoMarking(bpm);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col overflow-hidden">

            {/* Header with Icon and Title */}
            <header className="w-full p-4 flex items-center justify-center gap-3 border-b border-cyan-500/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L6 20h12L12 2z" fill="currentColor" className="text-cyan-400" />
                </svg>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Metronome
                </h1>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-between px-4 py-4 overflow-visible">

                {/* Top Section: Tempo & Time Signature Row */}
                <div className="w-full max-w-md flex justify-between items-center text-sm">
                    <div className="text-cyan-400 font-semibold">
                        {tempoMarking}
                    </div>
                    <div className="text-white font-semibold">
                        {beatsPerMeasure}/4
                    </div>
                </div>

                {/* Controls Section - Compact */}
                <div className="w-full max-w-lg">
                    <Controls
                        bpm={bpm}
                        setBpm={setBpm}
                        isPlaying={isPlaying}
                        onToggle={toggle}
                    />
                </div>

                {/* Metronome Visualizer - Scaled Down with overflow visible */}
                <div className="w-full flex justify-center -my-4 overflow-visible px-8">
                    <Visualizer
                        activeBeat={activeBeat}
                        beatsPerMeasure={beatsPerMeasure}
                        isPlaying={isPlaying}
                        bpm={bpm}
                    />
                </div>

                {/* Beat Indicator Dots */}
                <div className="flex gap-2 mb-2">
                    {Array.from({ length: beatsPerMeasure }, (_, i) => {
                        const isActive = isPlaying && activeBeat === i;
                        const isFirst = i === 0;
                        return (
                            <div
                                key={i}
                                className={`
                                    h-2 w-2 rounded-full transition-all duration-100
                                    ${isActive
                                        ? (isFirst ? 'bg-cyan-400 scale-150 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-cyan-300 scale-150')
                                        : 'bg-cyan-900'
                                    }
                                `}
                            />
                        );
                    })}
                </div>

                {/* Compact Settings Panel - Always Visible */}
                <div className="w-full max-w-2xl bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    <div className="grid grid-cols-3 gap-4">

                        {/* Time Signature - Compact */}
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-1.5 block">
                                Time Signature
                            </label>
                            <div className="grid grid-cols-2 gap-1">
                                {[2, 3, 4, 6].map(beats => (
                                    <button
                                        key={beats}
                                        onClick={() => setBeatsPerMeasure(beats)}
                                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${beatsPerMeasure === beats
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        {beats}/4
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sound Selection - Compact */}
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-1.5 block">
                                Sound
                            </label>
                            <div className="grid grid-cols-2 gap-1">
                                {[
                                    { id: SoundType.CLICK, label: 'Digital' },
                                    { id: SoundType.WOODBLOCK, label: 'Wood' },
                                    { id: SoundType.BEEP, label: 'Beep' },
                                    { id: SoundType.DRUM, label: 'Drum' }
                                ].map(sound => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setSoundType(sound.id)}
                                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${soundType === sound.id
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        {sound.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Volume Control - Radio Buttons */}
                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-1.5 block">
                                Lautstärke
                            </label>
                            <div className="grid grid-cols-3 gap-1">
                                {[0, 20, 40, 60, 80, 100].map(vol => (
                                    <button
                                        key={vol}
                                        onClick={() => setVolume(vol / 100)}
                                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${Math.round(volume * 100) === vol
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                    >
                                        {vol}%
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    );
};

export default App;