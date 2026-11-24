"""Original smooth-jazz bed: Rhodes-style FM electric piano, smooth bass, brushes + swung ride, vibraphone melody."""
import numpy as np, wave, sys
OUT, BPM, SECS, SEED = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4])
SR=44100; N=int(SR*SECS); rng=np.random.default_rng(SEED); beat=60/BPM; bar=4*beat; SW=0.62  # swing ratio
f=lambda m:440*2**((m-69)/12)
L=np.zeros(N); R=np.zeros(N)
def add(sig,t0,pan=0.0,g=1.0):
    s0=int(t0*SR)
    if s0>=N or s0<0: return
    e=min(N,s0+len(sig)); seg=sig[:e-s0]*g
    L[s0:e]+=seg*np.sqrt(0.5*(1-pan)); R[s0:e]+=seg*np.sqrt(0.5*(1+pan))
def rhodes(m,dur,v=1.0):
    l=int(dur*SR); t=np.arange(l)/SR; fc=f(m)
    I=2.2*np.exp(-t*5.0)+0.25                      # modulation index decays: bark then mellow
    s=np.sin(2*np.pi*fc*t+I*np.sin(2*np.pi*fc*t))
    s+=0.18*np.sin(2*np.pi*fc*14*t)*np.exp(-t*30)  # tine ping
    env=np.minimum(1,t/.003)*np.exp(-t*1.1); rel=int(.08*SR); env[-rel:]*=np.linspace(1,0,rel)
    return s*env*v*0.055
def vibes(m,dur,v=1.0):
    l=int(dur*SR); t=np.arange(l)/SR; fc=f(m)
    s=np.sin(2*np.pi*fc*t)+0.25*np.sin(2*np.pi*fc*4*t)*np.exp(-t*8)+0.1*np.sin(2*np.pi*fc*9.9*t)*np.exp(-t*20)
    trem=1+0.22*np.sin(2*np.pi*5.5*t); env=np.minimum(1,t/.002)*np.exp(-t*1.6); rel=int(.06*SR); env[-rel:]*=np.linspace(1,0,rel)
    return s*env*trem*v*0.05
def bass(m,dur,v=1.0):
    l=int(dur*SR); t=np.arange(l)/SR; fc=f(m)
    s=np.sin(2*np.pi*fc*t)+0.35*np.sin(4*np.pi*fc*t)*np.exp(-t*6)+0.12*np.sin(6*np.pi*fc*t)*np.exp(-t*10)
    env=np.minimum(1,t/.01)*np.exp(-t*1.4); rel=int(.05*SR); env[-rel:]*=np.linspace(1,0,rel)
    return s*env*v*0.20
def ride(v=1.0):
    l=int(.9*SR); t=np.arange(l)/SR; s=sum(np.sin(2*np.pi*fr*t) for fr in (3150,4227,5013,6390,7533))/5
    n=rng.standard_normal(l); n=n-np.convolve(n,np.ones(4)/4,'same')
    return (s*0.6+n*0.25)*np.exp(-t*4.5)*np.minimum(1,t/.001)*v*0.035
def brush(dur,v=1.0):
    l=int(dur*SR); t=np.arange(l)/SR; n=rng.standard_normal(l); n=np.convolve(n,np.ones(3)/3,'same')
    env=np.sin(np.pi*np.minimum(1,t/dur))**1.5; return n*env*v*0.022
def kick(v=1.0):
    l=int(.3*SR); t=np.arange(l)/SR; return np.sin(2*np.pi*(52*t+5*(1-np.exp(-t*25))))*np.exp(-t*10)*v*0.16
# Ebmaj9 | Cm9 | Fm9 | Bb13  (smooth ii-V flavour), voicings for electric piano (rootless)
prog=[(63,[55,58,62,65,70]),(60,[58,63,65,67,70]),(53,[56,60,63,67,68]),(58,[56,60,62,67,69])]
mel=[[79,77,75,74],[75,74,72,70],[72,75,77,79],[77,74,72,74]]   # vibes motif per bar (notes)
melr=[[0,1.5,2,3],[0.5,1.5,2.5,3],[0,1,2.5,3],[0,1.5,2,3.5]]
def sw(pos):  # swing 8ths
    b=int(pos); fr=pos-b; return b+(SW if abs(fr-.5)<1e-6 else fr)
nb=int(np.ceil(SECS/bar))+1
for b in range(nb):
    t0=b*bar; root,ch=prog[b%4]
    # electric piano comping: on 1 and the "and of 2" (anticipation), soft
    for pos,v,d in ((0,0.9,1.6*beat),(sw(2.5),0.7,1.2*beat)):
        for j,m in enumerate(ch): add(rhodes(m,d,v*(1-j*0.05)),t0+pos*beat+j*0.008,(j-2)*0.12)
    # bass: root - fifth - approach, smooth
    bl=[(0,root-24,1.3),(2,root-24+7,0.9),(3,root-24+(5 if b%4!=3 else 1),0.8)]
    nxt=prog[(b+1)%4][0]-24
    bl=[(0,root-24,1.4*beat),(1.5,root-24+12,0.45*beat),(2,root-24+7,1.0*beat),(3,root-24+10,0.6*beat),(3.5,nxt+1 if nxt+1!=root-24 else nxt-1,0.45*beat)]
    if b>=1 or True:
        for pos,m,d in bl: add(bass(m,d+0.05),t0+sw(pos)*beat,-0.05,0.9 if b>0 else 0.5)
    if b>=1:
        for q in range(4):
            add(ride(0.9 if q%2 else 0.7),t0+q*beat,0.35)
            if q%2==1: add(ride(0.55),t0+(q+SW)*beat,0.35)
            if q%2==1: add(brush(.32,1.0),t0+q*beat-0.05,-0.25)
            else: add(brush(.5,0.45),t0+q*beat,-0.25)
        add(kick(0.8),t0); add(kick(0.5),t0+sw(2.5)*beat)
    if b>=2:
        for m,pos in zip(mel[b%4],melr[b%4]): add(vibes(m,1.8,0.9),t0+sw(pos)*beat,0.25)
# room: short multi-tap reverb
def verb(x,taps=((1453,.5),(1789,.45),(2203,.4),(2851,.33),(3617,.27),(4421,.2))):
    y=x.copy()
    for d,g in taps:
        for k in range(1,6):
            s=d*k
            if s>=len(x): break
            y[s:]+=x[:-s]*(g**k)*0.22
    return y
L2,R2=verb(L),verb(R,((1531,.5),(1873,.45),(2297,.4),(2953,.33),(3701,.27),(4517,.2)))
fi=int(.3*SR); fo=int(2.4*SR)
for c in (L2,R2): c[:fi]*=np.linspace(0,1,fi); c[-fo:]*=np.linspace(1,0,fo)
m=max(np.abs(L2).max(),np.abs(R2).max()); L2/=m*1.12; R2/=m*1.12
d=(np.stack([L2,R2],1)*32767).astype('<i2'); w=wave.open(OUT,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes()); w.close(); print('ok',OUT)
