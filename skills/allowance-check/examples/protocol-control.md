Cold run, 2026-09-22 UTC, on skill v0.1.2

# What can still spend these tokens?

No active allowances in the checked list: 0 of 9 checked permissions were active, and all 9 allowance reads succeeded.

- **Address:** 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
- **Network:** eth-mainnet
- **Observed:** 2026-09-22 00:05:37 UTC to 2026-09-22 00:06:24 UTC; start block `0x18d2d1e`, end block `0x18d2d22`. These are current reads across calls, not an atomic snapshot or a claim of finalized state.
- **Summary:** All three selected token balances were zero, and every selected token/spender allowance was zero. There were 0 unknown allowances.
- **Coverage:** 3 tokens × 3 spenders = 9 requested pairs; 9 allowance reads succeeded, 0 unknown.

This owner is the documented Uniswap V2 Router02 protocol contract, used as a neutral integration control. It is not a personal-wallet example, protocol audit, endorsement, or destination for deposits. State can change after this observation.

## Permissions

| Token | Spender | Balance | Permission | Balance covered | Note |
|---|---|---|---|---|---|
| USDC | Uniswap V2 Router02 | 0 USDC | NONE — 0 USDC | 0 USDC | No current allowance for this pair |
| USDC | Uniswap V3 SwapRouter | 0 USDC | NONE — 0 USDC | 0 USDC | No current allowance for this pair |
| USDC | Permit2 | 0 USDC | NONE — 0 USDC | 0 USDC | Token → Permit2 only; No current allowance for this pair |
| USDT | Uniswap V2 Router02 | 0 USDT | NONE — 0 USDT | 0 USDT | No current allowance for this pair |
| USDT | Uniswap V3 SwapRouter | 0 USDT | NONE — 0 USDT | 0 USDT | No current allowance for this pair |
| USDT | Permit2 | 0 USDT | NONE — 0 USDT | 0 USDT | Token → Permit2 only; No current allowance for this pair |
| WETH | Uniswap V2 Router02 | 0 WETH | NONE — 0 WETH | 0 WETH | No current allowance for this pair |
| WETH | Uniswap V3 SwapRouter | 0 WETH | NONE — 0 WETH | 0 WETH | No current allowance for this pair |
| WETH | Permit2 | 0 WETH | NONE — 0 WETH | 0 WETH | Token → Permit2 only; No current allowance for this pair |

## What this means

USDC, USDT, and WETH each returned no current allowance to Uniswap V2 Router02, Uniswap V3 SwapRouter, or Permit2. The USDC/Router02, USDT/Router02, and WETH/Router02 checks use the same contract as owner and spender; those pairs were still queried explicitly.

Zero allowance means no permission now for that pair; it does not mean the pair was never approved, or establish a wallet-wide safety verdict. The zero balances alone would not establish zero permissions: an ordinary ERC-20 allowance can remain with zero balance and matter for future deposits. Here, separate allowance reads establish the nine zero results.

Balance covered is computed separately for each pair as `min(balance, allowance)`, using exact integer arithmetic. It is an upper bound from those two reads, not proof that a transfer can execute; token restrictions, spender logic and other permissions also matter. Do not add this column across rows or interpret it as a valuation.

No specific checked pair has an active permission to review in this control. For a private check, choose the actual owner and exact token/spender addresses of interest; unlisted pairs were not evaluated. Any later permission change is a separate wallet action outside this read-only lab. Unlimited allowances are not by themselves proof of compromise, and familiar spender labels are not safety guarantees.

## Addresses checked

Labels and address provenance come from [registry.md](../registry.md); all selected addresses match its Ethereum entries exactly. Successful metadata reads returned the expected decimals, with no identity/decimal conflict.

| Role | Label | Full address | Provenance |
|---|---|---|---|
| Token | USDC (6 decimals) | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` | Registry, Circle issuer source |
| Token | USDT (6 decimals) | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | Registry, Tether issuer source |
| Token | WETH (18 decimals) | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` | Registry, Uniswap Ethereum deployment source |
| Owner and spender | Uniswap V2 Router02 | `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` | Prompt A and registry, Uniswap V2 deployments |
| Spender | Uniswap V3 SwapRouter | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | Registry, Uniswap Ethereum deployments; original SwapRouter |
| Spender | Permit2 | `0x000000000022D473030F116dDEE9F6B43aC78BA3` | Registry, Uniswap Permit2 source/design |

WETH is an ERC-20 token, not native ETH. Labels identify this checklist's exact addresses and are not security endorsements.

## Tools used

17 actual Alchemy calls: `list_apps` × 1, `select_app` × 1, `ethBlockNumber` × 2, `getTokenBalances` × 1, `getTokenMetadata` × 3, `getTokenAllowance` × 9. No retries or fallback calls were needed.

Invocation order: list, select, start block, balances, metadata batch of three, USDC allowance batch of three, USDT allowance batch of three, WETH allowance batch of three, end block. Within each concurrent batch, log numbers denote invocation order, not guaranteed completion order. No batch exceeded three calls.

The existing user choice explicitly selected the app for this task before this run; it was found by `list_apps` and then selected, so no repeated choice/consent pause was needed. App selection outputs were projected to success/presence booleans before display. Public account identifiers and names are withheld.

Local deterministic JavaScript used BigInt for uint256 validation, balances, allowances, comparisons, and exact decimal formatting; `(1n << 256n) - 1n` produced the maximum uint256. Balance results were matched by token address, not returned order. All balances, allowances and per-pair covered amounts are raw decimal `"0"`. Local computation, clock reads and repository file operations are not included in the 17 Alchemy calls.

## Gaps

- No failed balance, metadata, allowance, or block reads. No unavailable fields or billing restrictions were encountered.
- This list is a bounded sample, not approval discovery. NFTs, native ETH, unlisted tokens/spenders, other networks, account delegation and unsubmitted signed permits are excluded.
- Every Permit2 row reads **Token → Permit2 only**. Downstream application permissions, expirations and signed messages were not checked. A zero ERC-20 allowance does not establish that all downstream permissions or unsubmitted signed permits have been cleared.
- Reads were not pinned to one block and are not an atomic snapshot.
- No permissions were changed. No signing, sending, broadcasting, approving, revoking, resource creation, webhook delivery or cleanup was exercised.

## Full prompt

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Explain the result in plain language and state exactly what was checked.

Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Network: eth-mainnet
Tokens: default
Spenders: default
```

## Call log

This is a summarized/redacted call log, not raw tool output. All non-secret data-call parameters are preserved. Result envelopes are unwrapped; metadata URLs/logos and unrelated account data are omitted. The `select_app.app_id` value is explicitly an **account-ID redaction**, not a usable identifier or a parameter submitted to the server.

```json
[
  {
    "order": 1,
    "tool": "list_apps",
    "parameters": {},
    "outcome": {
      "succeeded": true,
      "userSelectedAppPresent": true
    }
  },
  {
    "order": 2,
    "tool": "select_app",
    "parameters": {
      "app_id": "[REDACTED]"
    },
    "parameterNote": "Account-ID redaction; the real user-selected ID was used for the call. This placeholder was not submitted.",
    "outcome": {
      "succeeded": true
    }
  },
  {
    "order": 3,
    "tool": "ethBlockNumber",
    "parameters": {
      "network": "eth-mainnet"
    },
    "outcome": {
      "succeeded": true,
      "result": "0x18d2d1e"
    }
  },
  {
    "order": 4,
    "tool": "getTokenBalances",
    "parameters": {
      "network": "eth-mainnet",
      "address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "contractAddresses": [
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      ]
    },
    "outcome": {
      "succeeded": true,
      "result": {
        "address": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        "tokenBalances": [
          {
            "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "contractAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000"
          },
          {
            "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "tokenBalance": "0x0000000000000000000000000000000000000000000000000000000000000000"
          }
        ]
      }
    }
  },
  {
    "order": 5,
    "tool": "getTokenMetadata",
    "parameters": {
      "network": "eth-mainnet",
      "contractAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    "outcome": {
      "succeeded": true,
      "result": {
        "decimals": 6,
        "name": "USDC",
        "symbol": "USDC"
      }
    }
  },
  {
    "order": 6,
    "tool": "getTokenMetadata",
    "parameters": {
      "network": "eth-mainnet",
      "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    },
    "outcome": {
      "succeeded": true,
      "result": {
        "decimals": 6,
        "name": "Tether USDt",
        "symbol": "USDT"
      }
    }
  },
  {
    "order": 7,
    "tool": "getTokenMetadata",
    "parameters": {
      "network": "eth-mainnet",
      "contractAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    "outcome": {
      "succeeded": true,
      "result": {
        "decimals": 18,
        "name": "WETH",
        "symbol": "WETH"
      }
    }
  },
  {
    "order": 8,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 9,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 10,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0x000000000022D473030F116dDEE9F6B43aC78BA3"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 11,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 12,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 13,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0x000000000022D473030F116dDEE9F6B43aC78BA3"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 14,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 15,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 16,
    "tool": "getTokenAllowance",
    "parameters": {
      "network": "eth-mainnet",
      "contract": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "owner": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      "spender": "0x000000000022D473030F116dDEE9F6B43aC78BA3"
    },
    "outcome": {
      "succeeded": true,
      "result": "0"
    }
  },
  {
    "order": 17,
    "tool": "ethBlockNumber",
    "parameters": {
      "network": "eth-mainnet"
    },
    "outcome": {
      "succeeded": true,
      "result": "0x18d2d22"
    }
  }
]
```

## Skill clarity

No workflow ambiguity blocked this fresh-agent run. The prior explicit app selection was applied under the skill's user-choice exception. No previous examples or historical reports were read.
