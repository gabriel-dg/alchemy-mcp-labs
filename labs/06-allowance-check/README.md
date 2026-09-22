# Lab 6: what can still spend your tokens?

## Goal

Find out which token permissions are still active for a public Ethereum address. Paste one prompt and get a plain-language report: the token, the contract allowed to use it, the permission amount, and whether the address still holds that token.

The useful surprise: **a token balance can be zero while its spending permission remains active.** The technical name for that permission is an *allowance*. You do not need to know Solidity, connect a wallet, or sign anything to read it.

This is an independent educational lab using Alchemy MCP. The agent follows [allowance-check](../../skills/allowance-check/SKILL.md). It checks a small, named list; it does not discover every approval or change any permission.

## Before you start

- Finish [SETUP.md](../../SETUP.md) and the connection check in [Lab 0](../00-hello-mcp/README.md). You can jump straight here; Labs 1 to 5 are not prerequisites.
- Open this repo in your MCP-capable agent, with Ethereum Mainnet enabled in the Alchemy app you select.
- Allow about 10 minutes for the walkthrough. The design uses read tools on the Free path; errors and coverage limits stay visible in the result.

No funds, wallet connection, public receiver or API key pasted into the chat are needed. Alchemy MCP uses the account connection you configured in SETUP. Your public address is enough; never share a seed phrase or private key.

## Run it

### A. Try a neutral live control first

This owner is the documented Uniswap V2 Router02 protocol contract, not an individual wallet. The live example demonstrates API behavior; it does not audit or rate the protocol. The agent checks **USDC, USDT and WETH** against **Uniswap V2 Router02, the original Uniswap V3 SwapRouter, and Permit2**: nine specific token/contract pairs. These are examples, not a claim that the owner is at risk or a recommendation to approve those contracts.

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Explain the result in plain language and state exactly what was checked.

Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Network: eth-mainnet
Tokens: default
Spenders: default
```

Choose an Alchemy app if asked, then read the summary. The normal full-check path uses 17 calls including app selection. No website needs to connect to your wallet.

### B. Zoom in on one permission

For a shorter first run, check one token and one contract. The normal path uses seven calls.

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Explain what a zero balance does and does not say about an approval.

Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Network: eth-mainnet
Tokens: USDT
Spenders: Uniswap V3 SwapRouter
```

## What you should see

The live controls use a protocol contract or the zero address. Their actual reports are in [the reference runs](../../skills/allowance-check/examples/README.md); no individual wallet or account identifier is published.

The reference runs on 2026-09-22 UTC returned zero balances and zero allowances for every checked pair (nine in A, one each in B/C). Future live results may differ.

To understand permission states before trying your own address, read this **fictional illustration**, not an onchain finding:

| Example | Token balance | Permission | What it teaches |
|---|---:|---|---|
| A | 0 demo tokens | Unlimited | Permission can remain when the balance is zero |
| B | 50 demo tokens | Limited to 15 | Only 15 fits within this permission |
| C | 50 demo tokens | None | Holding a token is different from authorizing a spender |
| D | Unknown | Unknown | A failed read is not evidence of zero |

The [offline behavioral tests](../../skills/allowance-check/examples/fixture-review.md) check these distinctions with synthetic data. No permission is changed to manufacture an interesting live demo.

Each live report names the address, network, observation window, selected tokens/spenders and coverage count. Its table shows Token, Spender, Balance, Permission, Balance covered and Note. Every requested pair stays visible, even when zero or unknown. Full public contract addresses and the tools used make the result inspectable; app/account identifiers are omitted from published logs.

## Reading the output

**Permission is separate from balance.** When an application asks you to approve a token, that permission is stored in the token contract. Closing the app or disconnecting the wallet does not itself clear it. A zero balance also does not clear an ordinary ERC-20 allowance. Read the two columns together; the [ERC-20 specification](https://eips.ethereum.org/EIPS/eip-20) defines balance and allowance as separate reads.

**The four statuses.** `NONE` means zero allowance for that exact pair now. `LIMITED` means a finite positive amount. `UNLIMITED` means the maximum uint256 allowance; the report explains it instead of showing a wall of digits. `UNKNOWN` means the read did not establish the permission. It is never treated as zero.

**Balance covered is an upper bound.** It is the smaller of balance and allowance. It does not prove a transfer could execute: contract rules and other permissions can restrict it. Several spenders can refer to the same tokens, so adding the rows would double-count. There is no "total funds at risk" score.

**Permit2 has another layer.** Its row only reads permission from the token to Permit2. It does not check which downstream apps have Permit2 authorization or when those permissions expire. The report labels this boundary directly on the row.

**Coverage matters.** Nine checked pairs are not every approval in your wallet. This lab excludes unlisted spenders and tokens, other networks, NFTs, native ETH, account delegation and unsubmitted signed permits. WETH is a separate token, not your ETH balance. A known contract is not a safety guarantee; unlimited permission alone is not evidence of a hack.

**What to do with a finding.** Review the named token and spender and whether you still use that application. Any decision to change an approval is a separate action in a trusted wallet interface. This lab only reads; it never creates a revoke transaction or a signing request.

## Try your own

**Try your address privately.** Copy A and replace only `Address:` with your public Ethereum `0x` address. Leave the defaults for the first run. Ask for the report in your preferred language. This version accepts addresses, not ENS names. Keep your personal report in your conversation; do not add it to public examples.

**All zeros?** That is a valid result for this list. You may use other tokens, other router versions or another chain. It does not certify your wallet as safe. [Prompt C](../../skills/allowance-check/PROMPTS.md#c-the-zero-address-control) checks the zero address and also returns JSON.

**Check a specific app.** Replace `Spenders:` with the exact Ethereum spender address from your approval details or the app's documentation. Replace `Tokens:` with the token contract address if it is not one of the defaults. Use up to three comma-separated addresses in each list. Each custom list replaces that side of the defaults. A brand name alone is not enough to identify the contract.

**Another chain?** Version 0.1.2 deliberately covers `eth-mainnet` only; token and router addresses are network-specific. Do not reuse this checklist on Base or Arbitrum by changing only the network line.

**Use it by name.** In Claude Code inside this repo: `/allowance-check 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`. In other agents, use the copy-paste prompt. Add `Format: markdown+json` for a structured result.

## Now build it

The reusable building block is a bounded permission check: **owner + token list + spender list → current allowance report**. Put it in a wallet's permissions page, a treasury's recurring review, or a support workflow that explains why a swap needs another approval.

Alchemy MCP lets you explore it conversationally. The same reads are available through the [Token API](https://www.alchemy.com/docs/data/token-api/token-api-endpoints/alchemy-get-token-allowance); the [MCP server documentation](https://www.alchemy.com/docs/alchemy-mcp-server) describes the agent interface. This lab uses no Transaction Simulation endpoints.

The optional JSON report preserves raw amounts as strings, keeps failed reads null and names the checked addresses. A production application should maintain its own network-specific token/spender list and expose the same coverage limits. For a coherent single-block snapshot, use block-pinned contract reads; the enhanced methods used here observe current state across several calls.

## Troubleshooting

| Symptom | What to check |
|---|---|
| Everything says NONE | Confirm the network and exact token/spender addresses; this is a small checklist, not an approval-discovery service. |
| Balance is zero but permission is positive | That is a useful finding, not a contradiction. Permission and balance are separate contract values. |
| A row says UNKNOWN | Read Gaps. Missing data, errors or empty RPC responses are not proof of zero allowance. |
| Amount looks much too large | Confirm token decimals and raw units. Only exact uint256 max is labelled UNLIMITED. |
| Permit2 is approved but an app still cannot spend | There is another application-specific authorization layer; this lab does not inspect it. |
| A tool asks for PAYG or an upgrade | The agent records the gap without retrying or bypassing the plan restriction. Do not upgrade just to force the demo. |
| A tool returns 429 | The agent retries the affected call once after a short wait; unresolved reads remain unknown. |
| The agent offers to revoke something | Stop that action. This lab only reports permissions and must not request a signature. |
