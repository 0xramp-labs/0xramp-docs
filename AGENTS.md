# Documentation project instructions

## About this project

Public docs site for **0xramp**, a non-custodial fiat ↔ crypto on/off-ramp, built on
[Mintlify](https://mintlify.com). Pages are MDX with YAML frontmatter; navigation lives in
`docs.json`. Deploys to <https://docs.0xramp.app> on push to `main`.

- Repos: `0xramp-docs` (this, public) · `0xramp-sdk` (public) · `0xramp-app` (**private**)
- App: <https://www.0xramp.app>
- Two audiences: **users** (crypto users in emerging markets) and **developers** (SDK integrators).

## Commands

Node 26 is installed by default but Mintlify only supports ≤24. Use the mise-pinned Node:

```bash
mise exec node@24.18.1 -- mint dev            # local preview, http://localhost:3000
mise exec node@24.18.1 -- mint broken-links   # link check
```

`sources/` holds scraped reference pages (`sources/**`) and `tmp/` holds internal working
notes. Both are reference-only. `tmp/` is gitignored and listed in `.mintignore` so Mintlify
never parses or publishes it.

## Fact sources (do not hand-maintain)

- Corridors and rails come from the P2P.me country catalog and 0xramp's corridor policy, not
  from memory. Current: **stable** BRL/Pix, INR/UPI, IDR/QRIS, ARS/Alias, VES/Pago Móvil;
  **alpha** COP, NGN, ECU, BOB, CUP, PEN, PHP; **disabled** MEX. When the app and the docs
  disagree, trust the app and fix the docs.
- Limits and KYC are owned by P2P.me; 0xramp only displays them.
- Fees: 0xramp charges **zero** product fees. All fees come from P2P.me and NEAR Intents.
- ZEC delivery is **transparent address (t-addr) only**.
- If you cannot verify a claim, ask. Never invent numbers, assets, timelines, or behavior.

## Content boundaries (never publish)

- Private `0xramp-app` internals: Express/PostgreSQL/Railway stack, `server/` paths, internal
  module names, `VITE_*` env vars, ADRs, admin surfaces, release procedure.
- Anything under `tmp/`, copied verbatim or paraphrased. Re-derive and scrub it first.
- Secrets, production credentials, internal endpoints, or operator runbooks.

## Terminology

- **0xramp** (lowercase, one word) · **0xramp labs** for the org.
- **P2P.me** for identity, limits, escrow, merchant matching · **NEAR Intents** for conversion.
- **corridor** (not "country") · **local rail** for Pix/UPI/QRIS/Alias/Pago Móvil.
- **P2P.me account** (gas-sponsored smart account) vs **external wallet** (Rabby, Phantom).
- **transparent address (t-addr)** when describing ZEC delivery.
- Attribution: **"Powered by 0xramp · P2P.me"**.

## Style preferences

- Active voice, second person ("you"), sentence case headings.
- One idea per sentence. Short pages beat complete pages. Cut repetition; link to the page
  that owns a topic instead of restating it.
- Keep user-facing pages corridor-agnostic. Never hardcode "Pix"/"BRL" in steps that apply
  to all corridors.
- Bold for UI elements (**Settings**); code formatting for files, commands, paths, symbols.
- Avoid em dashes; use `--`.
- Do not add comments or explanations the reader did not ask for.
- Mark pilot/alpha behavior explicitly (for example Pay with QR) instead of implying it is
  generally available.

## Editing rules

- Renaming or adding a page requires updating `docs.json` navigation in the same change.
- `index.mdx` is the Mintlify root and is intentionally absent from `docs.json`.
- Screenshot placeholders use `{/* SCREENSHOT: what to capture */}`. Keep at least one per
  UI-focused page.
- Code samples in `developers/` must match the public `0xramp-sdk` surface (PSP-v1). Never
  document SDK internals that are not in the public repo.

## Verification before handoff

```bash
mise exec node@24.18.1 -- mint broken-links   # must print: no broken links found
mise exec node@24.18.1 -- mint dev            # must boot; spot-check changed pages
```

## Git

- Branch from `main` (`docs/<slug>`); open a PR; merge to `main` to deploy.
- Commit only when explicitly asked.
- Never commit `tmp/` or private app context.
