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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col overflow-hidden">

            {/* Neon Background Glow Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Main Content Area */}
            <main className="relative flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-between px-6 py-6 overflow-visible">

                {/* Top Section: Tempo & Time Signature Row */}
                <div className="w-full max-w-md flex justify-between items-center text-sm mt-2">
                    <div className="text-cyan-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                        {tempoMarking}
                    </div>
                    <div className="text-white font-bold text-lg">
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
                        volume={volume}
                        setVolume={setVolume}
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



                {/* Compact Settings Panel - Glassmorphism Style */}
                <div className="w-full max-w-2xl bg-slate-800/30 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="grid grid-cols-3 gap-6">

                        {/* Time Signature - Compact */}
                        <div>
                            <label className="text-[10px] text-cyan-400/80 uppercase font-bold tracking-widest mb-2 block drop-shadow-[0_0_4px_rgba(6,182,212,0.4)]">
                                Takt
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[2, 3, 4, 6].map(beats => (
                                    <button
                                        key={beats}
                                        onClick={() => setBeatsPerMeasure(beats)}
                                        className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${beatsPerMeasure === beats
                                            ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                                            : 'bg-slate-800/50 border-slate-600/40 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
                                            }`}
                                    >
                                        {beats}/4
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sound Selection - Compact */}
                        <div>
                            <label className="text-[10px] text-purple-400/80 uppercase font-bold tracking-widest mb-2 block drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]">
                                Sound
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[
                                    { id: SoundType.CLICK, label: 'Digital' },
                                    { id: SoundType.WOODBLOCK, label: 'Wood' },
                                    { id: SoundType.BEEP, label: 'Beep' },
                                    { id: SoundType.DRUM, label: 'Drum' }
                                ].map(sound => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setSoundType(sound.id)}
                                        className={`py-2 px-3 rounded-xl text-xs font-medium border-2 transition-all duration-200 ${soundType === sound.id
                                            ? 'bg-purple-500/30 text-purple-300 border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                                            : 'bg-slate-800/50 border-slate-600/40 text-slate-400 hover:border-purple-500/30 hover:text-purple-400'
                                            }`}
                                    >
                                        {sound.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Volume Control - Radio Buttons */}
                        <div>
                            <label className="text-[10px] text-pink-400/80 uppercase font-bold tracking-widest mb-2 block drop-shadow-[0_0_4px_rgba(236,72,153,0.4)]">
                                Lautstärke
                            </label>
                            <div className="grid grid-cols-3 gap-1.5">
                                {[0, 20, 40, 60, 80, 100].map(vol => (
                                    <button
                                        key={vol}
                                        onClick={() => setVolume(vol / 100)}
                                        className={`py-2 px-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 ${Math.round(volume * 100) === vol
                                            ? 'bg-pink-500/30 text-pink-300 border-pink-400/60 shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                                            : 'bg-slate-800/50 border-slate-600/40 text-slate-400 hover:border-pink-500/30 hover:text-pink-400'
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