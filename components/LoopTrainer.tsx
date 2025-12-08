import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';

interface LoopTrainerProps {
    onBack: () => void;
}

const LoopTrainer: React.FC<LoopTrainerProps> = ({ onBack }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [autoSpeedUp, setAutoSpeedUp] = useState(false);
    const [speedStep, setSpeedStep] = useState(0.05); // 5% increase
    const [maxSpeed, setMaxSpeed] = useState(1.5);
    const [fileName, setFileName] = useState<string | null>(null);
    const activeRegionRef = useRef<any>(null);

    // Refs for state access inside event listeners
    const stateRef = useRef({
        autoSpeedUp,
        speedStep,
        maxSpeed,
        playbackRate
    });

    useEffect(() => {
        stateRef.current = { autoSpeedUp, speedStep, maxSpeed, playbackRate };
    }, [autoSpeedUp, speedStep, maxSpeed, playbackRate]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: 'rgba(6, 182, 212, 0.4)',
            progressColor: 'rgba(168, 85, 247, 0.8)',
            cursorColor: '#fff',
            barWidth: 2,
            barGap: 3,
            height: 128,
            normalize: true,
            // backend: 'WebAudio', // REMOVED: Default to MediaElement for pitch preservation
        });

        const wsRegions = ws.registerPlugin(RegionsPlugin.create());

        wsRegions.enableDragSelection({
            color: 'rgba(236, 72, 153, 0.3)',
            resize: true,
            drag: true,
        });

        wsRegions.on('region-created', (region) => {
            wsRegions.getRegions().forEach(r => {
                if (r.id !== region.id) r.remove();
            });
            activeRegionRef.current = region;
            // Manual loop handling implies we don't rely on native looping
        });

        wsRegions.on('region-out', (region) => {
            if (activeRegionRef.current?.id === region.id) {
                // Manual Loop
                region.play();

                // Check Auto Speed Logic
                const { autoSpeedUp, speedStep, maxSpeed, playbackRate } = stateRef.current;

                if (autoSpeedUp) {
                    setPlaybackRate(prev => {
                        const next = prev + speedStep;
                        return next > maxSpeed ? maxSpeed : next;
                    });
                }
            }
        });

        wsRegions.on('region-clicked', (region, e) => {
            e.stopPropagation();
            region.play(); // Play loop on click
            activeRegionRef.current = region;
        });

        ws.on('interaction', () => {
            ws.play();
        });

        ws.on('finish', () => {
            if (!activeRegionRef.current) {
                setIsPlaying(false);
            }
        });

        // Sync playing state
        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));

        setWavesurfer(ws);

        return () => {
            ws.destroy();
        };
    }, []);

    // Effect to handle speed changes safely
    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.setPlaybackRate(playbackRate);
        }
    }, [playbackRate, wavesurfer]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && wavesurfer) {
            const url = URL.createObjectURL(file);
            wavesurfer.load(url);
            setFileName(file.name);
            setIsPlaying(false);
            setPlaybackRate(1.0);
        }
    };

    const togglePlay = () => {
        if (wavesurfer) {
            wavesurfer.playPause();
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-white/5 relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-white flex items-center gap-1 z-10 text-sm font-bold uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
            </button>

            <div className="text-center mb-6 mt-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    Loop Trainer
                </h2>
                <p className="text-slate-500 text-xs mt-1">Upload • Mark Loop • Auto-Speed</p>
            </div>

            {/* Waveform Area */}
            <div className="flex-1 w-full flex flex-col justify-center min-h-[200px] bg-slate-950/50 rounded-xl border border-white/10 p-4 mb-6 relative group">
                {!fileName && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-slate-600 text-sm">No Audio Loaded</span>
                    </div>
                )}
                <div ref={containerRef} className="w-full" />
            </div>

            {/* Controls */}
            <div className="grid gap-6">

                {/* File Upload & Playback */}
                <div className="flex items-center justify-between gap-4">
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
                        Choose File
                    </label>

                    <button
                        onClick={togglePlay}
                        className={`flex-1 flex items-center justify-center p-4 rounded-xl text-white font-bold text-xl transition-all ${isPlaying
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                            : 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                            }`}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        )}
                    </button>

                    <div className="text-right w-24">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Speed</div>
                        <div className="text-2xl font-mono text-cyan-300 font-bold">{Math.round(playbackRate * 100)}%</div>
                    </div>
                </div>

                {/* Speed Controls */}
                <div className="bg-slate-800/40 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs font-bold text-slate-400 w-12 text-right">Speed</span>
                        <input
                            type="range"
                            min="0.3"
                            max="2.0"
                            step="0.05"
                            value={playbackRate}
                            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110
                            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.5)] [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:scale-110"
                        />
                        <button
                            onClick={() => setPlaybackRate(1.0)}
                            className="text-[10px] px-2 py-1 bg-slate-700 rounded text-slate-300 hover:text-white"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoSpeedUp}
                                    onChange={(e) => setAutoSpeedUp(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500/80 shadow-[0_0_10px_rgba(168,85,247,0.2)]"></div>
                                <span className="ml-2 text-sm font-bold text-slate-300">Auto + Speed</span>
                            </label>
                        </div>

                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${autoSpeedUp ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                            <span className="text-xs text-slate-500">Video</span>
                            <select
                                value={speedStep}
                                onChange={(e) => setSpeedStep(parseFloat(e.target.value))}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none"
                            >
                                <option value="0.01">+1%</option>
                                <option value="0.02">+2%</option>
                                <option value="0.05">+5%</option>
                                <option value="0.10">+10%</option>
                            </select>
                            <span className="text-xs text-slate-500">Max:</span>
                            <select
                                value={maxSpeed}
                                onChange={(e) => setMaxSpeed(parseFloat(e.target.value))}
                                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none"
                            >
                                <option value="1.0">100%</option>
                                <option value="1.25">125%</option>
                                <option value="1.5">150%</option>
                                <option value="2.0">200%</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center italic">
                    Usage: Upload an audio file. Drag on waveform to create a loop.
                </div>

            </div>
        </div>
    );
};

export default LoopTrainer;
