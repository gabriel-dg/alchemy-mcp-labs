Cold run, 2026-09-22 UTC, on skill v0.1.2

Independent live run of prompt B, using the documented Uniswap V2 Router02 contract as a neutral protocol control. This is an integration check, not a protocol audit or endorsement. No earlier reference run supplied results for this run.

## Full prompt

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Explain what a zero balance does and does not say about an approval.

Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Network: eth-mainnet
Tokens: USDT
Spenders: Uniswap V3 SwapRouter
```

User choice: the user had explicitly selected an app for this task before this run; `list_apps` and `select_app` were still called. No repeated app-choice pause was needed. Its name and ID are redacted from this public record.

# What can still spend these tokens?

No active allowances in the checked list: 0 of 1 checked pairs had an active permission.

- **Address:** `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` (Uniswap V2 Router02 protocol contract)
- **Network:** eth-mainnet
- **Observed:** 2026-09-22 00:05:35–00:06:03 UTC; start block `0x18d2d1e` (26029342), end block `0x18d2d21` (26029345). Current reads across calls, not an atomic snapshot or a claim of finalized state.
- **Summary:** USDT balance was zero and the allowance to Uniswap V3 SwapRouter was zero. No unknown allowances.
- **Coverage:** 1 token × 1 spender = 1 requested pair; 1 allowance read succeeded, 0 unknown. Balance and metadata reads also succeeded.

## Permissions

| Token | Spender | Balance | Permission | Balance covered | Note |
|---|---|---|---|---|---|
| USDT | Uniswap V3 SwapRouter | 0.000000 USDT | `NONE` — 0 USDT | 0.000000 USDT | No current allowance for this pair. Zero balance alone would not establish that. |

## What this means

The separate allowance read establishes that Uniswap V3 SwapRouter has no current USDT allowance from this owner. It does not establish that the pair was never approved or describe any other token/spender pair.

A zero balance does not cancel an ordinary ERC-20 allowance. If an allowance remains positive after a balance reaches zero, it can matter for future deposits. This run found both values at zero; it did not demonstrate a positive permission with zero balance and cannot establish the age of any past approval.

Balance covered is `min(balance, allowance)`, an upper bound from these two reads, not proof that a transfer can execute. Token restrictions, spender logic and other permissions also matter. Exact local BigInt computation produced raw decimal strings `balanceRaw = "0"`, `allowanceRaw = "0"`, and `balanceCoveredRaw = "0"`. Returned metadata supplied 6 decimals and matched the registry. The computed uint256 maximum was `115792089237316195423570985008687907853269984665640564039457584007913129639935`; classification used exact integers without floating-point conversion.

For a personal check, use the public owner address and the exact token/spender contracts whose permissions you intend to review. Changing an allowance would be a separate wallet action outside this lab. Do not send funds to this protocol control. A known spender label is not a safety guarantee.

## Addresses checked

| Role | Label | Full address | Provenance |
|---|---|---|---|
| Token | USDT | `0xdAC17F958D2ee523a2206206994597C13D831ec7` | Exact registry match; issuer source recorded in [registry.md](../registry.md). |
| Spender | Uniswap V3 SwapRouter | `0xE592427A0AEce92De3Edee1F18E0157C05861564` | Exact registry match; original V3 SwapRouter deployment, not SwapRouter02 or Universal Router. Protocol source recorded in [registry.md](../registry.md). |

The owner is the full address in the report above and is the documented V2 Router02 protocol control from the registry.

## Tools used

Seven Alchemy calls: `list_apps` ×1, `select_app` ×1, `ethBlockNumber` ×2, `getTokenBalances` ×1, `getTokenMetadata` ×1, `getTokenAllowance` ×1. Order: list, select, start block, one concurrent batch of balance/metadata/allowance reads, end block. No fallback or retry calls. UTC clock reads and deterministic local arithmetic were not Alchemy calls.

## Gaps

- No observed data-call errors, unsupported methods, billing restrictions, malformed values, missing token results, metadata conflicts, or unknown amounts.
- Only the requested USDT/V3 SwapRouter pair was checked. Other tokens and spenders, NFTs, native ETH, other chains, account delegation, Permit2 downstream application permissions and unsubmitted signed permits were outside coverage. This was not an approval-discovery scan or wallet-wide safety assessment.
- Enhanced methods do not expose a block parameter; the start/end window does not assign every read to either block and does not make the results atomic.
- No positive, unlimited, unknown, fallback, rate-limit, or billing-restriction path was exercised by this successful zero-result integration control.
- No permissions were changed. No resources were created; delivery and cleanup were not applicable to this read-only run.

## Call log

Summarized results, not raw unmodified JSON. All non-secret data-call parameters are preserved. Selection-parameter redaction is explicit: `"[REDACTED]"` below replaces the real selected app ID only in this publication; it was not sent to the tool. App names, account metadata, credentials, metadata URLs and logos are omitted. Admin results were projected to success indicators before display.

1. `list_apps`
   - Parameters: `{}`
   - Outcome: success; account/app details omitted.
2. `select_app`
   - Recorded parameters: `{"app_id":"[REDACTED]"}` — selection-parameter redaction.
   - Outcome: success; previously selected user choice applied, secret/cache details omitted.
3. `ethBlockNumber`
   - Parameters: `{"network":"eth-mainnet"}`
   - Result: `"0x18d2d1e"`.
4. `getTokenBalances` — concurrent batch with calls 5–6.
   - Parameters: `{"address":"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D","contractAddresses":["0xdAC17F958D2ee523a2206206994597C13D831ec7"],"network":"eth-mainnet"}`
   - Result: `{"address":"0x7a250d5630b4cf539739df2c5dacb4c659f2488d","tokenBalances":[{"contractAddress":"0xdAC17F958D2ee523a2206206994597C13D831ec7","tokenBalance":"0x0000000000000000000000000000000000000000000000000000000000000000"}]}`. Matched by token address, not array position; valid raw balance `"0"`.
5. `getTokenMetadata` — same concurrent batch.
   - Parameters: `{"contractAddress":"0xdAC17F958D2ee523a2206206994597C13D831ec7","network":"eth-mainnet"}`
   - Summarized result: `{"name":"Tether USDt","symbol":"USDT","decimals":6}`. Metadata URLs/logo omitted. No registry conflict.
6. `getTokenAllowance` — same concurrent batch.
   - Parameters: `{"contract":"0xdAC17F958D2ee523a2206206994597C13D831ec7","network":"eth-mainnet","owner":"0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D","spender":"0xE592427A0AEce92De3Edee1F18E0157C05861564"}`
   - Result: `"0"`. Valid decimal uint256; status `NONE`.
7. `ethBlockNumber`
   - Parameters: `{"network":"eth-mainnet"}`
   - Result: `"0x18d2d21"`.

## Skill clarity

No ambiguity blocked this run. The prior explicit app choice fit the skill's selection exception. The restricted scope, zero-balance requirement, exact arithmetic and distinction between zero balance and zero allowance were clear. No skill changes were needed for this run.
