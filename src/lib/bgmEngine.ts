// ─── High-Fidelity Polyphonic Procedural Background Music Engine ───
// 3-Voice Warm Acoustic Harmony (Sub-Bass + Pad Chord + Sparkling Chime Melody)
// 100% Uncopyrighted Web Audio Synthesizer with crystal clarity & smooth TTS ducking

export interface BgmTrack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bpm: number;
}

export const BGM_TRACKS: BgmTrack[] = [
  { id: 'playful-lab', name: 'Playful Science Lab', emoji: '🧪', description: 'Upbeat, bouncy chime melody for curious young scientists', bpm: 116 },
  { id: 'rainy-storm', name: 'Rainy Storm Adventure', emoji: '🌧️', description: 'Cozy atmospheric rainfall with soft marimba pads', bpm: 95 },
  { id: 'mystery-investigation', name: 'Curious Mystery', emoji: '🔍', description: 'Playful pizzicato exploration & inquiry melody', bpm: 108 },
  { id: 'high-energy-sprint', name: 'Science Sprint & Match', emoji: '⚡', description: 'High-energy arcade pulse for matching challenges', bpm: 128 },
  { id: 'sky-rescue', name: 'Sky Rescue Parachute', emoji: '🪂', description: 'Soaring adventurous cinematic melody', bpm: 120 },
  { id: 'carnival-celebration', name: 'Carnival of Discoveries', emoji: '🎪', description: 'Cheerful celebration waltz for achievements', bpm: 124 },
  { id: 'cosmic-explorer', name: 'Cosmic Explorer', emoji: '🌌', description: 'Gentle ambient synth arp for Guidebook reading', bpm: 88 },
  { id: 'chill-study', name: 'Chill Study Vibes', emoji: '🌙', description: 'Soft relaxing lofi chords for peaceful learning', bpm: 80 },
];

class BgmEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackId = 'playful-lab';
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private timerId: number | null = null;
  private step = 0;
  private isMuted = false;
  private baseVolume = 0.65;
  private wasPlayingBeforeTabSwitch = false;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.isPlaying) {
            this.wasPlayingBeforeTabSwitch = true;
            this.stop();
          }
        } else {
          if (this.wasPlayingBeforeTabSwitch) {
            this.wasPlayingBeforeTabSwitch = false;
            this.start(this.currentTrackId);
          }
        }
      });
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.duckGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.baseVolume, this.ctx.currentTime);
        this.duckGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
        this.duckGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private readonly NOTES: Record<string, number> = {
    C2: 65.41, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0,
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
    C6: 1046.5, E6: 1318.5, G6: 1567.98,
  };

  // Play rich acoustic bell/marimba note with warm filter
  private playAcousticNote(freq: number, duration: number, vol = 0.35, isBass = false) {
    const ctx = this.initContext();
    if (!ctx || !this.duckGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;

      // 1. Primary fundamental oscillator
      const osc = ctx.createOscillator();
      osc.type = isBass ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // 2. Harmonic overtone (adds warm shimmer)
      const overtone = ctx.createOscillator();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(isBass ? freq * 2 : freq * 2, now);

      // 3. Low-pass filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isBass ? 400 : 2600, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      overtone.connect(filter);
      filter.connect(gain);
      gain.connect(this.duckGain);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + duration);
      overtone.stop(now + duration);
    } catch {}
  }

  // ── TRACK PATTERNS (C Major / G Major Happy Progressions) ──
  private playStep() {
    const track = BGM_TRACKS.find((t) => t.id === this.currentTrackId) || BGM_TRACKS[0];
    const s = this.step % 16;
    const bar = Math.floor(s / 4);

    // Chords: Cmaj (C-E-G) -> Gmaj (G-B-D) -> Amin (A-C-E) -> Fmaj (F-A-C)
    const chordRoots = ['C3', 'G2', 'A2', 'F2'];
    const chordTriads = [
      ['C4', 'E4', 'G4'],
      ['B3', 'D4', 'G4'],
      ['C4', 'E4', 'A4'],
      ['C4', 'F4', 'A4'],
    ];

    // 1. Bassline on beat 0 and 2
    if (s % 4 === 0) {
      const rootNote = chordRoots[bar];
      if (this.NOTES[rootNote]) {
        this.playAcousticNote(this.NOTES[rootNote], 0.7, 0.45, true);
      }
    }

    // 2. Mid Warm Arpeggio Pad on every beat
    const triad = chordTriads[bar];
    const padNote = triad[s % 3];
    if (this.NOTES[padNote]) {
      this.playAcousticNote(this.NOTES[padNote], 0.45, 0.28, false);
    }

    // 3. Playful Top Melody (pentatonic glockenspiel)
    const melodySeq: Record<string, string[]> = {
      'playful-lab': ['C5', 'E5', 'G5', 'E5', 'G5', 'C6', 'G5', 'E5', 'A5', 'C6', 'G5', 'E5', 'F5', 'E5', 'D5', 'C5'],
      'rainy-storm': ['G4', 'C5', 'E5', 'D5', 'B4', 'D5', 'G5', 'E5', 'A4', 'C5', 'E5', 'D5', 'F4', 'A4', 'C5', 'B4'],
      'mystery-investigation': ['E5', 'G5', 'B5', 'G5', 'D5', 'F5', 'A5', 'F5', 'C5', 'E5', 'A5', 'E5', 'D5', 'F5', 'B5', 'G5'],
      'high-energy-sprint': ['C5', 'C5', 'G5', 'G5', 'A5', 'A5', 'G5', '', 'F5', 'F5', 'E5', 'E5', 'D5', 'D5', 'C5', ''],
      'cosmic-explorer': ['C5', 'G5', 'E5', 'C6', 'G5', 'B5', 'D6', 'G5', 'A5', 'E6', 'C6', 'A5', 'F5', 'C6', 'A5', 'F5'],
      'chill-study': ['E5', '', 'G5', '', 'D5', '', 'F5', '', 'C5', '', 'E5', '', 'A4', '', 'C5', ''],
    };

    const activeMelody = melodySeq[this.currentTrackId] || melodySeq['playful-lab'];
    const melNote = activeMelody[s];
    if (melNote && this.NOTES[melNote]) {
      this.playAcousticNote(this.NOTES[melNote], 0.35, 0.42, false);
    }

    this.step++;
  }

  start(trackId = 'playful-lab') {
    if (this.isPlaying && this.currentTrackId === trackId) return;

    this.stop();
    this.currentTrackId = trackId;
    this.initContext();
    this.isPlaying = true;
    this.step = 0;

    const track = BGM_TRACKS.find((t) => t.id === trackId) || BGM_TRACKS[0];
    const intervalMs = (60 / track.bpm / 2) * 1000; // Eighth-note pulses

    this.timerId = window.setInterval(() => {
      if (this.isPlaying && !this.isMuted) {
        this.playStep();
      }
    }, intervalMs);
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.baseVolume, this.ctx.currentTime);
    }
    if (muted) {
      this.stop();
    }
  }

  setVolume(vol: number) {
    this.baseVolume = Math.max(0, Math.min(1.0, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.baseVolume, this.ctx.currentTime);
    }
  }

  // Smooth audio ducking when TTS starts speaking
  duck() {
    if (this.duckGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.duckGain.gain.cancelScheduledValues(now);
      this.duckGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
    }
  }

  unduck() {
    if (this.duckGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.duckGain.gain.cancelScheduledValues(now);
      this.duckGain.gain.linearRampToValueAtTime(1.0, now + 0.3);
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const bgmEngine = new BgmEngine();
