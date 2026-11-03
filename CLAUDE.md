# ABJ social media: Metricool + GitHub workflow

This repository is the home for ABJ Kitchens & Bedrooms social media scheduling. Read this file first in any new session.
**The repository is PUBLIC.** Only put finished, publishable media and tools here. Never add passwords, tokens or private documents.

## How the pipeline works (laptop not needed)
1. New photos and videos land in Google Drive, in the **ABJ** folder (the team uploads there straight away).
2. Pull source files with the Google Drive connector (`download_file_content`). **Limit: 10 MB per file.**
   - Over 10 MB: wait for the weekly laptop-on session and bring them across through the desktop app bridge (handles about 400 MB per file), then compress here.
3. Edit in the cloud workspace using the scripts in `tools/` (see below).
4. Commit finished files to `media/YYYY-MM/` in this repository and push to `main`.
5. Schedule in Metricool with the public link: `https://raw.githubusercontent.com/ishhussain5-rgb/abj-social-media/main/media/YYYY-MM/<file>`.
   Metricool copies the file to its own storage when the post is created (tested 2 Nov 2026 with a video).
6. Once a month's posts are all scheduled and verified, the month's `media/` folder can be cleared to keep the repo small (GitHub suggests under 1 GB). **Ask the user before deleting anything.**

## Metricool
- Brand blogId `7831148`, timezone `Europe/London`.
- TikTok slots: **10:00 and 18:00 daily** (Metricool best times).
- Provider: `tiktok` ONLY unless the user asks otherwise. The same Metricool brand also holds the ABJ Accessories Instagram (abj_accessories_uk) and Facebook posts. Never touch those.
- TikTok payload: `tiktokData.title` is required. `privacyOption: PUBLIC_TO_EVERYONE`, `isAigc: false`, `photoCoverIndex: 0`. Use `autoAddMusic: true` for photo carousels and `false` for videos (they have their own music). Set `videoCoverMilliseconds: 1200` for videos. See `tools/build.py`.
- A private test draft (uuid 727720750545063683, 20 Dec 2026, SELF_ONLY) exists. The user may delete it.

## Content rules (from the user)
- **Never repost the pinned TikTok videos:** the arched bedroom dressing area (`r03_abj_eye_bedroom`), the hallway arched mirror and glass door, and the slatted marble media wall with fire (`r08_werrington`).
- **Don't reupload anything already on TikTok** (@abjkitchenandbedroomltd). Already there: `r02`, `r09`, `r18`, `r20` and the black marble showroom (treat `r05` and `r13` as risky too).
- **All posts get custom edits:** hook title overlay, colour grade, branded end card, original music; carousels use designed slides ending in a CTA slide.
- **Captions:** UK English, emojis, max 3 hashtags, and this contact block verbatim with emojis:
  ```
  📩 info@abjkitchensandbedrooms.co.uk
  💬 Or message us right here for a free, no-obligation quote
  📞 01733 686767 | WhatsApp 07479 219421
  🌐 https://abjkitchensandbedrooms.co.uk/
  📅 Book a consultation: https://abjkitchensandbedrooms.co.uk/bookingform
  📍 3 Brassey Close, Peterborough, PE1 2AZ
  ```
- Don't schedule or publish anything the user hasn't asked for.
- **Plaky:** log work on the "ABJ Kitchens & Bedrooms" board (Website group, status, date, person Ish Hussain). Batch it weekly; it needs Chrome on the user's laptop.
- User-facing summaries use section headings with ✅ lines.

## Brand style
Dark green `#0E1B1A` / `#16302C`, cream `#F3EEE6`, gold `#C9A96E`, sage italic `#9FD3AE`. Fonts are Cormorant Garamond (headlines) and DM Sans (body), via `npm i @fontsource/cormorant-garamond @fontsource/dm-sans`. The logo roundel is in `assets/`. The gold letter-spaced kicker reads "ABJ KITCHENS & BEDROOMS".

## Tools (`tools/`)
The scripts still contain absolute paths from the session that made them, so update `R`/`BASE`/`FONTS`/`LOGO` paths before running.
- `overlays.py spec.json` renders transparent hook PNGs (`hook_<id>.png`) and `end.png` (Playwright).
- `edit.sh <id> <end:true|false>` takes a finished vertical reel and adds the grade, hook overlay and optional end card (ffmpeg, libx264 veryfast CRF 20).
- `gen.py <id>` generates new videos: quick-cut edits from raw clips (`g*`) and slow-pan photo tours (`p*`) with original music from `music.py`, normalised to -14 LUFS.
- `music.py seed bpm key seconds out.wav` synthesises an original background track.
- `carousels.py` / `carousels2.py` render 1080x1920 carousel slides (cover / photo / letter / textcard / CTA templates).
- `schedule2.py` builds the slot plan and captions; `build.py <slot>` prints the Metricool payload for a slot.

## Records (`records/`)
- `2026-11_tiktok_schedule.json`: all 56 posts for 3–30 Nov 2026 (dates, titles, captions).
- `2026-11_tiktok_calendar.jpg`: visual calendar of the month.
- `used_source_files.txt`: shoot photos and raw clips already used, so later months stay fresh.

## Website (web/)
- `web/service-pages/` holds the DEV service-page layer, served to the site through jsDelivr; its videos live on the `web-media-a`/`web-media-b` branches. See its README. Never clear `web/` or those branches with the monthly media clean-up. Keep `main` under 50 MB (jsDelivr limit).

## Next due
The November batch ends **Mon 30 Nov 2026 18:00**. Plan and schedule the December batch before then, with big Drive videos handled in a laptop-on session.
