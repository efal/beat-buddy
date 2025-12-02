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
    const [showSettings, setShowSettings] = React.useState(false);

    // Determine subdivision based on sound or preference, could be expanded
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
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center overflow-hidden relative">

            {/* Header / Settings Toggle */}
            <header className="w-full p-4 flex justify-between items-center z-10">
                <h1 className="text-lg font-bold tracking-tight text-slate-400">TaktMeister</h1>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </header>

            {/* Main Settings Overlay */}
            {showSettings && (
                <div className="absolute top-16 left-4 right-4 bg-slate-800/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl z-20 border border-slate-700 animate-fade-in">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Taktart</label>
                            <div className="flex gap-2 mt-2">
                                {[2, 3, 4, 6].map(beats => (
                                    <button
                                        key={beats}
                                        onClick={() => setBeatsPerMeasure(beats)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border ${beatsPerMeasure === beats
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                            : 'bg-slate-900 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {beats}/4
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Sound</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {[
                                    { id: SoundType.CLICK, label: 'Digital' },
                                    { id: SoundType.WOODBLOCK, label: 'Holz' },
                                    { id: SoundType.BEEP, label: 'Beep' },
                                    { id: SoundType.DRUM, label: 'Drum' }
                                ].map(sound => (
                                    <button
                                        key={sound.id}
                                        onClick={() => setSoundType(sound.id)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium border text-left ${soundType === sound.id
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                            : 'bg-slate-900 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        {sound.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(false)}
                        className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold"
                    >
                        Schließen
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col items-center justify-start pt-8 pb-20">

                <Visualizer
                    activeBeat={activeBeat}
                    beatsPerMeasure={beatsPerMeasure}
                    isPlaying={isPlaying}
                    bpm={bpm}
                />

                <div className="mt-8 w-full">
                    <Controls
                        bpm={bpm}
                        setBpm={setBpm}
                        isPlaying={isPlaying}
                        volume={volume}
                        setVolume={setVolume}
                        onToggle={toggle}
                    />
                </div>

            </main>

        </div>
    );
};

export default App;