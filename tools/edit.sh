#!/bin/bash
# usage: edit.sh <id> <end:true|false>
set -e
D=$(cd "$(dirname "$0")" && pwd)
id=$1; end=$2
in="$D/src/$id.mp4"; out="$D/out/abj_tt_$id.mp4"; mkdir -p "$D/out"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
es=$(python3 -c "print(max(0,$dur-2.8))")
grade="eq=contrast=1.05:saturation=1.06:gamma=0.98,unsharp=5:5:0.4"
hook="[1:v]format=rgba,fade=t=in:st=0.15:d=0.35:alpha=1,fade=t=out:st=2.9:d=0.5:alpha=1[h]"
if [ "$end" = "true" ]; then
  fc="[0:v]scale=1080:1920,setsar=1,$grade[b];$hook;[2:v]format=rgba,fade=t=in:st=$es:d=0.45:alpha=1[e];[b][h]overlay=0:0:enable='lt(t,3.5)'[x];[x][e]overlay=0:0:enable='gte(t,$es)'[v]"
  extra=(-loop 1 -t "$dur" -i "$D/ov/end.png")
else
  fc="[0:v]scale=1080:1920,setsar=1,$grade[b];$hook;[b][h]overlay=0:0:enable='lt(t,3.5)'[v]"
  extra=()
fi
ffmpeg -nostdin -v error -y -i "$in" -loop 1 -t "$dur" -i "$D/ov/hook_$id.png" "${extra[@]}" \
  -filter_complex "$fc" -map "[v]" -map 0:a? -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
  -r 30 -c:a aac -b:a 160k -movflags +faststart -t "$dur" "$out"
echo "done $id $(du -h "$out" | cut -f1)"
