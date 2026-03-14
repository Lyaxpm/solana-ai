# Solana Smart-Wallet Meme Copy Trader (CLI)

A **terminal-only**, production-minded Node.js + TypeScript bot for conservative autonomous meme-coin copy-trading workflows on Solana.

## Why this bot is conservative

This project is designed for **tiny capital ($10)**. It prioritizes:
- safety over action
- skip over weak setups
- strict guardrails
- full CLI observability

Many loops should produce **NO TRADE** by design.

## Core architecture (3 layers)

1. **Wallet scoring**: discover wallets from token activity, derive features, compute score (0-100).
2. **Coin filtering/scoring**: liquidity, volume, age, slippage, suspicious/incomplete data checks.
3. **Execution discipline**: entry only if all checks pass; exits via stop loss / take profit / max hold.

## Project layout

- `src/collectors`: external adapters (Solana RPC, Helius, DEX Screener, Jupiter)
- `src/discovery`: candidate token and wallet discovery pipelines
- `src/scoring`: wallet + coin feature engineering and scoring
- `src/strategy`: entry/exit/sizing logic
- `src/execution`: `Broker` interface + `PaperBroker` + `LiveBroker`
- `src/risk`: guardrails, stale data, startup checks
- `src/db`: SQLite schema, migrations, repositories
- `src/services`: orchestrator/scheduler/monitor
- `src/cli`: banner, logger, decision renderers, summary tables

## Quick start

```bash
npm install
cp .env.example .env
npm run start
```

`npm run start` performs:
1. startup banner
2. env validation (zod)
3. SQLite init + migrations
4. startup checks (RPC, DEX, optional Helius/Jupiter)
5. mode + risk summary
6. continuous loop: discovery -> scoring -> strategy -> execution -> summaries

## Modes

- Default: `PAPER_TRADING=true`, `LIVE_TRADING=false`
- Live mode requires `LIVE_TRADING=true`, `PAPER_TRADING=false`, and `BOT_PRIVATE_KEY`

## Risk guardrails

- kill switch
- max daily loss
- max open positions
- max position size
- slippage ceiling
- fee sanity for tiny notional
- stale data rejection
- reserve SOL check
- fail-closed behavior

## Logging

- `LOG_FORMAT=pretty`: human readable with colored blocks/tables
- `LOG_FORMAT=json`: machine-friendly logs

Decision outputs always include reasons (accept/reject).

## Tests

```bash
npm test
```

Includes tests for:
- wallet score
- coin score
- position sizing
- guardrail rejection

## Limitations

- External integrations are wrapped behind interfaces; some API details are placeholder/TODO.
- Paper mode is the intended immediate runtime.
- Live trading is high risk; test with tiny funds only.

## Safety warning

Meme-coin trading can result in total loss. Use only funds you can lose.
