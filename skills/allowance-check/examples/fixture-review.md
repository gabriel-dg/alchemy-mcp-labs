# Offline behavioral checks

All balances, allowance outcomes and error responses below are synthetic. Owner values are offline test identifiers; protocol labels and registry addresses exercise label handling only. Do not query the fixture owners, attribute them to people, or present these synthetic permissions as real findings for any address or protocol.

Independent fixture-based evaluation, 2026-09-21, on skill **v0.1.0**. This is a summarized evaluation record, **not a live cold run**, a wallet finding or an actual API call log. A fresh agent read the skill and registry, received the synthetic inputs below and produced a report plus JSON. No Alchemy calls or mutations occurred. It computed amounts and counts with a deterministic JavaScript BigInt tool.

## Mixed permissions, zero balance and a failed read

Fixture owner: `0x1234567890abcdef1234567890abcdef12345678`. Network: `eth-mainnet`. Default token/spender lists from [the registry](../registry.md), with `Format: markdown+json`. Fixture app selection was assumed, not performed. Fixture time `2026-09-21T23:40:00Z`, start block `0x1800000`, end block `0x1800001`.

Metadata decimals: USDC 6, USDT 6, WETH 18. Raw balances: USDC `0x0`, USDT `0x2faf080`, WETH `0x1`. Allowance inputs below are decimal base units; max means `2^256 - 1`, calculated exactly as `115792089237316195423570985008687907853269984665640564039457584007913129639935`.

| Token | Spender | Raw allowance fixture | Observed report status | Formatted balance covered |
|---|---|---|---|---|
| USDC | V2 Router02 | max | UNLIMITED | 0 |
| USDC | V3 SwapRouter | `1500000` | LIMITED, 1.5 USDC | 0 |
| USDC | Permit2 | `0` | NONE | 0 |
| USDT | V2 Router02 | `100000000` | LIMITED, 100 USDT | 50 USDT |
| USDT | V3 SwapRouter | `15000000` | LIMITED, 15 USDT | 15 USDT |
| USDT | Permit2 | max | UNLIMITED | 50 USDT |
| WETH | V2 Router02 | `1` | LIMITED | 0.000000000000000001 WETH |
| WETH | V3 SwapRouter | HTTP 400: `upgrade to PAYG required` | UNKNOWN | Unknown |
| WETH | Permit2 | `0` | NONE | 0 |

The independent report retained all nine pairs: **six active, two zero, one unknown**; allowance coverage **8/9 known**. Both positive USDC permissions were explicitly described as remaining with zero balance. It did not sum balance coverage, round the one-unit WETH amount to zero, or attempt a fallback for the billing error. All Permit2 rows were limited to the token-to-Permit2 layer. JSON used decimal strings and preserved the failed allowance and coverage as `null`.

The report distinguished the fixture workflow's 17 conceptual calls from **zero actual Alchemy calls**. It did not claim live connectivity, tier support, onchain permission changes, resource creation or cleanup.

## Missing balance is not zero

A second offline request used one custom token `0x1234567890abcdef1234567890abcdef12345678`, spender `0x2222222222222222222222222222222222222222`, and owner `0x1111111111111111111111111111111111111111` on `eth-mainnet`.

Fixtures: metadata unsupported; enhanced balances omit the requested token and instead include an unrelated token with zero balance; the one permitted balance fallback returns empty `0x`; allowance succeeds with decimal `"0"`.

The evaluator ignored the unrelated token, kept balance and decimals unknown, and produced:

```json
{
  "status": "NONE",
  "balanceRaw": null,
  "allowanceRaw": "0",
  "balanceCoveredRaw": null,
  "decimals": null,
  "knownAllowances": 1,
  "unknownAllowances": 0
}
```

Its fallback arguments, produced through deterministic address padding, were:

```json
{
  "network": "eth-mainnet",
  "to": "0x1234567890abcdef1234567890abcdef12345678",
  "data": "0x70a082310000000000000000000000001111111111111111111111111111111111111111",
  "blockNumber": "latest"
}
```

These were inspected arguments, not an executed call. Empty `0x` stayed unknown; there was no second balance fallback, allowance fallback or metadata fallback. The only remaining conceptual data call was the closing block number.

## Boundary cases

- **Max minus one:** exact raw allowance `115792089237316195423570985008687907853269984665640564039457584007913129639934` remained LIMITED. With balance one base unit and 18 decimals, coverage remained exactly `0.000000000000000001`.
- **Other network:** a request for `base-mainnet` with the default registry stopped before data queries rather than reusing Ethereum addresses.
- **No invented observation:** missing block/time fixtures were not replaced with fabricated observations.

## Changes informed by the review

Skill **v0.1.1** makes three instructions explicit: compute amounts with a deterministic local tool, put the finding sentence first in the report template, and validate input/network/list bounds before unnecessary app-selection calls. These are the differences between the fixture-tested version and the live-run version. The normal token/spender list and classification rules did not change.

The tests do not establish actual quota-denial behavior, fallback endpoint availability, account tier, or a live zero-balance permission. Those boundaries remain distinct from successful live reads.
