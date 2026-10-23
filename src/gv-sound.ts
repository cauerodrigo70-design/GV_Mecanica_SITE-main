// Sound engine for the GV intro animation — all sounds are synthesized in-browser,
// no external audio files needed.

type SoundFn = (c: AudioContext, out: GainNode, t: number, ...params: number[]) => void;

function noise(c: AudioContext): AudioBufferSourceNode {
  const len = c.sampleRate * 2;
  if (!(c as any)._gvNoise) {
    const b = c.createBuffer(1, len, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    (c as any)._gvNoise = b;
  }
  const s = c.createBufferSource();
  s.buffer = (c as any)._gvNoise;
  s.loop = true;
  return s;
}

const fx: Record<string, SoundFn> = {
  whoosh(c, out, t, dur, f0, f1, vol) {
    const n = noise(c), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.Q.value = 0.7;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(out);
    n.start(t); n.stop(t + dur + 0.05);
  },
  tick(c, out, t, p, vol) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(1500 * p, t); o.frequency.exponentialRampToValueAtTime(900 * p, t + 0.06);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.1);
    const n = noise(c), f = c.createBiquadFilter(), ng = c.createGain();
    f.type = 'highpass'; f.frequency.value = 3000;
    ng.gain.setValueAtTime(vol * 0.25, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    n.connect(f); f.connect(ng); ng.connect(out); n.start(t); n.stop(t + 0.03);
  },
  thump(c, out, t, vol) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.28);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.45);
  },
  chime(c, out, t, vol) {
    [[659, 1], [988, 0.5]].forEach(([freq, amp]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol * amp, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.95);
    });
  },
  engine(c, out, t0, tIn, tOut, t1) {
    const tMid = (tIn + tOut) / 2;
    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.linearRampToValueAtTime(0.25, tIn);
    amp.gain.linearRampToValueAtTime(0.7, tMid);
    amp.gain.linearRampToValueAtTime(0.25, tOut);
    amp.gain.linearRampToValueAtTime(0.0001, t1);

    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.7;
    lp.frequency.setValueAtTime(130, t0);
    lp.frequency.linearRampToValueAtTime(380, tMid);
    lp.frequency.linearRampToValueAtTime(180, t1);

    const base = c.createGain(); base.gain.value = 0.6;
    const chug = c.createGain(); chug.gain.value = 0.3;
    const lfo = c.createOscillator(); lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6, t0);
    lfo.frequency.linearRampToValueAtTime(12, tMid);
    lfo.frequency.linearRampToValueAtTime(9, t1);
    lfo.connect(chug); chug.connect(base.gain);

    [[1, 'sawtooth', 0.45], [0.5, 'sine', 0.9], [2, 'triangle', 0.12]].forEach(([mult, type, vol]) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = type as OscillatorType; g.gain.value = vol as number;
      o.frequency.setValueAtTime(38 * (mult as number), t0);
      o.frequency.linearRampToValueAtTime(62 * (mult as number), tMid);
      o.frequency.linearRampToValueAtTime(52 * (mult as number), t1);
      o.connect(g); g.connect(base); o.start(t0); o.stop(t1 + 0.1);
    });

    const n = noise(c), nf = c.createBiquadFilter(), ng = c.createGain();
    nf.type = 'bandpass'; nf.frequency.value = 110; nf.Q.value = 0.8; ng.gain.value = 0.15;
    n.connect(nf); nf.connect(ng); ng.connect(base); n.start(t0); n.stop(t1 + 0.1);

    base.connect(lp); lp.connect(amp);
    if (c.createStereoPanner) {
      const pan = c.createStereoPanner();
      pan.pan.setValueAtTime(-0.8, t0);
      pan.pan.setValueAtTime(-0.8, tIn);
      pan.pan.linearRampToValueAtTime(0.8, tOut);
      amp.connect(pan); pan.connect(out);
    } else { amp.connect(out); }
    lfo.start(t0); lfo.stop(t1 + 0.1);
  },
  horn(c, out, t) {
    const g = c.createGain(), lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1000;
    g.gain.setValueAtTime(0.0001, t);
    [0, 0.34].forEach((off) => {
      g.gain.setValueAtTime(0.0001, t + off);
      g.gain.linearRampToValueAtTime(0.14, t + off + 0.03);
      g.gain.setValueAtTime(0.14, t + off + 0.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.29);
    });
    [[311, 'triangle', 1], [392, 'triangle', 1], [622, 'sawtooth', 0.1]].forEach(([freq, type, vol]) => {
      const o = c.createOscillator(), og = c.createGain();
      o.type = type as OscillatorType; og.gain.value = vol as number; o.frequency.value = freq as number;
      o.connect(og); og.connect(lp); o.start(t); o.stop(t + 0.75);
    });
    lp.connect(g); g.connect(out);
  },
};

export interface SoundController {
  fx: typeof fx;
  init(): void;
  newBus(): void;
  running(): boolean;
  play(fn: SoundFn): void;
  fadeOut(): void;
  resume(): Promise<void>;
  setMuted(m: boolean): void;
  isMuted(): boolean;
  available(): boolean;
  onState(cb: () => void): void;
}

export function createSound(volume: number): SoundController {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let bus: GainNode | null = null;
  let muted = false;

  function init() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : volume;
      master.connect(ctx.destination);
    } catch { ctx = null; }
  }

  function newBus() {
    if (ctx && master) { bus = ctx.createGain(); bus.connect(master); }
  }

  function running() { return !!ctx && ctx.state === 'running'; }

  function play(fn: SoundFn) {
    if (!running() || !bus || !ctx) return;
    try { fn(ctx, bus, ctx.currentTime + 0.02); } catch { /* noop */ }
  }

  function fadeOut() {
    if (!ctx || !bus) return;
    const b = bus; bus = null;
    try { b.gain.setTargetAtTime(0, ctx.currentTime, 0.05); } catch { /* noop */ }
    setTimeout(() => { try { b.disconnect(); } catch { /* noop */ } }, 700);
  }

  function resume() {
    return ctx && ctx.state !== 'running' ? ctx.resume().catch(() => {}) : Promise.resolve();
  }

  function setMuted(m: boolean) {
    muted = m;
    if (master) master.gain.value = m ? 0 : volume;
  }

  function onState(cb: () => void) {
    if (ctx) ctx.onstatechange = cb;
  }

  return {
    fx, init, newBus, running, play, fadeOut, resume, setMuted,
    isMuted: () => muted,
    available: () => !!ctx,
    onState,
  };
}

export function exitSound(c: AudioContext, out: GainNode, t: number) {
  fx.engine(c, out, t, t + 0.85, t + 1.95, t + 1.95 + 0.9);
  fx.horn(c, out, t + 0.85 - 0.1);
}

interface IntroSoundEntry {
  time: number;
  name: string;
  params: number[];
}

export const introSounds: IntroSoundEntry[] = [
  { time: 150, name: 'whoosh', params: [0.9, 160, 1100, 0.20] },
  { time: 620, name: 'thump', params: [0.5] },
  { time: 850, name: 'whoosh', params: [0.55, 220, 1800, 0.26] },
  { time: 1000, name: 'tick', params: [1.6, 0.14] },
  { time: 1150, name: 'tick', params: [1.6, 0.14] },
  { time: 1300, name: 'tick', params: [1.6, 0.14] },
  { time: 1100, name: 'tick', params: [1.00, 0.28] },
  { time: 1190, name: 'tick', params: [1.15, 0.28] },
  { time: 1290, name: 'tick', params: [0.90, 0.28] },
  { time: 1410, name: 'tick', params: [1.10, 0.28] },
  { time: 1560, name: 'tick', params: [0.95, 0.28] },
  { time: 1740, name: 'tick', params: [1.05, 0.28] },
  { time: 1960, name: 'tick', params: [0.90, 0.28] },
  { time: 2000, name: 'chime', params: [0.12] },
];
