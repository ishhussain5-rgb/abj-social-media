import asyncio,base64,subprocess,sys,json,os
from specs import SPECS
from playwright.async_api import async_playwright
SRC='../src/';XF=0.4;ENDD=2.6
F="/tmp/claude-0/-home-claude/b536475e-949b-5856-b29f-57500cc39d09/scratchpad/fonts/node_modules/@fontsource"
def b(p): return base64.b64encode(open(p,'rb').read()).decode()
logo=b('/home/claude/abj-social-media/assets/abj-logo-roundel-web-512.png')
css=f"""@font-face{{font-family:CG;font-weight:500;src:url(data:font/woff2;base64,{b(F+'/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')})}}
@font-face{{font-family:CG;font-weight:500;font-style:italic;src:url(data:font/woff2;base64,{b(F+'/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')})}}
@font-face{{font-family:DM;font-weight:500;src:url(data:font/woff2;base64,{b(F+'/dm-sans/files/dm-sans-latin-500-normal.woff2')})}}
html,body{{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}}
.lab{{position:absolute;left:70px;right:60px;bottom:470px;display:flex;align-items:flex-end;gap:26px;filter:drop-shadow(0 4px 22px rgba(0,0,0,.75))}}
.num{{font:500 190px/0.8 CG;color:#C9A96E}}
.tx{{padding-bottom:10px}}
.k{{font:500 26px DM;letter-spacing:.32em;color:#C9A96E;text-transform:uppercase;margin-bottom:12px}}
.n{{font:500 66px/1.02 CG;color:#F3EEE6;max-width:660px}}
.sh{{position:absolute;left:0;right:0;bottom:0;height:900px;background:linear-gradient(to top,rgba(8,16,15,.78),rgba(8,16,15,0))}}
.hook{{position:absolute;left:50px;right:50px;top:250px;text-align:center;filter:drop-shadow(0 4px 26px rgba(0,0,0,.8))}}
.hook .a{{font:500 var(--fs) / 1 CG;color:#F3EEE6}} .hook .b{{font:italic 500 var(--fs) / 1.05 CG;color:#9FD3AE}}
.st{{position:absolute;left:0;right:0;top:0;height:760px;background:linear-gradient(to bottom,rgba(8,16,15,.72),rgba(8,16,15,0))}}
.end{{position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,#16302C,#0E1B1A 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;padding-bottom:160px}}
.end img{{width:300px;border-radius:50%;background:#fff}}
.end .k{{font-size:30px}} .end .h{{font:500 88px/1.05 CG;color:#F3EEE6;text-align:center}} .end .h i{{color:#9FD3AE}}
.end .s{{font:500 34px DM;color:#F3EEE6;opacity:.9}}"""
async def overlays(name,sp):
    os.makedirs(f'ov/{name}',exist_ok=True);n=len(sp['shots']);pages={}
    for i,(_,_,_,t) in enumerate(sp['shots']):
        hk=''
        if i==0:
            a,bb=sp['hook'];fs=104 if max(len(a),len(bb))<=20 else 88
            hk=f'<div class="st"></div><div class="hook" style="--fs:{fs}px"><div class="a">{a}</div><div class="b">{bb}</div></div>'
        pages[f'lab{i}']=hk+f'<div class="sh"></div><div class="lab"><div class="num">{i+1:02d}</div><div class="tx"><div class="k">{sp["kick"]} {i+1:02d} / {n:02d}</div><div class="n">{t}</div></div></div>'
    pages['end']=f'<div class="end"><img src="data:image/png;base64,{logo}"><div class="k">ABJ Kitchens &amp; Bedrooms</div><div class="h">Made to measure<br><i>in Peterborough.</i></div><div class="s">Book your free design visit</div></div>'
    async with async_playwright() as p:
        br=await p.chromium.launch(); pg=await br.new_page(viewport={'width':1080,'height':1920})
        for k,h in pages.items():
            await pg.set_content(f"<style>{css}</style>{h}"); await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(120)
            await pg.screenshot(path=f"ov/{name}/{k}.png",omit_background=(k!='end'))
        await br.close()
def fps_of(s):
    r=subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=r_frame_rate','-of','csv=p=0',SRC+s+'.mp4']).decode().strip().split('/')
    return float(r[0])/float(r[1]) if len(r)>1 else float(r[0])
def run(a): subprocess.run(a,check=True)
def build(name):
    sp=SPECS[name];asyncio.run(overlays(name,sp));os.makedirs(f'seg/{name}',exist_ok=True)
    durs=[]
    for i,(s,st,d,t) in enumerate(sp['shots']):
        f=fps_of(s);spd=0.72 if f>=49 else 0.85;D=round(d/spd,3);durs.append(D)
        interp='' if f>=49 else 'minterpolate=fps=30:mi_mode=blend,'
        fc=(f"[0:v]setpts=PTS/{spd},{interp}fps=30,scale=1080:1920:flags=lanczos,setsar=1,format=yuv420p[v];"
            f"[1:v]format=rgba,fade=in:st=0.3:d=0.4:alpha=1,fade=out:st={D-0.8:.3f}:d=0.4:alpha=1[l];[v][l]overlay=0:0:format=auto,format=yuv420p[o]")
        run(['ffmpeg','-y','-loglevel','error','-ss',f'{st}','-t',f'{d}','-i',SRC+s+'.mp4','-loop','1','-framerate','30','-t',f'{D}','-i',f'ov/{name}/lab{i}.png','-filter_complex',fc,'-map','[o]','-t',f'{D}','-r','30','-c:v','libx264','-preset','medium','-crf','12','-an',f'seg/{name}/{i}.mp4'])
    run(['ffmpeg','-y','-loglevel','error','-loop','1','-framerate','30','-t',f'{ENDD}','-i',f'ov/{name}/end.png','-vf','format=yuv420p','-r','30','-c:v','libx264','-crf','12',f'seg/{name}/end.mp4'])
    ins=[];
    for i in range(len(durs)): ins+=['-i',f'seg/{name}/{i}.mp4']
    ins+=['-i',f'seg/{name}/end.mp4']
    fc='';prev='[0:v]';off=0;starts=[0]
    alld=durs+[ENDD]
    for i in range(1,len(alld)):
        off=off+alld[i-1]-XF;starts.append(round(off,2))
        fc+=f"{prev}[{i}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{i}];";prev=f'[x{i}]'
    total=off+ENDD
    fc+=f"{prev}fade=out:st={total-0.35:.3f}:d=0.35,format=yuv420p[out]"
    run(['ffmpeg','-y','-loglevel','error']+ins+['-filter_complex',fc,'-map','[out]','-r','30','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',f'out/abj-{name}-film-master.mp4'])
    run(['ffmpeg','-y','-loglevel','error','-i',f'out/abj-{name}-film-master.mp4','-an','-c:v','libx264','-preset','slow','-crf','25','-maxrate','3200k','-bufsize','6400k','-pix_fmt','yuv420p','-movflags','+faststart',f'out/abj-{name}-film.mp4'])
    run(['ffmpeg','-y','-loglevel','error','-ss','1.6','-i',f'out/abj-{name}-film-master.mp4','-frames:v','1','-q:v','80',f'out/abj-{name}-film-poster.webp'])
    run(['ffmpeg','-y','-loglevel','error','-ss','1.6','-i',f'out/abj-{name}-film-master.mp4','-frames:v','1','-q:v','3',f'out/abj-{name}-film-poster.jpg'])
    meta=dict(name=name,total=round(total,2),starts=starts[:-1],labels=[x[3] for x in sp['shots']],hook=sp['hook'])
    json.dump(meta,open(f'out/{name}.json','w'));print(meta, os.path.getsize(f'out/abj-{name}-film.mp4')//1024,'kB')
os.makedirs('out',exist_ok=True)
for n in sys.argv[1:]: build(n)
