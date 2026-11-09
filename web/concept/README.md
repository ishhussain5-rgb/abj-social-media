# ABJ new-standard pages (DEV)

The high-end page design approved on 9 Nov 2026. Every page is one self-contained Tilda T123 block.

## How it works
- `theme.css`: all shared styles, scoped under `#kc`.
- `build.py`: the shared header, full-screen menu, footer, cookie banner, phone quick-contact bar and script.
- `pages/<slug>.html`: one file per page. It starts with a `<!--META {...} -->` line (`nav` = the page's own URL for the active link, `ft` = footer headline) followed by the page sections. `{TILE}`, `{KC}` and `{BOOK}` are replaced at build time.
- Run `python3 build.py` (or `python3 build.py home`). The output goes to `out/<slug>.html`. Paste that into the page's T123 block.

## Living alongside the old site code
- The block starts with a small script that sets `data-abjm-native="abjnew"` and the `abjnew` class on `<html>`. This opts the page out of the old site-wide mobile kit scripts in the Tilda head. CSS hides anything those scripts still inject (`#abjm-header`, `#abjm-menu`, `#abjm-bar`, `#abju`).
- Avoid class names used by the site-wide `custom.css`: `.btn`, `.stars` and others. Buttons here are `.bt`. The footer is a `div`, because `#allrecords .t-rec footer` is hidden site-wide.
- `#t-footer` (the shared Tilda footer) is hidden on these pages because they have their own footer.
- The cookie banner uses the same `abj_cookie_consent` storage key as the old site, so a visitor's choice carries over between pages.

## Tilda status
| Page | Page ID | New block | Old blocks |
|---|---|---|---|
| Homepage DEV `/home-dev-r7m3k` | 350369803 | rec5643988903 | 5 old blocks turned off (kept, not deleted) |
| Kitchens DEV `/bespoke-kitchens-dev-k7q2` | 352648603 | rec5644015603 | 5 old blocks turned off (kept, not deleted) |

To roll back a page: turn the old blocks back on (power icon), turn the new block off, then publish that one page.
