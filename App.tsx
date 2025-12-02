import * as React from 'react';
import { useMetronome } from './hooks/useMetronome';
import Controls from './components/Controls';
import Visualizer from './components/Visualizer';
import { SoundType } from './types';

const App: React.FC = () => {
    const [bpm, setBpm] = React.useState(100);
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

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center overflow-hidden">

            {/* Header */}
            <header className="w-full p-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Beat Buddy
                </h1>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-start px-4 py-4">

                {/* Visualizer */}
                <Visualizer
                    activeBeat={activeBeat}
                    beatsPerMeasure={beatsPerMeasure}
                    isPlaying={isPlaying}
                    bpm={bpm}
                />

                {/* Controls */}
                <div className="w-full max-w-md">
                    <Controls
                        bpm={bpm}
                        setBpm={setBpm}
                        isPlaying={isPlaying}
                        volume={volume}
                        setVolume={setVolume}
                        onToggle={toggle}
                    />
                </div>

                {/* Settings Section */}
                <div className="w-full max-w-md mt-8 space-y-6">
                    {/* Time Signature */}
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-2 block">
                            Time Signature
                        </label>
                        <div className="flex gap-2">
                            {[2, 3, 4, 6].map(beats => (
                                <button
                                    key={beats}
                                    onClick={() => setBeatsPerMeasure(beats)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${beatsPerMeasure === beats
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    {beats}/4
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sound Selection */}
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-2 block">
                            Sound
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { id: SoundType.CLICK, label: 'Digital' },
                                { id: SoundType.WOODBLOCK, label: 'Wood' },
                                { id: SoundType.BEEP, label: 'Beep' },
                                { id: SoundType.DRUM, label: 'Drum' }
                            ].map(sound => (
                                <button
                                    key={sound.id}
                                    onClick={() => setSoundType(sound.id)}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${soundType === sound.id
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                >
                                    {sound.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

        </div>
    );
};

export default App;