"""Generate new ABJ TikTok videos: fast-cut raw-clip edits (g*) and photo tours (p*). usage: gen.py <id>"""
import json, os, subprocess, sys
R = os.path.dirname(os.path.abspath(__file__))
BASE = '/mnt/user-data/uploads/ABJ/Content/'
RAW = json.load(open(os.path.join(R, 'raw.json')))
POOL = json.load(open(os.path.join(R, 'pool.json')))
IDX = {l.split()[0]: float(l.split()[1]) for l in open(os.path.join(R, 'rawsh/idx.txt'))}
GRADE = "eq=contrast=1.06:saturation=1.08:gamma=0.98,unsharp=5:5:0.45"
G = {  # raw clip numbers (1-based as on contact sheet), seconds per cut
 'g1_navy15': ([4, 9, 5, 26, 27, 28, 29, 25, 1], 1.5, (1, 112, 0)),
 'g2_led': ([13, 12, 31, 32, 34, 33], 2.1, (2, 96, 2)),
 'g3_bath': ([16, 17, 18, 21, 10, 24], 2.2, (3, 90, -3)),
 'g4_drawers': ([2, 11, 14, 15, 20, 35], 2.0, (4, 100, 5)),
 'g5_wardrobes': ([6, 7, 8, 22, 23, 19, 30], 1.8, (5, 108, -2)),
 'g6_house': ([4, 27, 13, 18, 23, 20, 10, 5], 1.6, (6, 116, 3)),
}
P = {  # pool photo indices
 'p1_dark_kitchen': ([50, 51, 53, 55, 57, 58], (7, 92, 0)),
 'p2_oak_wall': ([84, 85, 87, 88, 89, 91], (8, 98, -5)),
 'p3_loft': ([0, 1, 3, 5, 7, 10], (9, 104, 2)),
 'p4_open_plan': ([45, 46, 47, 48, 49, 26], (10, 96, -1)),
 'p5_office': ([67, 68, 69, 70, 71, 79], (11, 100, 4)),
 'p6_dining': ([59, 60, 61, 62, 54, 56], (12, 94, -4)),
}
vid = sys.argv[1]; out = os.path.join(R, 'out', f'abj_tt_{vid}.mp4'); os.makedirs(os.path.join(R, 'out'), exist_ok=True)
hook = os.path.join(R, 'ov', f'hook_{vid}.png'); end = os.path.join(R, 'ov', 'end.png')
inputs, fc = [], []
if vid in G:
    clips, d, mus = G[vid]
    durs = [d] * (len(clips) - 1) + [3.4]
    for k, (c, dd) in enumerate(zip(clips, durs)):
        cd = IDX[f'{c:02d}']; ss = max(0.2, min(1.0, cd - dd - 0.1)); dd = min(dd, cd - ss)
        durs[k] = dd
        inputs += ['-ss', f'{ss:.2f}', '-t', f'{dd:.2f}', '-i', BASE + RAW[c - 1]]
        z = 1.06 if k % 2 == 0 else 1.0  # alternate slight punch-in for energy
        fc.append(f"[{k}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,"
                  f"scale=iw*{z}:-2,crop=1080:1920,setsar=1,{GRADE},trim=duration={dd:.2f},setpts=PTS-STARTPTS[v{k}]")
    fc.append(''.join(f'[v{k}]' for k in range(len(clips))) + f'concat=n={len(clips)}:v=1:a=0[base]')
    total = sum(durs)
else:
    photos, mus = P[vid]
    pd, xf, last = 2.6, 0.4, 3.8
    durs = [pd] * (len(photos) - 1) + [last]
    for k, (i, dd) in enumerate(zip(photos, durs)):
        inputs += ['-loop', '1', '-t', f'{dd:.2f}', '-i', BASE + POOL[i]]
        fr = int(dd * 30)
        zin = k % 2 == 0
        zexpr = f"1+0.10*on/{fr}" if zin else f"1.10-0.10*on/{fr}"
        fc.append(f"[{k}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,setsar=1,"
                  f"zoompan=z='{zexpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps=30,{GRADE},format=yuv420p[v{k}]")
    prev, off = 'v0', durs[0] - xf
    for k in range(1, len(photos)):
        fc.append(f"[{prev}][v{k}]xfade=transition=fade:duration={xf}:offset={off:.2f}[x{k}]")
        prev = f'x{k}'; off += durs[k] - xf
    fc.append(f'[{prev}]null[base]')
    total = sum(durs) - xf * (len(photos) - 1)
n = len(inputs) // (4 if vid in G else 6) if False else None
ni = sum(1 for a in inputs if a == '-i')
wav = os.path.join(R, 'ff', f'mus_{vid}.wav'); os.makedirs(os.path.dirname(wav), exist_ok=True)
subprocess.run(['python3', os.path.join(R, 'music.py'), str(mus[0]), str(mus[1]), str(mus[2]), f'{total:.2f}', wav], check=True, stdout=subprocess.DEVNULL)
es = max(0, total - 2.8)
inputs += ['-loop', '1', '-t', f'{total:.2f}', '-i', hook, '-loop', '1', '-t', f'{total:.2f}', '-i', end, '-i', wav]
fc.append(f"[{ni}:v]format=rgba,fade=t=in:st=0.15:d=0.35:alpha=1,fade=t=out:st=2.9:d=0.5:alpha=1[h]")
fc.append(f"[{ni+1}:v]format=rgba,fade=t=in:st={es:.2f}:d=0.45:alpha=1[e]")
fc.append(f"[base][h]overlay=0:0:enable='lt(t,3.5)'[b2];[b2][e]overlay=0:0:enable='gte(t,{es:.2f})'[v]")
fc.append(f"[{ni+2}:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]")
cmd = ['ffmpeg', '-nostdin', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[a]',
       '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '160k', '-ar', '44100',
       '-movflags', '+faststart', '-t', f'{total:.2f}', out]
subprocess.run(cmd, check=True)
print('done', vid, f'{total:.1f}s', f'{os.path.getsize(out)/1e6:.1f}MB')
