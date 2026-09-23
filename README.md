# 0xramp docs

Official documentation for **[0xramp.app](https://www.0xramp.app)** -- the non-custodial fiat and crypto on/off-ramp by **[0xramp labs](https://github.com/0xramp-labs)**.

This repository is the source of the public docs site (Mintlify). Two audiences: **users** (crypto users in emerging markets) and **developers** (SDK integrators building wallet apps).

## What 0xramp is

0xramp lets users buy and sell crypto against local fiat rails: Pix (Brazil), UPI (India), QRIS (Indonesia), Alias (Argentina), Pago Movil (Venezuela), and more.

| Piece | Role |
|-------|------|
| **0xramp** | Product UX, session tracking, status experience |
| **P2P.me** | Identity, reputation, limits, verification, merchant matching, USDC escrow on Base |
| **NEAR Intents** | Conversion between Base USDC and the user's asset |

Orders are placed **on-chain** by the user's P2P.me smart account or a connected wallet (Rabby, Phantom). 0xramp does **not** hold user keys or bank credentials.

Live app: [https://www.0xramp.app](https://www.0xramp.app)

## Docs map

| Area | Pages |
|------|-------|
| Introduction | What is 0xramp, How It Works |
| Using 0xramp | Buy, Sell, Pay with QR, Swap, Supported Assets |
| Account | Getting Started, Limits & Verification, Referrals, Activity |
| Fees | Fees & Quotes |
| Safety & Support | Failed Trades, Privacy, FAQ, Donation, Contact |
| SDK | Overview, Quickstart, Integration Guide, API Reference, Recovery & Errors, Readiness Checklist, Changelog |

Navigation and site config live in [`docs.json`](./docs.json).

## Local development

Requires Node.js 20+.

```bash
npm i -g mint
mint dev
```

Open the URL the CLI prints (usually http://localhost:3000).

```bash
mint broken-links   # optional link check
```

## Publishing

The site deploys automatically when changes land on main, via the Mintlify GitHub App.

Push or merge to main -> production docs update.

Dashboard: https://app.mintlify.com

## Contributing

1. Branch from main
2. Edit or add .mdx pages; update docs.json if you change navigation
3. Run `mint dev` and verify locally
4. Open a PR to main

## Guidelines

- Prefer short pages and clear language
- Do not claim 0xramp custodies funds, runs KYC itself, or sets limits independently of P2P.me
- Do not document secrets, private admin APIs, or production credentials
- Mark pilot features explicitly (e.g., Pay with QR)
- Corridor and asset lists must match the live app -- when in doubt, trust the app

App source (private): 0xramp-labs/0xramp-app
SDK source (public): [0xramp-labs/0xramp-sdk](https://github.com/0xramp-labs/0xramp-sdk)

## Related

- App: [0xramp.app](https://www.0xramp.app)
- Org: [github.com/0xramp-labs](https://github.com/0xramp-labs)
- Telegram: [t.me/zeroxramp](https://t.me/zeroxramp)
- Mintlify: [mintlify.com/docs](https://mintlify.com/docs)

## License

See LICENSE.
