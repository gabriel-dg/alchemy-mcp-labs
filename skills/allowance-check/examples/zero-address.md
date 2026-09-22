# What can still spend these tokens?

No active allowances in the checked list: 0 active permissions among 1 checked pair, with 0 unknown allowances.

- **Address:** 0x0000000000000000000000000000000000000000
- **Network:** eth-mainnet
- **Observed:** 2026-09-22T00:05:43.111Z to 2026-09-22T00:06:14.608Z; start block `0x18d2d1f`, end block `0x18d2d22`. These are current reads across calls, not an atomic snapshot or a claim of finalized state.
- **Summary:** USDC allowance to Uniswap V2 Router02 is zero; the observed USDC balance is also zero.
- **Coverage:** 1 token × 1 spender = 1 requested pair; 1 allowance read succeeded, 0 unknown. Balance and metadata reads succeeded.
- **Skill:** allowance-check v0.1.2.
- **Run:** Fresh live Prompt C zero-address integration control; not a protocol audit or endorsement.

## Permissions

| Token | Spender | Balance | Permission | Balance covered | Note |
|---|---|---|---|---|---|
| USDC | Uniswap V2 Router02 | 0 USDC | NONE — 0 USDC | 0 USDC | No current allowance for this token/spender pair. |

## What this means

The allowance read, independently of the balance, returned zero for USDC → Uniswap V2 Router02. This does not establish that the pair was never approved, or support a wallet-wide safety verdict. A zero balance alone would not establish that an allowance is zero: a positive ordinary ERC-20 allowance can remain relevant to future deposits.

Balance covered is `min(balance, allowance)`: an upper bound from these two reads, not proof that a transfer can execute. Token restrictions, spender logic and other permissions also matter. Values were parsed, range-checked, compared and formatted using local BigInt arithmetic with the returned 6 decimals; no amount passed through floating point.

For a private allowance review, check the exact token and spender addresses relevant to the owner. Changing a permission would be a separate wallet action outside this lab. This neutral control is not a deposit destination.

## Addresses checked

| Role | Label | Address | Provenance |
|---|---|---|---|
| Owner | Zero-address control | `0x0000000000000000000000000000000000000000` | Prompt C in PROMPTS.md |
| Token | USDC | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | Exact registry match; registry cites Circle's USDC contract documentation |
| Spender | Uniswap V2 Router02 | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` | Exact registry match; registry cites Uniswap V2 deployment documentation |

Metadata returned USDC with 6 decimals, consistent with the registry. Labels establish the checklist identity, not a security guarantee.

## Tools used

7 Alchemy calls: `list_apps` × 1, `select_app` × 1, `ethBlockNumber` × 2, `getTokenBalances` × 1, `getTokenMetadata` × 1, and `getTokenAllowance` × 1. No fallback or retry was needed. Only the selected token was requested for balances.

The following summarized call log preserves exact data-call parameters and relevant results. Calls 4–6 were launched in the displayed order as one independent batch of three; their completion order is not asserted. App list/selection outputs are projected to success only. The selection parameter is explicitly redacted; this is not a usable app identifier. Metadata URLs are omitted.

```json
[
  {
    "order": 1,
    "tool": "list_apps",
    "parameters": {},
    "result": {
      "success": true
    }
  },
  {
    "order": 2,
    "tool": "select_app",
    "parameters": {
      "app_id": "[REDACTED]"
    },
    "redaction": "App-selection parameter redacted for publication; the actual call used the app already explicitly selected by the user.",
    "result": {
      "success": true
    }
  },
  {
    "order": 3,
    "tool": "ethBlockNumber",
    "parameters": {
      "network": "eth-mainnet"
    },
    "result": "0x18d2d1f"
  },
  {
    "order": 4,
    "parallelBatch": 1,
    "tool": "getTokenBalances",
    "parameters": {
      "network": "eth-mainnet",
      "address": "0x0000000000000000000000000000000000000000",
      "contractAddresses": [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      ]
    },
    "result": {
      "address": "0x0000000000000000000000000000000000000000",
      "tokenBalances": [
        {
          "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000"
        }
      ]
    }
  },
  {
    "order": 5,
    "parallelBatch": 1,
    "tool": "getTokenMetadata",
    "parameters": {
      "network": "eth-mainnet",
      "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    "result": {
      "decimals": 6,
      "name": "USDC",
      "symbol": "USDC"
    },
    "omitted": "Metadata logo URL omitted."
  },
  {
    "order": 6,
    "parallelBatch": 1,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "owner": "0x0000000000000000000000000000000000000000",
      "spender": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    "result": "0"
  },
  {
    "order": 7,
    "tool": "ethBlockNumber",
    "parameters": {
      "network": "eth-mainnet"
    },
    "result": "0x18d2d22"
  }
]
```

Local skill/registry reads, UTC timestamps and deterministic arithmetic are not Alchemy calls.

## Gaps

No failed reads, missing balances, missing metadata, billing failures, or unknown allowances occurred.

Only the selected USDC / Uniswap V2 Router02 pair on eth-mainnet was checked; no approval discovery was performed. NFTs, native ETH, unlisted tokens/spenders, other chains, account delegation, unsubmitted signed permits and Permit2 downstream permissions are outside coverage. No permissions were changed.

## Full prompt

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Keep every requested pair in the report, including zero or unknown values. Do not turn an all-zero result into a wallet-wide safety verdict.

Address: 0x0000000000000000000000000000000000000000
Network: eth-mainnet
Tokens: USDC
Spenders: Uniswap V2 Router02
Format: markdown+json
```

The user had already explicitly selected the app for this task; it was listed and selected again without requesting the choice again.

## Structured result

```json
{
  "schemaVersion": "1",
  "network": "eth-mainnet",
  "owner": "0x0000000000000000000000000000000000000000",
  "observedAt": "2026-09-22T00:06:14.608Z",
  "blockStart": "0x18d2d1f",
  "blockEnd": "0x18d2d22",
  "atomicSnapshot": false,
  "coverage": {
    "tokens": 1,
    "spenders": 1,
    "requestedPairs": 1,
    "knownAllowances": 1,
    "unknownAllowances": 0
  },
  "rows": [
    {
      "token": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "spender": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "decimals": 6,
      "balanceRaw": "0",
      "allowanceRaw": "0",
      "status": "NONE",
      "balanceCoveredRaw": "0",
      "permit2LayerOnly": false,
      "notes": [
        "No current allowance for this token/spender pair.",
        "Balance covered is an upper bound from these reads, not proof that a transfer can execute."
      ]
    }
  ],
  "gaps": [
    "No failed reads.",
    "Only the selected USDC / Uniswap V2 Router02 pair on eth-mainnet was checked; no approval discovery was performed.",
    "NFTs, native ETH, unlisted tokens/spenders, other chains, account delegation, unsubmitted signed permits, and Permit2 downstream permissions are outside coverage.",
    "No permissions were changed."
  ]
}
```
