# Copied from the session scratchpad: update R/TT/BASE paths before running.
"""Homepage-style hero clips: few long shots, soft 1.2s dissolves, gently slowed and steadied (no audio).
usage: mkweb2.py name 'src:start:dur,...'   (src = reel id or raw:NN; dur = source seconds)
outputs out2/abj-<name>-wide.mp4 (1920x1080) and out2/abj-<name>-v.mp4 (1080x1350) + posters"""
import os, subprocess, sys, json
R = os.path.dirname(os.path.abspath(__file__)); TT = os.path.join(R, '..', 'tiktok')
RAW = json.load(open(os.path.join(TT, 'raw.json'))); BASE = '/mnt/user-data/uploads/ABJ/Content/'
OUT = os.path.join(R, 'out2'); os.makedirs(OUT, exist_ok=True)
name, spec = sys.argv[1], sys.argv[2]
SLOW = 0.85; XF = 1.2
segs = []
for s in spec.split(','):
    parts = s.split(':'); src, st, du = parts[:3]; y = float(parts[3]) if len(parts) > 3 else 0.45
    path = BASE + RAW[int(src[3:]) - 1] if src.startswith('raw') else os.path.join(TT, 'src', src + '.mp4')
    segs.append((path, float(st), float(du), y))
GRADE = "eq=contrast=1.04:saturation=1.05:gamma=0.99"
for kind, (W, H) in {'wide': (1920, 1080), 'v': (1080, 1350)}.items():
    inputs, fc, lens = [], [], []
    for k, (p, st, du, y) in enumerate(segs):
        inputs += ['-ss', str(st), '-t', str(du), '-i', p]
        out_d = du / SLOW; lens.append(out_d)
        fc.append(f"[{k}:v]fps=30,setpts=(PTS-STARTPTS)/{SLOW},minterpolate=fps=30:mi_mode=blend,deshake=rx=32:ry=32,"
                  f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}:(iw-{W})/2:(ih-{H})*{y},setsar=1,{GRADE},"
                  f"trim=duration={out_d:.3f},setpts=PTS-STARTPTS[v{k}]")
    prev, off = 'v0', lens[0] - XF
    for k in range(1, len(segs)):
        fc.append(f"[{prev}][v{k}]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{k}]"); prev = f'x{k}'; off += lens[k] - XF
    fc.append(f"[{prev}]format=yuv420p[out]")
    out = os.path.join(OUT, f'abj-{name}-{kind}.mp4')
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[out]', '-an', '-r', '30',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24', '-maxrate', '2800k' if kind == 'wide' else '2200k', '-bufsize', '5600k',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], check=True)
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', '0.3', '-i', out, '-frames:v', '1', '-q:v', '78', out.replace('.mp4', '-poster.webp')], check=True)
    d = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip()
    print(f'{os.path.basename(out)} {float(d):.1f}s {os.path.getsize(out)/1e6:.2f}MB', flush=True)
