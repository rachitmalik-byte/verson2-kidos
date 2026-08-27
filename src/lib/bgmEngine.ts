// ─── Procedural Multi-Track Background Music (BGM) Engine ───
// 100% Royalty-Free & Uncopyrighted Procedural Web Audio Synthesizer
// Zero external asset loading, zero network latency, full audio ducking when TTS speaks

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
  private baseVolume = 0.35;

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

  // Melodic scale note frequencies in Hz
  private readonly NOTES: Record<string, number> = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
    C6: 1046.5,
  };

  private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.12, attack = 0.02) {
    const ctx = this.initContext();
    if (!ctx || !this.duckGain || this.isMuted) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.duckGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // Multi-Track procedural sequencer step generator
  private tick() {
    const track = BGM_TRACKS.find((t) => t.id === this.currentTrackId) || BGM_TRACKS[0];
    const s = this.step % 16;
    const n = this.NOTES;

    switch (track.id) {
      case 'playful-lab': {
        // Playful C Major Pentatonic Marimba + Soft Chime (C4, D4, E4, G4, A4)
        const melody = [n.C5, 0, n.E5, n.G5, 0, n.A5, n.G5, 0, n.E5, 0, n.D5, n.E5, n.C5, 0, n.G4, 0];
        const bass = [n.C3, 0, 0, 0, n.G3, 0, 0, 0, n.A3, 0, 0, 0, n.F3, 0, n.G3, 0];

        if (melody[s]) this.playTone(melody[s], 'sine', 0.22, 0.09);
        if (bass[s]) this.playTone(bass[s], 'triangle', 0.35, 0.14, 0.05);
        if (s % 4 === 0) this.playTone(n.C4, 'sine', 0.1, 0.04);
        break;
      }

      case 'rainy-storm': {
        // Atmospheric Rain Chords + Droplet Tones
        const rainChords = [n.D4, 0, n.F4, 0, n.A4, 0, n.C5, 0, n.G4, 0, n.Bb4 || n.A4, 0, n.F4, 0, n.D4, 0];
        const bass = [n.D3, 0, 0, 0, n.A3, 0, 0, 0, n.G3, 0, 0, 0, n.D3, 0, 0, 0];

        if (rainChords[s]) this.playTone(rainChords[s], 'sine', 0.45, 0.07, 0.08);
        if (bass[s]) this.playTone(bass[s], 'triangle', 0.6, 0.12, 0.1);
        if (s % 3 === 0) this.playTone(n.E5, 'sine', 0.08, 0.03);
        break;
      }

      case 'mystery-investigation': {
        // Pizzicato curiosity staccato
        const pizz = [n.A4, 0, n.C5, 0, n.E5, n.D5, 0, n.C5, n.B4, 0, n.G4, 0, n.A4, 0, 0, 0];
        if (pizz[s]) this.playTone(pizz[s], 'triangle', 0.12, 0.11);
        if (s % 8 === 0) this.playTone(n.A3, 'sine', 0.4, 0.1);
        break;
      }

      case 'high-energy-sprint': {
        // Arcade 128 BPM pulse
        const lead = [n.E5, n.E5, 0, n.G5, n.A5, 0, n.G5, n.E5, n.D5, n.D5, 0, n.E5, n.G5, 0, n.A5, n.B5];
        const kick = [n.C3, 0, n.C3, 0, n.C3, 0, n.C3, 0, n.A3, 0, n.A3, 0, n.G3, 0, n.G3, 0];

        if (lead[s]) this.playTone(lead[s], 'square', 0.12, 0.05);
        if (kick[s]) this.playTone(kick[s], 'triangle', 0.15, 0.15);
        break;
      }

      case 'sky-rescue': {
        // Epic soaring cinematic brass / flute
        const melody = [n.C5, 0, n.G5, 0, n.A5, 0, n.G5, 0, n.F5, 0, n.E5, 0, n.D5, 0, n.C5, 0];
        const chords = [n.C4, 0, 0, 0, n.E4, 0, 0, 0, n.F4, 0, 0, 0, n.G4, 0, 0, 0];

        if (melody[s]) this.playTone(melody[s], 'sine', 0.35, 0.1, 0.05);
        if (chords[s]) this.playTone(chords[s], 'triangle', 0.5, 0.09, 0.1);
        break;
      }

      case 'carnival-celebration': {
        // Cheerful waltz
        const lead = [n.G5, n.E5, n.C5, n.G5, n.A5, n.F5, n.D5, n.A5, n.B5, n.G5, n.E5, n.B5, n.C6, 0, 0, 0];
        if (lead[s]) this.playTone(lead[s], 'sine', 0.18, 0.08);
        break;
      }

      case 'cosmic-explorer': {
        // Ambient space arpeggiator
        const arp = [n.C4, n.E4, n.G4, n.B4, n.D5, n.B4, n.G4, n.E4, n.A3, n.C4, n.E4, n.G4, n.C5, n.G4, n.E4, n.C4];
        if (arp[s]) this.playTone(arp[s], 'sine', 0.3, 0.06, 0.04);
        break;
      }

      case 'chill-study': {
        // Warm lofi piano chords
        const lofi = [n.F4, 0, n.A4, 0, n.C5, 0, n.E5, 0, n.G4, 0, n.B4, 0, n.D5, 0, 0, 0];
        if (lofi[s]) this.playTone(lofi[s], 'sine', 0.4, 0.07, 0.06);
        break;
      }
    }

    this.step++;
  }

  // Start BGM playback
  start(trackId?: string) {
    if (trackId) this.currentTrackId = trackId;
    if (this.isPlaying) return;

    this.initContext();
    this.isPlaying = true;

    const track = BGM_TRACKS.find((t) => t.id === this.currentTrackId) || BGM_TRACKS[0];
    const intervalMs = (60000 / track.bpm) / 4; // 16th note subdivision

    this.timerId = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  // Stop BGM
  stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Switch Track immediately
  setTrack(trackId: string) {
    this.currentTrackId = trackId;
    if (this.isPlaying) {
      this.stop();
      this.start(trackId);
    }
  }

  // Set Master BGM Volume (0.0 to 1.0)
  setVolume(vol: number) {
    this.baseVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.baseVolume, this.ctx.currentTime);
    }
  }

  // Mute / Unmute BGM
  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.baseVolume, this.ctx.currentTime);
    }
  }

  // Audio Ducking: Smoothly lower BGM volume when Pip is speaking
  duck(isSpeaking: boolean) {
    if (!this.duckGain || !this.ctx) return;
    try {
      const targetGain = isSpeaking ? 0.15 : 1.0; // Reduce to 15% during speech
      this.duckGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.15);
    } catch {}
  }

  getTrackId() {
    return this.currentTrackId;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const bgmEngine = new BgmEngine();
