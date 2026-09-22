# Ethereum checklist

This is a small teaching checklist for **eth-mainnet**, not a directory of every token, spender or current protocol entry point. Defaults were checked against issuer/protocol sources on 2026-09-21. Exact address matches establish the label used here, not a security endorsement. Historical router versions are included because old permissions can remain after an application changes routers.

## Tokens

| Label | Contract | Expected decimals | Source |
|---|---|---|---|
| USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | 6 | [Circle](https://developers.circle.com/stablecoins/usdc-contract-addresses) |
| USDT | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | 6 | [Tether](https://tether.to/en/supported-protocols/) |
| WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | 18 | [Uniswap Ethereum deployments](https://developers.uniswap.org/docs/protocols/v3/deployments/v3-ethereum-deployments) |

Expected decimals are a cross-check, not a substitute for a successful metadata read. WETH is wrapped ETH; native ETH does not use ERC-20 allowances.

## Spenders

| Label | Address | Meaning |
|---|---|---|
| Uniswap V2 Router02 | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` | V2 router; direct token allowance |
| Uniswap V3 SwapRouter | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | Original V3 SwapRouter, not SwapRouter02 or Universal Router |
| Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | ERC-20 allowance to the Permit2 contract only |

Sources: [Uniswap V2 deployments](https://developers.uniswap.org/docs/protocols/v2/deployments), [Uniswap Ethereum deployments](https://developers.uniswap.org/docs/protocols/v3/deployments/v3-ethereum-deployments), [Permit2 source and design](https://github.com/Uniswap/permit2).

Permit2 adds its own authorization layer: a token allowance to Permit2 is not the same as Permit2 allowing a downstream application to spend. This lab does not enumerate those application permissions, inspect expiration times or evaluate SignatureTransfer authorizations. A positive row is not permission for arbitrary callers to withdraw funds. A zero row does not establish that every downstream permission or unsubmitted signed permit has been cleared.

## Custom lists

Exact addresses supplied by the user replace that side of the defaults. Use `user-supplied token` / `user-supplied spender` labels unless an address matches this registry. Metadata may supply a display symbol but is not issuer verification. Never copy Ethereum defaults to another network or infer a spender from a dapp's brand name.

## Neutral published controls

PROMPTS.md uses the documented V2 Router02 contract above as the owner for live protocol checks, and the zero address for a separate control. A protocol contract is not a model of a personal wallet. These inputs demonstrate API behavior without analyzing an individual; they are not audits, endorsements or destinations for deposits. Positive and failed permission examples are offline synthetic fixtures, not relabelled observations from a different account.
