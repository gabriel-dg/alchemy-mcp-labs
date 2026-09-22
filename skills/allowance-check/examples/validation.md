# Lab 6 validation

Validation date: **2026-09-22 UTC**. Skill: **allowance-check v0.1.2**. Network: **eth-mainnet**. Each run listed apps and selected the app previously chosen explicitly by the user. Published administrative parameters are redacted; no account identifier is needed to reproduce the workflow with your own connection.

## What actually ran

Three independent fresh agents executed prompts A, B and C from [PROMPTS.md](../PROMPTS.md), without prior reference reports. They made **31 Alchemy calls** (17 + 7 + 7), all successful, without retries or fallback. The [examples index](README.md) links the full prompts, reports, observation windows and summarized call logs.

A/B use the documented Uniswap V2 Router02 contract as owner. C uses the zero address. All observed token balances and allowances were zero. These are neutral API integration controls, not wallet investigations or protocol audits. Earlier unpublished draft evidence was withdrawn; no old observation was relabelled as a new neutral-address result.

No signature, transaction submission, approval, revocation, webhook or account-resource mutation was performed. Selecting the app established session routing only. Local file reads, exact arithmetic and clock reads are not Alchemy calls.

## Tool surface

The connected server exposed 173 Alchemy tools. The allowed names and relevant parameters were inspected:

| Tool | Parameters | Evidence |
|---|---|---|
| list_apps | none | Each live run; account metadata omitted |
| select_app | app_id | Prior explicit user choice; identifier redacted in public logs |
| ethBlockNumber | network | Live observation windows |
| getTokenBalances | network, address, contractAddresses | Live explicit token lists |
| getTokenMetadata | network, contractAddress | Live symbols and decimals |
| getTokenAllowance | network, contract, owner, spender | Live zero decimal-string results |
| ethCall | network, to, data, blockNumber | Schema inspected; fallback decisions evaluated offline, not exercised live |

The only new shared pre-approval is getTokenBalances. Existing Lab 5 mutation consent gates are unchanged.

## Free-tier assumptions and limits

The workflow assumes Free, bounds requests and uses no paid trace, simulation or broad-log dependency. Successful reads do not establish the selected account's billing tier. No real billing denial, exhausted quota or 429 retry occurred; relevant failure behavior was evaluated with offline fixtures only.

The [registry](../registry.md) links sources for network-specific protocol addresses. Labels are not security endorsements. Permit2 coverage is limited to the token-to-Permit2 allowance, not downstream application or signed-permit permissions.

## Offline evidence

The [fixture review](fixture-review.md) records an independent v0.1.0 evaluation with synthetic inputs: finite and maximum allowances, zero balances with positive permissions, one-base-unit amounts, missing data, a billing failure and network rejection. No live calls occurred in those tests.

Version 0.1.1 clarified deterministic arithmetic, validation order and the opening finding. Version 0.1.2 adds publication boundaries; the neutral live runs use v0.1.2. The earlier offline evaluation is not claimed to be a new v0.1.2 test run or a live finding.

## Local verification

Both the canonical skill and Claude Code pointer passed the bundled skill validator. Checked 113 local Markdown links across 68 Markdown files, including heading anchors: no missing targets. All five Lab 6 JSON code blocks parsed; the structured control report passed exact integer status, coverage and count checks.

Walkthrough/reference prompt parity, all eight contributor-required walkthrough sections, AGENTS.md/CLAUDE.md routing parity, new-file fences/whitespace and git diff --check passed. The only added shared permission is getTokenBalances.

The privacy scan covered 70 tracked or non-ignored publication candidates and checked all 12 Lab 6 files against a documented-address allowlist (with explicitly offline fixture exceptions). No credential-pattern, unexpected-address, stale draft-reference or app-identifier finding remained in the new lab. Added integration lines introduced no matching personal references. The [publication review](publication-review.md) records the separate privacy scope and deferred legacy review.

## Boundaries

Live evidence covers current Ethereum reads, zero allowances, balance/metadata joins and structured output. **Positive finite or unlimited allowances, positive permissions with zero balance, failures and fallback decisions are fixture-tested only.** No real fallback execution, ENS resolution, other network, approval discovery or fixed-block replay was validated.

The report is a bounded observation, not an atomic or finalized snapshot. It supports no wallet-wide safety verdict, total-funds-at-risk calculation or guaranteed transferability claim.
