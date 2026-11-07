"""Synthesize short original background tracks (warm pad + pluck arp + soft beat). usage: music.py <seed> <bpm> <key_semitone> <seconds> <out.wav>"""
import sys, numpy as np, wave
seed, bpm, key, secs, out = int(sys.argv[1]), float(sys.argv[2]), int(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
rng = np.random.default_rng(seed); SR = 44100; N = int(SR * secs); t = np.arange(N) / SR
f = lambda n: 440 * 2 ** ((n - 69 + key) / 12)
progs = [[(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)],   # Am F C G
         [(48, 52, 55), (55, 59, 62), (57, 60, 64), (53, 57, 60)],   # C G Am F
         [(50, 53, 57), (58, 62, 65), (53, 57, 60), (48, 52, 55)],   # Dm Bb F C
         [(52, 55, 59), (48, 52, 55), (55, 59, 62), (50, 54, 57)]]   # Em C G D
prog = progs[seed % 4]
beat = 60 / bpm; bar = beat * 4

def lp(x, a):  # one-pole low-pass
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a * (x[i] - s); y[i] = s
    return y

pad = np.zeros(N); arp = np.zeros(N); bass = np.zeros(N)
nb = int(np.ceil(secs / bar)) + 1
for b in range(nb):
    ch = prog[b % 4]; s0 = int(b * bar * SR); s1 = min(N, int((b + 1) * bar * SR) + int(.3 * SR))
    if s0 >= N: break
    tt = np.arange(s1 - s0) / SR
    env = np.minimum(1, tt / .35) * np.minimum(1, (s1 - s0 - np.arange(s1 - s0)) / (.3 * SR))
    for n in ch:
        for det in (-0.08, 0.08):
            ph = 2 * np.pi * f(n + det) * tt
            pad[s0:s1] += env * (np.sin(ph) + .3 * np.sin(2 * ph) + .12 * np.sin(3 * ph)) * .08
    bass[s0:s1] += env * np.sin(2 * np.pi * f(ch[0] - 12) * tt) * .22
    # arpeggio 8ths
    notes = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12, ch[2] + 12]
    for k, n in enumerate(notes):
        a0 = s0 + int(k * beat / 2 * SR); L = int(.5 * SR)
        if a0 >= N: break
        a1 = min(N, a0 + L); tt2 = np.arange(a1 - a0) / SR
        arp[a0:a1] += np.exp(-tt2 * 7) * (np.sin(2 * np.pi * f(n) * tt2) + .25 * np.sin(4 * np.pi * f(n) * tt2)) * .10
drums = np.zeros(N)
nbeats = int(secs / beat) + 1
for k in range(nbeats):
    s0 = int(k * beat * SR)
    if s0 >= N: break
    if k >= 4 or seed % 2 == 0:  # kick on every beat (after intro for odd seeds)
        L = min(N - s0, int(.35 * SR)); tt = np.arange(L) / SR
        drums[s0:s0 + L] += np.sin(2 * np.pi * (45 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 9) * .55
    h0 = s0 + int(beat / 2 * SR)  # off-beat hat
    if h0 < N:
        L = min(N - h0, int(.06 * SR)); drums[h0:h0 + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / SR * 60) * .07
    if k % 2 == 1:  # soft clap/snare
        L = min(N - s0, int(.18 * SR)); drums[s0:s0 + L] += lp(rng.standard_normal(L), .35) * np.exp(-np.arange(L) / SR * 22) * .22
pad = lp(pad, .08)
mix = pad + arp + bass + drums
# simple stereo widening via short delay on arp
L = mix + np.roll(arp, int(.011 * SR)) * .3; R = mix + np.roll(arp, int(.017 * SR)) * .3
fade = np.minimum(1, t / .4) * np.minimum(1, (secs - t) / 1.2)
st = np.stack([L * fade, R * fade], 1); st /= np.max(np.abs(st)) / .89
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok', out)
