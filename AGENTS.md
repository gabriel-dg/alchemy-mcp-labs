# alchemy-mcp-labs

Educational labs that showcase the Alchemy MCP server. Humans read `labs/`, agents follow `skills/`. This file is the entry point for Cursor, Codex, and other agents that read `AGENTS.md`. `CLAUDE.md` holds the same rules for Claude Code.

## When the user asks to run a lab

- Lab 0 (connection check): follow `labs/00-hello-mcp/README.md`
- Lab 1 (before-you-sign): read `skills/before-you-sign/SKILL.md` and follow it exactly. Prompts are in `skills/before-you-sign/PROMPTS.md`. Reference runs are in `skills/before-you-sign/examples/`
- Lab 2 (contract-inspector): read `skills/contract-inspector/SKILL.md` and follow it exactly. Same layout for prompts and examples
- Lab 3 (multichain-brief): read `skills/multichain-brief/SKILL.md` and follow it exactly. Same layout. This lab queries five networks by default; the network list is printed in the report
- Lab 4 (solana-wallet-brief): read `skills/solana-wallet-brief/SKILL.md` and follow it exactly. Same layout. Default network for this lab is `solana-mainnet`; a `Network: solana-devnet` line switches. The DAS asset tools answer `-32001` on mainnet for Free apps: one call, then record under Gaps. Never call `solana_requestAirdrop`
- Lab 5 (watch-a-wallet): read `skills/watch-a-wallet/SKILL.md` and follow it exactly. Same layout for prompts and examples. One network (`eth-mainnet`), one temporary Address Activity webhook, at most three addresses. Show the exact proposal and require explicit creation consent; deletion requires separate explicit confirmation of the newly created ID. Never delete a preexisting webhook. No receiver means a read-only transfer preview.

- Lab 6 (allowance-check): read `skills/allowance-check/SKILL.md` and its linked registry. Read-only, `eth-mainnet`, one owner and at most three tokens by three spenders. Query zero-balance tokens too; unknown results are not zero. No approval discovery, revocations or wallet-wide safety verdicts. Prompts and examples use the same layout as the other skills.

## Rules for every lab

- All labs except Lab 5 are read-only. Lab 5 is the only exception: `create_webhook` and `delete_webhook` under its consent gates, plus `list_webhooks` and `get_webhook_addresses` for verification. Never sign, send, or broadcast a transaction. Never call `create_app`, `update_app`, `update_webhook`, other webhook mutations, or any gas-policy tool.
- Call `list_apps` and `select_app` before any RPC or data tool. If several apps exist, ask the user which one.
- Default network is `eth-mainnet`. Print the network in every report.
- Assume the Free tier. If a tool returns 400 mentioning payg, upgrade, or billing, do not retry with the same parameters. Record it under Gaps and continue.
- Use only tool names the server actually exposes. Do not invent tools. If the server offers an ENS resolution tool, use it; otherwise resolve ENS with `web3Sha3` plus `ethCall` as described in the skill.
- If the Alchemy MCP server is not connected, point the user to `SETUP.md` and stop.

## Repo layout

- `labs/` walkthroughs for humans
- `skills/<name>/SKILL.md` the playbook, `PROMPTS.md` copy-paste prompts, `examples/` reference runs
- `docs/how-it-works.md` concepts, glossary, tool map
- `.claude/` Claude Code specifics: skill pointer and pre-approved read-only tools
