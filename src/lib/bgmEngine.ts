// ─── High-Fidelity Multi-Genre Procedural BGM Jukebox Engine ───
// 8 Truly Distinct Polyphonic Soundscapes with Custom Harmonic Progressions,
// Synthesizer Timbres (Chiptune, Lo-Fi, Pizzicato, Brass, Ethereal Pads, Marimba),
// Dynamic Rhythm Tracks, and Real-Time TTS Ducking!

export interface BgmTrack {
  id: string;
  name: string;
  emoji: string;
  genre: string;
  description: string;
  bpm: number;
}

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'playful-lab',
    name: 'Playful Science Lab',
    emoji: '🧪',
    genre: 'Acoustic Marimba & Bells',
    description: 'Upbeat, bouncy chime melody in C Major for curious young scientists',
    bpm: 118,
  },
  {
    id: 'rainy-storm',
    name: 'Rainy Storm Adventure',
    emoji: '🌧️',
    genre: 'Lo-Fi Rain & Soft EP',
    description: 'Cozy atmospheric rainfall resonance with warm electric piano chords',
    bpm: 92,
  },
  {
    id: 'mystery-investigation',
    name: 'Detective Pip Inquiry',
    emoji: '🔍',
    genre: 'Pizzicato Mystery Strings',
    description: 'Playful staccato investigation melody in A Minor with suspenseful walking bass',
    bpm: 104,
  },
  {
    id: 'high-energy-sprint',
    name: 'Science Sprint & Match',
    emoji: '⚡',
    genre: '8-Bit Chiptune Arcade',
    description: 'Fast energetic retro arcade pulse with driving square-wave arpeggios',
    bpm: 132,
  },
  {
    id: 'sky-rescue',
    name: 'Sky Rescue Parachute',
    emoji: '🪂',
    genre: 'Heroic Synth Brass',
    description: 'Soaring cinematic adventure progression with grand brass fanfares',
    bpm: 120,
  },
  {
    id: 'carnival-celebration',
    name: 'Carnival of Discoveries',
    emoji: '🎪',
    genre: '3/4 Discovery Waltz',
    description: 'Joyful music-box waltz with lively bouncy accordion-style chords',
    bpm: 126,
  },
  {
    id: 'cosmic-explorer',
    name: 'Cosmic Explorer Space Lab',
    emoji: '🌌',
    genre: 'Ambient Ethereal Space',
    description: 'Gentle dreamy ambient synth pads with sweeping resonance & sub-bass',
    bpm: 82,
  },
  {
    id: 'chill-study',
    name: 'Chill Study Vibes',
    emoji: '🌙',
    genre: 'Jazzy 7th Lo-Fi',
    description: 'Soft relaxing Rhodes major-7th jazz chords for peaceful reading',
    bpm: 78,
  },
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
  private baseVolume = 0.5;
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

  private readonly FREQS: Record<string, number> = {
    // Octave 1 & 2 (Deep Bass)
    C1: 32.7, D1: 36.71, E1: 41.2, F1: 43.65, G1: 49.0, A1: 55.0, B1: 61.74,
    C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.0, A2: 110.0, B2: 123.47,
    // Octave 3 (Mid Bass & Chords)
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    // Octave 4 (Middle Octave)
    C4: 261.63, 'C#4': 277.18, D4: 293.66, 'D#4': 311.13, E4: 329.63, F4: 349.23, 'F#4': 369.99, G4: 392.0, 'G#4': 415.3, A4: 440.0, 'A#4': 466.16, B4: 493.88,
    // Octave 5 (Lead Melodies)
    C5: 523.25, 'C#5': 554.37, D5: 587.33, 'D#5': 622.25, E5: 659.25, F5: 698.46, 'F#5': 739.99, G5: 783.99, 'G#5': 830.61, A5: 880.0, 'A#5': 932.33, B5: 987.77,
    // Octave 6 (Sparkling Bells & Glockenspiel)
    C6: 1046.5, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.0, B6: 1975.53,
  };

  // Generic note synthesizer with custom oscillator type, attack/decay and filter envelope
  private playVoice(
    note: string,
    duration: number,
    vol: number,
    type: OscillatorType = 'sine',
    filterCutoff = 2400,
    filterQ = 1,
    attackTime = 0.02
  ) {
    const freq = this.FREQS[note];
    if (!freq) return;
    const ctx = this.initContext();
    if (!ctx || !this.duckGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterCutoff, now);
      filter.Q.setValueAtTime(filterQ, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + attackTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.duckGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }

  // Percussion snare / hi-hat / kick synthesis for rhythmic tracks
  private playPercussion(type: 'kick' | 'hihat' | 'snare' | 'rain-drop', vol = 0.2) {
    const ctx = this.initContext();
    if (!ctx || !this.duckGain || this.isMuted) return;

    try {
      const now = ctx.currentTime;
      if (type === 'kick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);
        gain.gain.setValueAtTime(vol * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.duckGain);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'hihat') {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, now);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(6000, now);
        gain.gain.setValueAtTime(vol * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.duckGain);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'rain-drop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200 + Math.random() * 800, now);
        gain.gain.setValueAtTime(vol * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(this.duckGain);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {}
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8 DISTINCT PROCEDURAL MUSIC PATTERNS
  // ═══════════════════════════════════════════════════════════════════════════
  private playStep() {
    const s = this.step % 16;
    const bar = Math.floor(s / 4);

    switch (this.currentTrackId) {
      // ─────────────────────────────────────────────────────────────
      // TRACK 1: PLAYFUL SCIENCE LAB (C Major Marimba & Glockenspiel)
      // ─────────────────────────────────────────────────────────────
      case 'playful-lab': {
        const chords = [
          { bass: 'C2', mid: ['E3', 'G3', 'C4'], lead: 'C5' },
          { bass: 'G2', mid: ['D3', 'G3', 'B3'], lead: 'G5' },
          { bass: 'A2', mid: ['C3', 'E3', 'A3'], lead: 'E5' },
          { bass: 'F2', mid: ['C3', 'F3', 'A3'], lead: 'F5' },
        ];
        const cur = chords[bar];
        // Bouncy bass
        if (s % 4 === 0) this.playVoice(cur.bass, 0.45, 0.35, 'triangle', 450, 1, 0.01);
        if (s % 4 === 2) this.playVoice(cur.bass, 0.25, 0.2, 'triangle', 450, 1, 0.01);

        // Marimba arpeggio
        const note = cur.mid[s % 3];
        this.playVoice(note, 0.3, 0.2, 'sine', 1800, 1, 0.01);

        // Glockenspiel melody
        const mel = ['C5', 'E5', 'G5', 'E5', 'G5', 'C6', 'G5', 'E5', 'A5', 'C6', 'G5', 'E5', 'F5', 'E5', 'D5', 'C5'][s];
        if (mel) this.playVoice(mel, 0.35, 0.25, 'sine', 3200, 2, 0.005);
        if (s % 2 === 0) this.playPercussion('hihat', 0.15);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 2: RAINY STORM ADVENTURE (F Major Lo-Fi EP & Rain Drops)
      // ─────────────────────────────────────────────────────────────
      case 'rainy-storm': {
        const chords = [
          { bass: 'F2', pad: ['A3', 'C4', 'E4'] }, // Fmaj7
          { bass: 'D2', pad: ['F3', 'A3', 'C4'] }, // Dmin7
          { bass: 'Bb2', pad: ['D4', 'F4', 'A4'] }, // Bbmaj7
          { bass: 'C2', pad: ['E3', 'G3', 'Bb3'] }, // C7
        ];
        const cur = chords[bar];
        if (s % 4 === 0) {
          this.playVoice(cur.bass, 0.9, 0.3, 'sine', 300, 1, 0.04);
          cur.pad.forEach((p) => this.playVoice(p, 0.8, 0.15, 'triangle', 900, 1, 0.05));
        }
        // Rain drop resonance
        if (s % 2 === 1) this.playPercussion('rain-drop', 0.25);
        // Soft mellow melody
        const mel = ['A4', '', 'C5', '', 'F5', 'E5', 'C5', '', 'D5', '', 'F5', '', 'G5', 'F5', 'E5', ''][s];
        if (mel) this.playVoice(mel, 0.6, 0.22, 'sine', 1200, 1, 0.03);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 3: DETECTIVE PIP INQUIRY (A Minor Pizzicato Mystery)
      // ─────────────────────────────────────────────────────────────
      case 'mystery-investigation': {
        const chords = [
          { bass: 'A2', arp: ['C4', 'E4', 'A4'] },
          { bass: 'F2', arp: ['C4', 'F4', 'A4'] },
          { bass: 'D2', arp: ['F4', 'A4', 'D5'] },
          { bass: 'E2', arp: ['G#4', 'B4', 'E5'] },
        ];
        const cur = chords[bar];
        // Tiptoe staccato walking bass
        if (s % 2 === 0) this.playVoice(cur.bass, 0.15, 0.4, 'triangle', 550, 2, 0.005);

        // Pizzicato plucked strings
        const pNote = cur.arp[s % 3];
        this.playVoice(pNote, 0.18, 0.22, 'sine', 2800, 3, 0.005);

        // Suspenseful mystery melody
        const mel = ['E5', 'G5', 'A5', '', 'B5', 'A5', 'G5', 'E5', 'F5', 'A5', 'D6', '', 'B5', 'G#5', 'E5', ''][s];
        if (mel) this.playVoice(mel, 0.22, 0.3, 'triangle', 3000, 2, 0.005);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 4: SCIENCE SPRINT & MATCH (8-Bit Chiptune Arcade)
      // ─────────────────────────────────────────────────────────────
      case 'high-energy-sprint': {
        const chipBasses = ['C3', 'G2', 'A2', 'F2'];
        const curBass = chipBasses[bar];
        // Driving square bass
        this.playVoice(curBass, 0.1, 0.28, 'square', 700, 2, 0.002);

        // 8-bit fast arpeggio
        const chipArp = ['C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'G5', 'C6'];
        this.playVoice(chipArp[s % 8], 0.08, 0.18, 'square', 2400, 1, 0.002);

        // Kick & hi-hat percussion
        if (s % 4 === 0) this.playPercussion('kick', 0.35);
        if (s % 2 === 1) this.playPercussion('hihat', 0.2);

        // Arcade lead line
        const mel = ['C6', '', 'C6', 'D6', 'E6', '', 'G6', '', 'A6', 'G6', 'E6', 'D6', 'C6', 'D6', 'E6', ''][s];
        if (mel) this.playVoice(mel, 0.14, 0.25, 'sawtooth', 3000, 1, 0.002);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 5: SKY RESCUE PARACHUTE (Heroic Cinematic Brass)
      // ─────────────────────────────────────────────────────────────
      case 'sky-rescue': {
        const chords = [
          { bass: 'G2', pad: ['D4', 'G4', 'B4'] },
          { bass: 'E2', pad: ['B3', 'E4', 'G4'] },
          { bass: 'C2', pad: ['G3', 'C4', 'E4'] },
          { bass: 'D2', pad: ['A3', 'D4', 'F#4'] },
        ];
        const cur = chords[bar];
        if (s % 4 === 0) {
          this.playVoice(cur.bass, 0.8, 0.35, 'sawtooth', 350, 1, 0.03);
          cur.pad.forEach((p) => this.playVoice(p, 0.75, 0.16, 'sawtooth', 1400, 1, 0.04));
        }
        // Majestic brass fanfare
        const mel = ['G4', 'B4', 'D5', 'G5', 'F#5', 'D5', 'B4', '', 'E5', 'G5', 'B5', 'D6', 'C6', 'B5', 'A5', 'G5'][s];
        if (mel) this.playVoice(mel, 0.4, 0.32, 'sawtooth', 2200, 2, 0.02);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 6: CARNIVAL OF DISCOVERIES (3/4 Music Box & Waltz)
      // ─────────────────────────────────────────────────────────────
      case 'carnival-celebration': {
        const chords = [
          { bass: 'C3', chord: ['E4', 'G4', 'C5'] },
          { bass: 'G2', chord: ['D4', 'G4', 'B4'] },
          { bass: 'A2', chord: ['C4', 'E4', 'A4'] },
          { bass: 'F2', chord: ['C4', 'F4', 'A4'] },
        ];
        const cur = chords[bar];
        // Oom (Bass) Pah-Pah (Chords)
        if (s % 4 === 0) {
          this.playVoice(cur.bass, 0.35, 0.4, 'triangle', 450, 1, 0.01);
        } else if (s % 4 === 1 || s % 4 === 2) {
          cur.chord.forEach((c) => this.playVoice(c, 0.2, 0.18, 'sine', 2000, 1, 0.01));
        }
        // Cheerful music box melody
        const mel = ['E5', 'G5', 'C6', 'E6', 'D6', 'B5', 'G5', 'D5', 'C6', 'B5', 'A5', 'E5', 'F5', 'A5', 'D6', 'C6'][s];
        if (mel) this.playVoice(mel, 0.25, 0.28, 'sine', 3500, 2, 0.005);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 7: COSMIC EXPLORER SPACE LAB (Ethereal Ambient Synth)
      // ─────────────────────────────────────────────────────────────
      case 'cosmic-explorer': {
        const spaceChords = [
          { bass: 'D2', pad: ['A3', 'D4', 'F#4', 'C5'] }, // D9
          { bass: 'G2', pad: ['B3', 'D4', 'G4', 'B4'] },  // Gmaj7
          { bass: 'B1', pad: ['F#3', 'B3', 'D4', 'A4'] }, // Bmin7
          { bass: 'A1', pad: ['E3', 'A3', 'C#4', 'G4'] }, // A7sus
        ];
        const cur = spaceChords[bar];
        if (s % 4 === 0) {
          // Deep sub-bass
          this.playVoice(cur.bass, 1.2, 0.35, 'sine', 200, 1, 0.08);
          // Ethereal sweep pad
          cur.pad.forEach((p) => this.playVoice(p, 1.1, 0.12, 'sine', 1600, 2, 0.1));
        }
        // Twinkling star bell
        const mel = ['F#5', '', '', 'A5', 'D6', '', 'C#6', '', 'B5', '', '', 'A5', 'F#5', '', 'E5', ''][s];
        if (mel) this.playVoice(mel, 0.8, 0.25, 'sine', 4000, 2, 0.02);
        break;
      }

      // ─────────────────────────────────────────────────────────────
      // TRACK 8: CHILL STUDY VIBES (Mellow Jazz Maj7 Rhodes Chords)
      // ─────────────────────────────────────────────────────────────
      case 'chill-study': {
        const jazzChords = [
          { bass: 'C2', pad: ['E3', 'G3', 'B3', 'D4'] }, // Cmaj9
          { bass: 'A2', pad: ['C3', 'E3', 'G3', 'B3'] }, // Amin9
          { bass: 'D2', pad: ['F3', 'A3', 'C4', 'E4'] }, // Dmin9
          { bass: 'G2', pad: ['F3', 'A3', 'B3', 'E4'] }, // G13
        ];
        const cur = jazzChords[bar];
        if (s % 4 === 0) {
          this.playVoice(cur.bass, 0.9, 0.3, 'sine', 280, 1, 0.05);
          cur.pad.forEach((p) => this.playVoice(p, 0.85, 0.14, 'triangle', 850, 1, 0.04));
        }
        // Gentle Rhodes improv
        const mel = ['B4', '', 'D5', '', 'G5', '', 'E5', '', 'C5', '', 'E5', '', 'A4', '', 'B4', ''][s];
        if (mel) this.playVoice(mel, 0.5, 0.2, 'sine', 1100, 1, 0.03);
        break;
      }

      default:
        break;
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
    const intervalMs = (60 / track.bpm / 2) * 1000; // Eighth-note rhythmic pulses

    this.timerId = window.setInterval(() => {
      if (this.isPlaying && !this.isMuted) {
        this.playStep();
      }
    }, intervalMs);
  }

  // Alias play to start
  play(trackId?: string) {
    this.start(trackId || this.currentTrackId);
  }

  setTrack(trackId: string) {
    this.currentTrackId = trackId;
    if (this.isPlaying) {
      this.start(trackId);
    }
  }

  getCurrentTrack() {
    return this.currentTrackId;
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

  // Smooth audio ducking when Pip TTS speaks
  duck() {
    if (this.duckGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.duckGain.gain.cancelScheduledValues(now);
      this.duckGain.gain.linearRampToValueAtTime(0.15, now + 0.08);
    }
  }

  unduck() {
    if (this.duckGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.duckGain.gain.cancelScheduledValues(now);
      this.duckGain.gain.linearRampToValueAtTime(1.0, now + 0.25);
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const bgmEngine = new BgmEngine();
