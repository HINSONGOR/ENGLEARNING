# HINSON ENG ADVENTURE

A Traditional-Chinese, Harry Potter x Minecraft themed P6 English grammar learning platform. Vanilla HTML/CSS/JS, no frameworks, all state in LocalStorage.

## Deployment — standing authorization

This folder is a git repo connected to `https://github.com/HINSONGOR/ENGLEARNING.git` (branch `main`), deployed via GitHub Pages at `https://hinsongor.github.io/ENGLEARNING/`. The user's desktop shortcut opens that live URL, not local files.

**The user has authorized committing and pushing to this repo automatically, without asking for confirmation each time.** This is a small personal/family project (a handful of known users), so treat `git add -A && git commit && git push origin main` as a routine step after finishing a change here — not an action requiring per-instance sign-off. Still use good judgment: write clear commit messages, don't push obviously broken/untested changes, and mention in your summary that you pushed (so the user always knows what went live) rather than pushing silently.

After pushing, GitHub Pages typically takes 1-2 minutes to rebuild — verify with a cache-busted fetch (`fetch(url + '?cachebust=' + Date.now(), {cache:'no-store'})`) before telling the user a change is live; don't just assume it deployed.

**Browser cache gotcha (hit in production 2026-08-01, revisited 2026-09-12):** GitHub Pages serves `app.js`/`style.css` with `Cache-Control: max-age=600` and no versioning, so a browser that visited within the last 10 minutes can keep running old JS/CSS even though the server already has the new file — a cache-busted `fetch()` check can say "live" while the actual page (loaded via plain `<script src="app.js">`) is still stale. Mitigated by adding a `?v=YYYYMMDDx` query string to the `style.css`/`app.js` `<link>`/`<script>` tags, **and** to the two game iframe `src` URLs (`verb_blaster.html?v=...`, `adj_adv_blaster.html?v=...`) in `index.html` — **bump the relevant version string every time app.js, style.css, verb_blaster.html, or adj_adv_blaster.html changes**, or this regresses.

**This mitigation has a hole: `index.html` itself carries the exact same `Cache-Control: max-age=600` (confirmed via `curl -sI`).** Bumping the `?v=` string inside index.html does nothing for a browser that already has index.html cached from within the last 10 minutes — it never even fetches the new HTML to see the new asset URLs. GitHub Pages gives no way to set custom response headers (no `_headers` file support like Netlify/Vercel), so there is no server-side fix available. **The only reliable fix on the user's end is a genuine hard refresh (Ctrl+Shift+R / Ctrl+F5), not just reopening the tab or clicking the desktop shortcut again** — always tell them this explicitly when confirming a deploy, right after (or instead of) the cache-busted `fetch()` check, since that check only proves the origin server is updated, not that any given browser will see it within the next 10 minutes.

## Sibling projects (same GitHub account, same pattern)

- `C:\HinsonChineseLearning` → `github.com/HINSONGOR/HinsonChineseLearning` → `hinsongor.github.io/HinsonChineseLearning/`
- Math platform → `hinsongor.github.io/MATHS/` (local repo location unconfirmed)

## Game integrations

`verb_blaster.html` and `adj_adv_blaster.html` are self-contained games (copied from `C:\HINSON_GS\`, Google Fonts CDN stripped for offline use) embedded via `<iframe class="game-frame">` on dedicated screens, launched from special-stage dashboard cards.

**Cloud leaderboard (added 2026-08-28):** both games sync scores to a shared Supabase Postgres table (`public.leaderboard`, project `https://jliphrfjoskjtdoufdjc.supabase.co`) via `@supabase/supabase-js` loaded from the unpkg CDN, distinguished by a `game` column (`'verb_blaster'` / `'adj_adv_blaster'`). Client uses the publishable/anon key (safe to keep in the HTML — RLS policies allow public `select`+`insert` only, no `update`/`delete` from clients). Each game keeps writing to its own local `vb_lb`/`aab_lb` localStorage key too as an offline fallback — `renderLB()` tries the cloud first and only falls back to local history if the fetch fails (e.g. offline). Live updates use a Supabase Realtime subscription on `INSERT`, so an open leaderboard screen updates itself when another device submits a score, no refresh needed. To wipe leaderboard rows, use the Supabase dashboard's Table Editor directly — the anon key intentionally cannot delete.
