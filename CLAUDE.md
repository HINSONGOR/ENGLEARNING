# HINSON ENG ADVENTURE

A Traditional-Chinese, Harry Potter x Minecraft themed P6 English grammar learning platform. Vanilla HTML/CSS/JS, no frameworks, all state in LocalStorage.

## Deployment — standing authorization

This folder is a git repo connected to `https://github.com/HINSONGOR/ENGLEARNING.git` (branch `main`), deployed via GitHub Pages at `https://hinsongor.github.io/ENGLEARNING/`. The user's desktop shortcut opens that live URL, not local files.

**The user has authorized committing and pushing to this repo automatically, without asking for confirmation each time.** This is a small personal/family project (a handful of known users), so treat `git add -A && git commit && git push origin main` as a routine step after finishing a change here — not an action requiring per-instance sign-off. Still use good judgment: write clear commit messages, don't push obviously broken/untested changes, and mention in your summary that you pushed (so the user always knows what went live) rather than pushing silently.

After pushing, GitHub Pages typically takes 1-2 minutes to rebuild — verify with a cache-busted fetch (`fetch(url + '?cachebust=' + Date.now(), {cache:'no-store'})`) before telling the user a change is live; don't just assume it deployed.

## Sibling projects (same GitHub account, same pattern)

- `C:\HinsonChineseLearning` → `github.com/HINSONGOR/HinsonChineseLearning` → `hinsongor.github.io/HinsonChineseLearning/`
- Math platform → `hinsongor.github.io/MATHS/` (local repo location unconfirmed)

## Game integrations

`verb_blaster.html` and `adj_adv_blaster.html` are self-contained games (copied from `C:\HINSON_GS\`, Google Fonts CDN stripped for offline use) embedded via `<iframe class="game-frame">` on dedicated screens, launched from special-stage dashboard cards. They keep their own localStorage-based leaderboard/progress, separate from the main platform's XP/report system, by design (avoids namespace collisions between the two codebases).
