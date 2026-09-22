# alchemy-mcp-labs

Hands-on labs for **Alchemy MCP**: give your coding agent (Claude Code, Cursor, VS Code, Codex) live read access to 100+ blockchains, then use it for something useful.

**New: [Lab 6 — what can still spend your tokens?](labs/06-allowance-check/README.md)** Try neutral live controls, then check your own token permissions privately. No wallet connection or signature. [Live validation status](skills/allowance-check/examples/README.md).

Compatibility note, 2026-09-21: Alchemy has [announced Transaction Simulation deprecation for September 30](https://www.alchemy.com/docs/reference/simulation). Lab 1's unsigned-calldata scenario and Lab 2's decoded-ABI probe depend on it and need migration review. Lab 6 does not use simulation.

## You paste this

```text
/multichain-brief 0x1111111111111111111111111111111111111111
```

That is the Claude Code form. In any other MCP agent you paste the four-line prompt from [Lab 3](labs/03-multichain-brief/README.md) instead, with the address at the bottom.

## Your agent answers this

| Network | Balance | Price | USD |
|---------|---------|-------|-----|
| `eth-mainnet` | 5.717181 ETH | $2,497.33 | $14,277.69 |
| `base-mainnet` | 0.353822 ETH | $2,497.33 | $883.61 |
| `arb-mainnet` | 0.004091 ETH | $2,497.33 | $10.22 |
| `opt-mainnet` | 0.001816 ETH | $2,497.33 | $4.54 |
| `matic-mainnet` | 32.833741 POL | $0.0974 | $3.20 |

**Total $15,179.25.** Five chains read in one request, with the 7-day move on what it holds: ETH +0.9%, POL +4.9%.

Nobody owns that address. Its nonce is zero, so it has never sent a transaction. People just keep paying into it by mistake, on every chain, and airdrop spam finds it anyway: three of the tokens on page one have a URL in the symbol.

Real [Lab 3](labs/03-multichain-brief/) output, observed 2026-09-08. Six tool calls, about twenty seconds. **No code, no API key, no RPC URLs.**

## Why bother

**Alchemy MCP** is a hosted server that exposes Alchemy's blockchain APIs as tools an AI agent can call. **MCP** (Model Context Protocol) is the open standard that lets agents discover and call those tools. You connect once, over OAuth, with your Alchemy account.

What that buys you over pointing an agent at a public RPC node:

- **One endpoint, 100+ chains.** Ethereum, major L2s, Solana, and more. No per-chain URLs to collect, rotate, or paste into a config file. Lab 4 briefs a Solana wallet over the same connection you used for Ethereum.
- **One request, five chains.** The table above is a single `getTokensByAddress` call with a `networks` list: balances, metadata and USD prices come back together, already joined. That is Lab 3.
- **More than JSON-RPC.** Token balances and metadata, USD prices with a year of daily history, NFTs, transfer history, and transaction simulation that shows what an unsigned transaction would do *before* you sign it. That last one is Lab 1.
- **Events after the chat closes.** Lab 5 prepares an Address Activity webhook for a wallet you choose. With a public receiver and explicit consent, Alchemy delivers transfers automatically; without one, rehearse the alert on real history.
- **Permissions that outlast a balance.** Lab 6 checks existing allowances against a small list of token/spender pairs, including tokens with zero balance. Paste a public address and see exactly what was checked.
- **No API keys to configure.** OAuth, and the server routes through the app you select. Lab 5 also explains how to keep webhook signing keys out of reports and commits.

This repo gives you:

- **Labs** in `labs/`: step-by-step walkthroughs you run by pasting a prompt into your agent. Each one tells you what to expect, how to read the result, and how to adapt it to your own wallet or transaction.
- **Skills** in `skills/`: reusable playbooks that tell the agent exactly which tools to call and how to report. Labs use them. You can also install them so your agent runs them by name.

All labs except Lab 5 are read-only. **Lab 5 is the only exception:** one temporary webhook, explicit creation consent, and separately confirmed teardown by ID. Nothing signs, sends, or broadcasts a transaction.

## Who this is for

- Developers who want to see what Alchemy MCP does before writing integration code
- Anyone using a coding agent who wants live onchain data inside their workflow
- People who want a second opinion before signing a transaction

You do not need to know Solidity. You need a free Alchemy account and an agent that supports MCP.

## Quick start

**First live result: five minutes.** The seven-lab track is designed for about seventy-five minutes, including Lab 5 cleanup. After Lab 0, you can jump directly to the use case that interests you; Lab 6 does not require the earlier wallet labs.

1. **Get the repo**:

   ```bash
   git clone https://github.com/gabriel-dg/alchemy-mcp-labs.git
   cd alchemy-mcp-labs
   ```

2. **Connect** your agent to `https://mcp.alchemy.com/mcp` and pick one Alchemy app. Follow [SETUP.md](SETUP.md). Run the connect command from inside the repo folder, or the server may not be visible when you open it.
3. **Open the repo** in your agent: run `claude` (or your agent's equivalent) from the repo folder, or open the folder in Cursor, VS Code, or another MCP client. The prompts reference files by path, so the agent needs to be inside the repo.
4. **Run Lab 0**: paste the prompt from [labs/00-hello-mcp](labs/00-hello-mcp/README.md). Five tool calls that prove the connection works.
5. **Run Lab 1**: paste a prompt from [labs/01-before-you-sign](labs/01-before-you-sign/README.md). A real pre-sign safety report on a wallet, a mined transaction, or unsigned calldata.
6. **Run Lab 2**: paste a prompt from [labs/02-contract-inspector](labs/02-contract-inspector/README.md) on an address Lab 1 told you to look at. That loop is the point of the pair.
7. **Run Lab 3**: paste a prompt from [labs/03-multichain-brief](labs/03-multichain-brief/README.md). The same address on five chains, in dollars, from one call.
8. **Run Lab 4**: paste a prompt from [labs/04-solana-wallet-brief](labs/04-solana-wallet-brief/README.md). A Solana wallet in dollars, its newest transaction in one sentence, and its NFTs. Same connection, other VM. Needs Solana enabled on your app.
9. **Run Lab 5**: paste a prompt from [labs/05-watch-a-wallet](labs/05-watch-a-wallet/README.md). Watch a wallet through a temporary webhook, with explicit consent and teardown. No public receiver? Rehearse a 100,000 USDC treasury alert against a real transfer instead.
10. **Run Lab 6**: paste a prompt from [labs/06-allowance-check](labs/06-allowance-check/README.md). Check existing spending permissions, then change one line to use your own public Ethereum address. The published demos use neutral controls; keep personal-wallet results private. The report does not scan every approval.

## Labs

| # | Lab | Time | What you learn |
|---|-----|------|----------------|
| 0 | [hello-mcp](labs/00-hello-mcp/) | 5 min | Connection check. Select an app, list networks, read a block number and a balance. |
| 1 | [before-you-sign](labs/01-before-you-sign/) | 15 min | Preflight a wallet (ENS or address), inspect a mined transaction, or **simulate unsigned calldata** and get an **OK / REVIEW / DO NOT SIGN** verdict. Runs on the Free tier. |
| 2 | [contract-inspector](labs/02-contract-inspector/) | 10 min | Answer "what is this address?": type, proxy, verified source, token identity, price, age, activity, and an **ESTABLISHED / UNCERTAIN / RED FLAGS / NOT A CONTRACT** assessment. The follow-up to every Lab 1 REVIEW. |
| 3 | [multichain-brief](labs/03-multichain-brief/) | 10 min | One call, every chain, in dollars. Native and token balances for an address or ENS name across Ethereum, Base, Arbitrum, OP Mainnet and Polygon, a USD total with a coverage line, a watchlist for tokens page 1 cannot see, and the 7-day price change. |
| 4 | [solana-wallet-brief](labs/04-solana-wallet-brief/) | 10 min | Same brief, other VM. SOL and tokens in dollars, a watchlist by mint, the last five signatures, the newest transaction decoded into one sentence (who signed, what moved), and NFTs including compressed ones via DAS. Paste a signature instead of an address to decode any transaction. Assets run on devnet until DAS opens on mainnet for Free apps. |
| 5 | [watch-a-wallet](labs/05-watch-a-wallet/) | 15 min | From a wallet address to an automatic HTTP event. Preview transfers, explicitly consent to one temporary Address Activity webhook, verify configuration and receiver evidence, then confirm teardown by ID. Includes a reproducible USDC alert rehearsal without a receiver and a redacted receiver-backed validation run. |
| 6 | [allowance-check](labs/06-allowance-check/) | 10 min | What can still spend your tokens? Check USDC, USDT and WETH against three named spenders, explain permissions that remain at zero balance, and export optional JSON. Read-only; explicit partial coverage. See [validation status](skills/allowance-check/examples/README.md). |

## What a lab looks like

Every lab README has the same sections: **Goal**, **Before you start**, **Run it** (a prompt to paste), **What you should see**, **Reading the output**, **Try your own**, **Now build it**, **Troubleshooting**. When a lab uses a skill, the skill folder holds the agent playbook (`SKILL.md`), the copy-paste prompts (`PROMPTS.md`), and reference runs with real observed values (`examples/`).

## Repo map

```
labs/                  walkthroughs for humans (start here)
  00-hello-mcp/
  01-before-you-sign/
  02-contract-inspector/
  03-multichain-brief/
  04-solana-wallet-brief/
  05-watch-a-wallet/
  06-allowance-check/
skills/                playbooks for agents (what a lab runs)
  before-you-sign/
  contract-inspector/
  multichain-brief/
  solana-wallet-brief/
  watch-a-wallet/
  allowance-check/
docs/how-it-works.md   how the pieces fit, glossary, tool map
SETUP.md               connect your agent, create an app, Free vs paid
CLAUDE.md              entry point for Claude Code when it opens this repo
CONTRIBUTING.md        how to add a lab or a skill
```

## Roadmap

Planned, not yet in the repo. Labs 1 and 2 are the **safety** track; Labs 3 and 4 are the **explore** track, one for EVM chains and one for Solana. Lab 5 opens **operate** with Notify webhooks. Lab 6 brings existing permissions into that workflow. New labs must verify their own Free-tier behavior before release.

| # | Lab | One-line hook | Tool family it introduces |
|---|-----|---------------|---------------------------|
| 7 | **wallet-checkup** | One prompt that composes wallet, contract and allowance checks into a single report, after the simulation-dependent paths have been reviewed. | Agent orchestration, no new tools |
| 8 | **nft-collection-brief** (redesign) | Explore a collection's identity, holders and metadata using supported endpoints. Scope to be revalidated before implementation. | NFT API |

**allowance-check** moves from 7 to 6 because existing permissions are a useful first experiment with a personal address. The former NFT plan relied on rarity/attribute endpoints included in Alchemy's [September 30, 2026 retirement notice](https://www.alchemy.com/docs/changelog/2026/8/18); that plan needs redesign rather than copying the old tool list.

Dropped from the earlier list: **token-check**, because Lab 2 already covers metadata, price, counterfeit detection, and burst patterns for a token address. **aa-session-lab** is folded into a possible Lab 1 appendix that explains a UserOp by hash, read-only. Usage and cost tools are a step in Lab 0 rather than a lab of their own. **solana-wallet-brief** moved up from 5 to 4 and shipped, because it is the one lab that turns "labs for Ethereum" into "one MCP, two VMs".

**watch-a-wallet** moved from 8 to 5 to introduce automatic delivery immediately after the wallet briefs. Its release records live transfer reads, a deterministic no-receiver fallback, and a redacted end-to-end creation, delivery and teardown run; see its [validation evidence and remaining boundaries](skills/watch-a-wallet/examples/validation.md).

## Links

- [Alchemy MCP server docs](https://www.alchemy.com/docs/alchemy-mcp-server) - the server these labs talk to
- [Alchemy dashboard](https://dashboard.alchemy.com) - create a free app, watch your compute units
- [Alchemy API reference](https://www.alchemy.com/docs/reference/api-overview) - the same data over HTTP, for when you move from asking to shipping
- [Model Context Protocol](https://modelcontextprotocol.io) - the open standard underneath

## License

MIT. See [LICENSE](LICENSE).
