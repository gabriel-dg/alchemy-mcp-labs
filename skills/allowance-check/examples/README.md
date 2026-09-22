# allowance-check reference runs

Validated on **2026-09-22 UTC**, network **eth-mainnet**, skill **v0.1.2**. Three independent fresh agents used only the published prompt, skill, registry and the user's prior app choice. Public logs redact account identifiers; data-call parameters and relevant results are preserved.

| Run | Alchemy calls | Observed result |
|---|---:|---|
| [A. Protocol control](protocol-control.md) | 17 | Protocol-contract owner; all three token balances zero and all nine allowances NONE |
| [B. One protocol pair](protocol-one-pair.md) | 7 | Same protocol owner; USDT balance zero, V3 SwapRouter allowance NONE |
| [C. Zero-address control](zero-address.md) | 7 | Zero-address owner; USDC balance zero, V2 Router02 allowance NONE; includes JSON |

All **31 live calls succeeded**, without retries or RPC fallback. These are current observations across calls, not atomic snapshots. No permission or account resource was changed. The owners are neutral integration controls, not individual wallets, deposit destinations or subjects of a protocol audit.

Positive and unknown permission states are illustrated only with [explicit offline fixtures](fixture-review.md). Do not present those synthetic outcomes as real findings for any address or protocol.

- [Validation and limits](validation.md): live coverage, offline coverage and local checks.
- [Publication review](publication-review.md): privacy scope and publication boundaries.

Earlier unpublished draft reports were withdrawn and replaced with fresh neutral runs, not edited to attribute old observations to new addresses. Labs 0–5 and repository history are outside this cleanup.

Use [PROMPTS.md](../PROMPTS.md) to reproduce the controls. Keep personal-wallet reports private and do not commit app identifiers or credentials.
