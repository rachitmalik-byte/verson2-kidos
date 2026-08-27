// ─── High-Fidelity Procedural Web Audio Sound Synthesizer ───
// Rich harmonics, acoustic chime overtones, full dynamic range, zero latency!
import { useAudioStore } from '@/stores/audioStore';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private isMuted(): boolean {
    try {
      return useAudioStore.getState().isSfxMuted;
    } catch {
      return false;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || this.isMuted()) return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Crisp, delightful bubble pop
  pop() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Realistic water spray / splash
  splash() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      // 1. Tonal water droplet
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      oscGain.gain.setValueAtTime(0.5, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.18);

      // 2. White noise mist spray
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(1.2, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      whiteNoise.start(now);
    } catch {}
  }

  // Rich bell chime success fanfare (C5-E5-G5-C6)
  success() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C major chord

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const overtone = ctx.createOscillator();
        const gain = ctx.createGain();

        const t = now + i * 0.07;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        // Soft bell shimmer overtone
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.45, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        overtone.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t);
        overtone.start(t);
        osc.stop(t + 0.5);
        overtone.stop(t + 0.5);
      });
    } catch {}
  }

  // Grand victory celebration fanfare with major chords
  fanfare() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      const melody = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.45 }, // C6
      ];

      let t = now;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        sub.type = 'sine';
        sub.frequency.setValueAtTime(note.f * 0.5, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.55, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        sub.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t);
        sub.start(t);
        osc.stop(t + note.d);
        sub.stop(t + note.d);

        t += note.d * 0.85;
      });
    } catch {}
  }

  // Gentle, warm encouragement boing
  boing() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  // Magical star sparkle chimes
  sparkle() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;
      const freqs = [1046.5, 1318.5, 1567.98, 2093.0]; // High C6, E6, G6, C7

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {}
  }

  // Tension snap sound for breaking fibers / threads
  tensionSnap() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      // 1. High-frequency snap click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.06);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.07);

      // 2. Thump impact
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(180, now + 0.01);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      subGain.gain.setValueAtTime(0.7, now + 0.01);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      sub.connect(subGain);
      subGain.connect(this.masterGain);
      sub.start(now + 0.01);
      sub.stop(now + 0.15);
    } catch {}
  }

  // Flame burner ignition & whoosh
  flameIgnite() {
    if (this.isMuted()) return;
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.3);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
    } catch {}
  }
}

export const sounds = new SoundEngine();
