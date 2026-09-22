# Lab 2: contract inspector

Compatibility note (2026-09-21): the decoded-ABI probe uses `simulateExecution`, part of the [Transaction Simulation APIs announced for deprecation on September 30, 2026](https://www.alchemy.com/docs/reference/simulation). That signal needs migration review; an unavailable probe cannot establish verified source. Other read paths and dated examples are separate from that availability question.

## Goal

Answer "what is this address?" without leaving your agent. You give it an address and get back its type, identity, a table of trust signals, red flags, and one of four assessments: **ESTABLISHED**, **UNCERTAIN**, **RED FLAGS**, or **NOT A CONTRACT**.

This is the natural follow-up to Lab 1. Every REVIEW verdict there ends with an address you are told to look at. This lab looks at it.

The playbook the agent follows is [skills/contract-inspector/SKILL.md](../../skills/contract-inspector/SKILL.md). Everything runs on the Free tier. Nothing is signed or sent.

## What the agent checks

| Signal | How | Why it matters |
|--------|-----|----------------|
| Has code | `ethGetCode` | No code means no contract. An approval to it is an approval to whoever holds the key. |
| Proxy | `ethGetStorageAt` on three known slots | Upgradeable contracts hide their logic behind an implementation address. |
| Verified source | `simulateExecution` decodes with the Etherscan ABI only when the contract is verified | Free-tier stand-in for "is the source public". |
| Token identity | `getTokenMetadata`, `getContractMetadata` | Name, symbol, decimals, logo, NFT type, spam classification. |
| Price feed | `getTokenPricesByAddress` | A price means an index listing and a market. |
| Counterfeit | symbol compared with a table of canonical addresses | The "ETH" and "USDC" clones that show up in wallet histories. |
| Age and last activity | `getAssetTransfers` first and last | A token whose whole life fits in one afternoon is a spam drop. |
| Activity now | `ethGetLogs` over the last 5 blocks | Free tier allows a 10-block window. Enough to see if a contract is busy. |

## Before you start

- [SETUP.md](../../SETUP.md) done and [Lab 0](../00-hello-mcp/README.md) passed
- This repo open in your agent
- Claude Code users: the repo's `.claude/settings.json` pre-approves every tool this lab uses, so you will not be asked to confirm each call. Other agents may ask once per tool; say yes.

## Run it

Pick one. Paste the block. The agent selects an app if needed, makes the tool calls, and prints the report. A contract takes 12 to 15 calls. An address with no code (E) takes about 4: the skill's not-a-contract branch reads code, nonce, balance and the first transfer, then stops.

### A. Uniswap Permit2

```text
Read skills/contract-inspector/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Address: 0x000000000022D473030F116dDEE9F6B43aC78BA3
Network: eth-mainnet
```

### B. USDC (a proxy)

```text
Read skills/contract-inspector/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Address: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
Network: eth-mainnet
```

### C. A counterfeit "ETH" token

```text
Read skills/contract-inspector/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Address: 0xcbb23e2ee87384799c45508c8a5ccaa6c611dd48
Network: eth-mainnet
```

### D. The EIP-7702 delegate from Lab 1

```text
Read skills/contract-inspector/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Address: 0x5a7fc11397e9a8ad41bf10bf13f22b0a63f96f6d
Network: eth-mainnet
```

### E. The spender from Lab 1's approve

```text
Read skills/contract-inspector/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Address: 0x1111111111111111111111111111111111111111
Network: eth-mainnet
```

## What you should see

Every run produces the same shape:

```markdown
# Contract inspector
- **Address**
- **Network**
- **Type**
- **Identity**
- **Signals** (table)
- **Red flags**
- **Assessment:** ESTABLISHED | UNCERTAIN | RED FLAGS | NOT A CONTRACT
- **What to do next**
- **Tools used (in order)**
- **Gaps**
```

Values observed on 2026-09-07. Full cold-run reports with every tool call are in [skills/contract-inspector/examples/](../../skills/contract-inspector/examples/).

**A, Permit2.** Contract, no proxy. The verified-source probe matches on `DOMAIN_SEPARATOR` after `name` and `owner` revert. Not a token. Busy: several events in a 5-block window. First inbound transfer seen 2023. Expected: **ESTABLISHED**.

**B, USDC.** Proxy. The EIP-1967 slot is empty but the legacy slot holds the implementation `0x4350…02dd`. The probe decodes `name()` as "USD Coin" through a `DELEGATECALL`. Token metadata with logo, price about one dollar, first transfer 2018. Expected: **ESTABLISHED**, with the proxy explained.

**C, counterfeit ETH.** Contract, no proxy, unverified: `name()` returns data that Alchemy cannot decode, so the function exists with no Etherscan ABI behind it. Token metadata says name "ETH", symbol "ETH", no logo. No price. First and last transfers both on 2026-06-24, two hours apart, nothing since. Expected: **RED FLAGS** for a native-asset symbol on an ERC-20 plus a burst pattern.

**D, the delegate.** Contract, no proxy, no ABI match on three probes, so "could not confirm" rather than unverified. Not a token. Zero events in the window. First inbound transfer 2025-10. Expected: **UNCERTAIN**: it exists and is used, but nothing on Free lets the agent say what it is. The quiet activity signals are not evidence against it — a delegate executes in the delegating account's context, so its own address is expected to look idle.

**E, the spender.** Code `0x`, nonce 0, and it holds about 5.7 ETH that people have sent to it by mistake. Expected: **NOT A CONTRACT**.

## Reading the output

- **Type** is the structural answer. Contract, proxy, delegated account, or nothing. Read it first.
- **Signals** is the evidence. Each row is one tool call. When the assessment surprises you, this table says why.
- **Verified source** is a heuristic, and it has two distinct outcomes. When a probe *returns data* but Alchemy decodes nothing, the function exists and Etherscan has no ABI for it: that is a genuine **unverified**. When all three probes come back empty, you have learned only that `name()`, `owner()` and `DOMAIN_SEPARATOR()` are absent, which a verified contract with a different ABI would also produce: report that as **could not confirm**. Scenario C is the first case, scenario D the second.
- **Assessment.** ESTABLISHED means widely used and verifiable, not safe. UNCERTAIN means the Free-tier signals ran out; a block explorer is the next step. RED FLAGS means at least one signal is the shape of a scam. NOT A CONTRACT means an approval or a send goes to a person, not to code.
- **What to do next** is the one sentence to act on.

## Try your own

**The address from a Lab 1 REVIEW.** Copy the spender, delegate, or recipient the report named and paste it as `Address:`. That is the intended loop.

**A token someone is shilling.** Paste its contract address. Scenario C shows what a fake looks like; a real one shows a logo, a price, and a long transfer history.

**A dapp's contract before you connect.** Copy the contract address from the wallet popup. Scenario A is what a well-known protocol looks like.

**Another network.** Change `Network:` to `base-mainnet` or `arb-mainnet`. The counterfeit table only covers Ethereum mainnet addresses; the native-asset rule still applies. The app must have the network enabled.

**Install as a skill (Claude Code).** Inside this repo, type `/contract-inspector 0x…`. To use it anywhere, copy `skills/contract-inspector/` into `~/.claude/skills/`.

## Now build it

An identity check is Token API metadata, two storage reads, and a simulation probe for the verified-source signal. Wire it into a spender allowlist, a token-listing review, or an approval screen:

- [Token API quickstart](https://www.alchemy.com/docs/reference/token-api-quickstart) - balances and metadata over HTTP
- [Transaction Simulation](https://www.alchemy.com/docs/reference/simulation) - the decoded-response trick this lab uses to tell verified source from opaque bytecode
- [Free tier](https://www.alchemy.com/pricing) - 30M compute units a month

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ethGetLogs` fails with a block-range message | The Free tier allows a 10-block range. The skill uses 5. If the agent widened it, tell it to use latest minus 4 to latest. |
| `getTokenMetadata` errors with "expected a valid token contract" | Expected for non-token contracts. The skill falls back to NFT metadata, then to "non-token contract". |
| Verified-source probe says no match on a contract you know is verified | The contract has none of `name()`, `owner()`, `DOMAIN_SEPARATOR()`, so the probe cannot see its ABI. Report it as "could not confirm", not "unverified". |
| Huge bytecode floods the output | Server truncation is normal. Non-empty means "has code". The agent should not paste bytecode into the report. |
| Agent cannot find the skill file | The repo is not the working directory. Open the repo folder in your agent, or paste the contents of `SKILL.md` into the prompt. |
