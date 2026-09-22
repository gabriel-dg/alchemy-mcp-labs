# Local computation

This helper performs exact arithmetic only. It has no dependencies beyond Node.js, makes no network requests, and never signs, changes permissions, or writes files.

Use it after unwrapping actual tool responses. Error text is not an amount. Apply the skill's retry/fallback rules first; pass the final usable integer string or null. Preserve original failures, fallback provenance, observation times and the invocation ledger separately.

## Input

Pass an object to the exported analyzeMatrix function, or JSON to the script's standard input:

| Field | Meaning |
|---|---|
| owner | The full user-supplied address |
| network | eth-mainnet |
| tokens | Selected tokens: objects with address, balanceRaw and decimals |
| spenders | Selected full spender addresses |
| allowances | Final outcomes: objects with token, spender and allowanceRaw |

Match balances to token addresses before constructing tokens; never use response position. Amounts must be unsigned decimal strings or explicitly prefixed hex strings. Do not pass JavaScript numbers. A failed or absent amount is null. Decimals come from successful metadata reads, otherwise null. Deduplicate each selected list case-insensitively before calling; each must contain one to three entries.

The allowance array can be in any order. Missing pairs become UNKNOWN. Duplicate pair results or results outside the selected lists are rejected to catch ambiguous joins; resolve retry/fallback attempts into one final result while retaining the attempts in the separate ledger.

Keep private input in memory or outside the repository. Never add a live user's input or result to the fixture tests.

## Output

The helper emits owner, network, coverage counts, a summary and every selected token/spender row. Rows contain canonical decimal raw strings (or null), status, covered amount, display amounts and an observation code for positive permissions with zero, unknown or positive balance.

Use display values for the readable report, translated as needed. Add the token unit explicitly. A null display means unknown, not zero. With unknown decimals, display raw base units. Unlimited is shown as a status, not an enormous formatted token amount.

The output is not the complete report JSON schema. For markdown+json, map the computed fields into the schema in SKILL.md, then add observedAt, blockStart, blockEnd, atomicSnapshot, Permit2 boundaries, notes and gaps from the actual run. The helper neither infers history nor supplies a safety verdict. It does not determine token identity from metadata.

## Run and verify

The CLI accepts JSON on stdin and writes computed JSON to stdout. It exits nonzero on invalid scope or ambiguous inputs. It can also be imported from a local JavaScript tool without a temporary file.

From the repository root, run the offline tests:

    node --test skills/allowance-check/scripts/compute.test.mjs

Tests use explicitly synthetic addresses and amounts only. They exercise all four statuses, zero-balance permissions, unknown balance/allowance, exact tiny quantities, uint256 boundaries, reordered results, case-insensitive joins, and invalid scope. They also check the stdin CLI and import in a JavaScript runtime without a global process object. They test computation, not live connectivity, quota behavior, the final narrative, or terminal rendering.
