# 0xramp docs

Official documentation for **[0xramp.app](https://www.0xramp.app)** — the non-custodial fiat ↔ crypto on/off-ramp by **[0xramp labs](https://github.com/0xramp-labs)**.

This repository is the source of the public docs site (Mintlify). Content is mostly **user-facing**, with a smaller **developers** section.

## What 0xramp is

0xramp lets users buy and sell crypto against local fiat rails such as **BRL via Pix**.

| Piece | Role |
| -------- | ------ |
| **0xramp** | Product UX, session tracking, status experience |
| **P2P.me** | Identity, reputation, limits, verification, Pix matching, USDC escrow on Base |
| **NEAR Intents** | Conversion between Base USDC and the user’s asset |

Orders are placed **on-chain** by the user’s P2P.me smart account or a connected wallet (e.g. Rabby, Phantom). 0xramp does **not** hold user keys or bank credentials.

Live app: [https://www.0xramp.app](https://www.0xramp.app)

## Docs map

| Area | Pages (examples) |
| ------ | ------------------ |
| Product | Introduction, How it works, Buying, Selling |
| Account | Accounts & identity, Limits & verification |
| Money path | Fees & quotes, Refunds & failed trades, Supported assets |
| Trust | Security & trust, FAQ |
| Builders | `developers/` (architecture, contribution notes) |

Navigation and site config live in [`docs.json`](./docs.json).

## Local development

Requires Node.js 20+.

```bash
# Install Mintlify CLI (once)
npm i -g mint

# From this repo
mint dev
```

Open the URL the CLI prints (usually <http://localhost:3000>).
Useful commands:

```
mint broken-links   # optional link check
mint dev            # local preview
```

## Publishing

The site deploys automatically when changes land on the configured branch (typically main), via the Mintlify GitHub App connected to this repository.

Push or merge to main → production docs update
PRs can get preview deployments when the app is configured

Dashboard: <https://app.mintlify.com>

## Contributing

1. Branch from main
2. Edit or add .mdx pages; update docs.json if you change navigation
3. Run `mint dev` and verify locally
4. Open a PR to main

## Guidelines

- Prefer short pages and clear language
- Do not claim 0xramp custodians funds, runs KYC itself, or sets limits independently of P2P.me
- Do not document secrets, private admin APIs, or production credentials
- Mark beta / partner-gated behavior explicitly when it is not always on

App source (private): 0xramp-labs/0xramp-app

## Related

- App: 0xramp.app
- Org: github.com/0xramp-labs
- Mintlify: mintlify.com/docs

## License

See LICENSE.
