import * as React from 'react';
import { SoundType } from '../types';

interface UseMetronomeProps {
  bpm: number;
  beatsPerMeasure: number;
  subdivision: number;
  soundType: SoundType;
  volume: number;
  onBeat: (beatNumber: number, isAccent: boolean) => void;
}

export const useMetronome = ({
  bpm,
  beatsPerMeasure,
  subdivision,
  soundType,
  volume,
  onBeat
}: UseMetronomeProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const nextNoteTimeRef = React.useRef<number>(0);
  const timerIDRef = React.useRef<number | null>(null);
  const beatCountRef = React.useRef<number>(0);
  
  // Lookahead settings
  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (in seconds)

  // Initialize Audio Context lazily
  const ensureAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playSound = (time: number, isAccent: boolean, isSubdivision: boolean) => {
    if (!audioContextRef.current) return;
    const osc = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    // Sound Synthesis based on SoundType
    if (soundType === SoundType.CLICK) {
      osc.type = 'square';
      osc.frequency.value = isAccent ? 1200 : isSubdivision ? 600 : 800;
      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.start(time);
      osc.stop(time + 0.05);
    } else if (soundType === SoundType.BEEP) {
      osc.type = 'sine';
      osc.frequency.value = isAccent ? 1000 : isSubdivision ? 600 : 800;
      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      osc.start(time);
      osc.stop(time + 0.1);
    } else if (soundType === SoundType.WOODBLOCK) {
      // Synthesized Woodblock
      osc.type = 'sine';
      const frequency = isAccent ? 1200 : isSubdivision ? 600 : 850;
      osc.frequency.setValueAtTime(frequency, time);
      gainNode.gain.setValueAtTime(volume, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.start(time);
      osc.stop(time + 0.08);
    } else {
        // Simple Drum-like thud
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(isAccent ? 150 : 100, time);
        gainNode.gain.setValueAtTime(volume * 1.5, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
    }
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    // Adjust for subdivision
    const secondsPerSubdivision = secondsPerBeat / subdivision;
    nextNoteTimeRef.current += secondsPerSubdivision;

    beatCountRef.current++;
    // Reset beat count at measure end (total subdivisions per measure)
    if (beatCountRef.current >= beatsPerMeasure * subdivision) {
      beatCountRef.current = 0;
    }
  };

  const scheduleNote = (beatNumber: number, time: number) => {
    // Determine accent and UI update
    const isAccent = beatNumber === 0;
    const isMainBeat = beatNumber % subdivision === 0;
    const isSubdivision = !isMainBeat;
    
    // Play sound
    playSound(time, isAccent, isSubdivision);

    // Schedule UI update (approximate via setTimeout to sync with audio time)
    // We calculate delay based on difference between scheduled audio time and current time
    if (!audioContextRef.current) return;
    
    const drawTime = (time - audioContextRef.current.currentTime) * 1000;
    
    setTimeout(() => {
       // We only visualize main beats differently or all subdivisions?
       // Let's pass the raw subdivision index to the UI
       // Normalized beat number for UI (1-based index of the main beat)
       const visualBeat = Math.floor(beatNumber / subdivision);
       const isVisualAccent = isAccent;
       
       if (isMainBeat) {
           onBeat(visualBeat, isVisualAccent);
       }
    }, Math.max(0, drawTime));
  };

  const scheduler = React.useCallback(() => {
    if (!audioContextRef.current) return;

    // While there are notes that will play within this time interval
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(beatCountRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  }, [bpm, subdivision, beatsPerMeasure, soundType, volume]); // Dependencies for scheduler logic

  React.useEffect(() => {
    if (isPlaying) {
      ensureAudioContext();
      if (!audioContextRef.current) return;
      
      // If we are just starting, sync nextNoteTime to now
      if (timerIDRef.current === null) {
          nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.05;
          beatCountRef.current = 0;
      }
      
      scheduler();
    } else {
      if (timerIDRef.current !== null) {
        window.clearTimeout(timerIDRef.current);
        timerIDRef.current = null;
      }
    }

    return () => {
      if (timerIDRef.current !== null) {
        window.clearTimeout(timerIDRef.current);
      }
    };
  }, [isPlaying, scheduler]);

  const start = () => setIsPlaying(true);
  const stop = () => {
      setIsPlaying(false);
      beatCountRef.current = 0; // Reset count on stop
  };
  const toggle = () => (isPlaying ? stop() : start());

  return { isPlaying, start, stop, toggle };
};