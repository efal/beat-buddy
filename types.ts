export interface MetronomeState {
  bpm: number;
  isPlaying: boolean;
  beatsPerMeasure: number;
  noteValue: number; // 4 for quarter note, 8 for eighth
  subdivision: number; // 1 = quarter, 2 = eighths, 3 = triplets, 4 = sixteenths
}

export enum SoundType {
  CLICK = 'click',
  WOODBLOCK = 'woodblock',
  BEEP = 'beep',
  DRUM = 'drum'
}

export interface TimeSignatureOption {
  numerator: number;
  denominator: number;
  label: string;
}