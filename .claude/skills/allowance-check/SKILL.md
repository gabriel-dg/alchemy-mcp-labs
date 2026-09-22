---
name: allowance-check
description: Check existing ERC-20 spending permissions with Alchemy MCP. Use when the user asks what can still spend my tokens, check old approvals, or review allowances for a wallet. Reads a bounded token-spender list on Ethereum mainnet and explains active permissions, including those with zero balance. Does not discover every spender or revoke approvals.
---

Read `skills/allowance-check/SKILL.md` and follow it exactly. Treat the user's argument as `Address:`. Default network is `eth-mainnet`; use the default token and spender lists unless the user supplies replacements. List apps and select the user's choice first. Never sign, send, broadcast, approve, revoke, or mutate account resources.

Ready-made inputs are in `skills/allowance-check/PROMPTS.md`. The human walkthrough is `labs/06-allowance-check/README.md`.

For published examples, follow the canonical publication boundary: neutral protocol/zero-address controls, clearly labelled offline fixtures, and no personal-wallet reports or app/account identifiers.
