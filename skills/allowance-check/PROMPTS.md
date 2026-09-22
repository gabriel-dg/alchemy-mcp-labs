# allowance-check prompts

Run these from the repo folder after [SETUP.md](../../SETUP.md). Published live inputs are a documented protocol contract and the zero address, not individual wallets. These are integration controls, not protocol audits or endorsements. Current balances and permissions can change.

## A. A neutral live protocol control

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Explain the result in plain language and state exactly what was checked.

Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Network: eth-mainnet
Tokens: default
Spenders: default
```

## B. One token, one spender

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Explain what a zero balance does and does not say about an approval.

Address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
Network: eth-mainnet
Tokens: USDT
Spenders: Uniswap V3 SwapRouter
```

## C. The zero-address control

```text
Read skills/allowance-check/SKILL.md in this repo and follow it exactly. List Alchemy apps and select one; ask me if several exist. Use only the allowed read tools. Never sign, send, broadcast, approve, or revoke. Keep every requested pair in the report, including zero or unknown values. Do not turn an all-zero result into a wallet-wide safety verdict.

Address: 0x0000000000000000000000000000000000000000
Network: eth-mainnet
Tokens: USDC
Spenders: Uniswap V2 Router02
Format: markdown+json
```

## Try your address privately

Copy A and replace only `Address:` with your public Ethereum address. No wallet connection, seed phrase, private key, deposit or signature is needed. You can ask for the report in your preferred language. An all-zero report can mean you use different tokens, contracts or networks.

For a custom list, replace `Tokens:` or `Spenders:` with one to three comma-separated Ethereum addresses. Each list replaces that side of the defaults. Use exact addresses from the application's documentation or approval details in your wallet, not a brand name. This version covers Ethereum mainnet only.

For machine-readable output, add `Format: markdown+json`. Raw amounts are strings; failed reads remain null.

The live owner in A/B is Uniswap V2 Router02, documented in registry.md, not a personal wallet. C uses the zero address as a neutral control. Do not send funds to either address. Active-permission illustrations use offline fictional data. Do not commit personal-wallet reports, app identifiers or account metadata.
