# How it works

## The flow

```
 you                agent                 Alchemy MCP server            blockchains
 ───                ─────                 ──────────────────            ───────────
 paste a prompt ──► reads SKILL.md
                    picks a tool ───────► https://mcp.alchemy.com/mcp
                                          (OAuth, your selected app) ──► Ethereum, Base,
                                                                         Polygon, Solana...
                    gets JSON back ◄──────────────────────────────────── 
                    writes the report
 read the report ◄──
```

You never write code. The skill tells the agent which tools to call and in what order. The agent calls them over MCP, gets JSON back, and writes a report you can read.

Lab 5 adds a second flow after explicit consent: **wallet transfer → Alchemy Notify → your HTTPS receiver**. MCP configures and checks the temporary subscription; subsequent events go to the receiver independently of the chat. The receiver is not an Alchemy MCP tool, and a webhook does not wake the agent or send email by itself. No receiver means a read-only transfer preview.

## Concepts

Lab 6 adds a permission check: **public address + named tokens + named spenders → current allowance table**. Balances and permissions are independent. Zero balance does not erase an approval, and a zero allowance only answers for the exact pair read. See [Lab 6](../labs/06-allowance-check/README.md).

Compatibility checked 2026-09-21: [Transaction Simulation is announced for deprecation on September 30, 2026](https://www.alchemy.com/docs/reference/simulation). The simulation descriptions below explain existing Lab 1/2 behavior, not a future availability guarantee. Those paths require migration review; Lab 6 does not depend on them.

**MCP (Model Context Protocol).** An open standard that lets an AI agent discover a server's tools and call them. Claude Code, Cursor, VS Code, Codex and Claude Desktop all speak it.

**Alchemy MCP server.** Alchemy's hosted MCP endpoint. It wraps Alchemy's JSON-RPC, token, NFT, simulation, and Solana APIs as MCP tools. Authentication is OAuth with your Alchemy account.

**App.** A project in the Alchemy dashboard. Each app has an API key and a set of enabled networks. The MCP server routes requests through the app you select with `select_app`. You select once per session.

**Network id.** A string like `eth-mainnet`, `base-mainnet`, `solana-mainnet`. Most tools take one as a parameter. `list_chains` returns the full list.

**Compute units (CU).** Alchemy's usage metric. Every call costs some CU. Free apps have a monthly allowance and a rate limit. The labs here use a few hundred CU per run.

**Free vs PAYG.** Some tools and parameters are paid: NFT spam filters, the Trace API, the Debug API, and event-log queries wider than 10 blocks. They return a 400 that mentions payg, upgrade, or billing, or an error that names the allowed range. The skills skip them and note it under Gaps.

**Address Activity webhook.** A subscription for transfers to or from a list of addresses. Lab 5 uses one Ethereum Mainnet subscription for at most three addresses. RPC calls use `eth-mainnet`; Notify uses `ETH_MAINNET`. Amount thresholds belong in the receiver, not in the creation body. Readback proves configuration, a receiver request proves delivery, and a chain receipt checks the claimed movement; those are different checks.

**Temporary is a cleanup promise.** The Notify creation fields used here have no expiry. Lab 5 records the newly created ID and asks for separate, explicit confirmation before deleting it. Preexisting IDs are protected. A closing chat, a failed verification or a finished observation window does not stop an undeleted webhook.

**Receiver trust.** A public inbox reveals the addresses you chose to follow. A production receiver verifies the raw body's HMAC signature with a privately stored signing key, deduplicates retries and handles reorg removals. No key belongs in the conversation or a reference run. See [Lab 5](../labs/05-watch-a-wallet/README.md) for privacy, bandwidth costs and the no-receiver fallback.

**Proxies.** Many contracts are a thin proxy that forwards every call to an implementation contract stored in a known storage slot. Lab 2 reads those slots with `ethGetStorageAt`. The logic you are trusting lives at the implementation, and it can be upgraded.

**Verified source.** Alchemy decodes simulated calls using Etherscan's ABI when the contract's source is verified there. Lab 2 uses that as a Free-tier "is the source public" signal: probe a common function with `simulateExecution` and see whether the response carries a decoded block.

**Pagination and "page 1 only".** Token, NFT, and transfer lists are paginated and often sorted by address, not by value. The first page of a famous wallet is usually airdropped spam tokens with vanity addresses. The skill labels these results "page 1 only" and never concludes that a token is absent because it did not appear on page 1.

**Multi-chain tools.** Most tools take one `network`. The token balance tools take a `networks` list instead and return one flat array with a `network` field per row, natives first. Lab 3 uses that to read five chains in one call. Two quirks: a network the app lacks is dropped from the response without an error, and Polygon answers as `matic-mainnet` whatever id you sent.

**Native vs ERC-20.** ETH on Ethereum, Base, Arbitrum and OP Mainnet is the chain's own currency, with no contract address; the token tools show it as a row with `tokenAddress` `null`. POL on Polygon is the same, but Polygon also exposes it through a precompile at `0x…1010`, so it shows up twice. WETH and the stablecoins are ERC-20 contracts and have an address per chain; the same symbol at a different address on another chain is a different contract.

**Simulation vs trace.** `simulateAssetChanges` and `simulateExecution` run a transaction against current state without sending it and return the balance changes and events it would produce. They work on Free and are the core of Lab 1. Traces (`traceTransaction`, `debugTraceTransaction`) replay a mined transaction step by step and are paid.

**ENS and namehash.** `vitalik.eth` is an ENS name. Resolving it means calling the ENS registry contract with a 32-byte `namehash` of the name. The hash is keccak256, which language models cannot compute reliably, so the skill computes it with the server's `web3Sha3` tool and then makes two `ethCall`s. The full recipe is in the skill.

**Solana accounts.** Solana has no `ethGetCode`. Every account has an `owner` program, and the owner tells you what the account is: the System program owns wallets, the Token or Token-2022 program owns token accounts and mints, and anything else is a program-owned account such as a PDA or a stake account. A wallet does not hold tokens directly; it owns one token account per mint, and each of those holds a small SOL deposit called rent that comes back when the account is closed. There are two token programs, and a query against only the classic one silently misses Token-2022 balances. Lab 4 covers this.

**Lamports and signatures.** 1 SOL is 10^9 lamports. Transactions are identified by their first signature, an 88-character base58 string, not by a hash. A transaction's balance changes are recorded as `preBalances` and `postBalances` for every account it touched, plus the same for token accounts, so "what did this transaction do" is a subtraction, not a decode.

**Compressed NFTs.** A regular Solana NFT is a token account plus a metadata account, and costs real rent. A compressed NFT is a leaf in a Merkle tree owned by the Bubblegum program; only the tree root lives onchain, and the leaf's data is served by an indexer through the Digital Asset Standard (DAS) API. `getAssetProof` returns the hashes that prove a leaf is in the tree, which a program checks before it lets the asset move. That is why minting one costs a fraction of a cent.

**EIP-7702.** Since the Pectra upgrade an externally owned account can delegate its code to a contract. `ethGetCode` on such an address returns 23 bytes starting with `0xef0100` followed by the delegate address. Signatures from that account are then interpreted by the delegate. The skill flags this as REVIEW so you look at who the delegate is. Vitalik's own address is delegated at the time of writing, which makes it a useful first example.

## Tool map

Alchemy's public MCP documentation describes access to 100+ blockchains. The connected server exposed 173 tools when these labs were validated; counts evolve, so call `list_chains` and inspect the live tool surface rather than relying on a number written down here. Grouped by family, with the ones the labs use in bold:

| Family | Examples | Notes |
|--------|----------|-------|
| Admin | **`ping`**, **`list_apps`**, **`select_app`**, **`list_chains`**, `get_app`, `get_usage_summary` | `select_app` first. No app mutations or gas-policy tools in labs |
| Notify | **`list_webhooks`**, **`get_webhook_addresses`**, **`create_webhook`**, **`delete_webhook`** | Lab 5 only. Creation requires an exact proposal and explicit consent; deletion requires separate confirmation of the new ID. MCP handles configuration and readback; delivery evidence comes from the receiver or Alchemy dashboard. Reads redact secrets |
| JSON-RPC reads | **`ethBlockNumber`**, **`ethGetBalance`**, **`ethGetCode`**, **`ethGetStorageAt`**, **`ethGetTransactionCount`**, **`ethCall`**, **`ethGetTransactionByHash`**, **`ethGetTransactionReceipt`**, **`ethGetLogs`**, `ethGasPrice`, **`web3Sha3`** | Standard Ethereum RPC on any EVM network. Logs are capped at a 10-block range on Free |
| Transfers | **`getAssetTransfers`** | History of ETH, ERC-20, ERC-721, ERC-1155 movements for an address or a token contract |
| Tokens | **`getTokenBalancesByAddress`**, **`getTokensByAddress`**, **`getTokenBalances`**, **`getTokenMetadata`**, **`getTokenAllowance`** | The first two accept multiple networks. Lab 6 uses single-network `getTokenBalances` with an explicit token list, then allowance reads for each selected spender. Enhanced reads are current-state calls, not an atomic snapshot |
| Prices | **`getTokenPricesByAddress`**, **`getTokenPricesBySymbol`**, **`getHistoricalTokenPrices`** | USD from Alchemy's feed. History at 5-minute, hourly or daily intervals, up to a year of daily points. Prices may not exist for every token |
| NFTs | **`getNFTsForOwner`**, **`getContractMetadata`**, `getNFTMetadata`, `getOwnersForContract`, **`isSpamContract`**, `getFloorPrice` | Spam filters are paid |
| Simulation | **`simulateAssetChanges`**, **`simulateExecution`**, `simulateAssetChangesBundle` | Single simulations have a Free path; bundles require PAYG/Enterprise. Deprecation announced for September 30, 2026; see [official FAQ](https://www.alchemy.com/docs/reference/simulation-faqs) |
| Trace / debug | `traceTransaction`, `traceCall`, `debugTraceTransaction`, `debugTraceCall` | Paid |
| Account abstraction | `estimateUserOperationGas`, `getUserOperationReceipt`, `requestGasAndPaymasterAndData` | For ERC-4337 flows, planned lab |
| Solana RPC | **`solana_getEpochInfo`**, **`solana_getAccountInfo`**, **`solana_getTokenAccountsByOwner`**, **`solana_getSignaturesForAddress`**, **`solana_getTransaction`**, `solana_getBalance`, `solana_getProgramAccounts`, `solana_requestAirdrop` | Standard Solana RPC, 50 tools, on `solana-mainnet` and `solana-devnet`. Lab 4. The airdrop tool is devnet-only and the labs never call it |
| Solana enhanced and DAS | **`solana_getPriorityFeeEstimate`**, **`solana_getAssetsByOwner`**, **`solana_getAssetProof`**, `solana_getAsset`, `solana_searchAssets`, `solana_getTokenAccounts` | Priority fees are mainnet-only. The DAS family answers `-32001` on mainnet for Free apps at the time of writing and works on devnet; Lab 4 runs its assets section there. `solana_getAssets`, `solana_getTokenAccounts` and `solana_getAssetSignatures` map to the v2 DAS endpoints |

The server also publishes MCP resources at `alchemy://networks`, `alchemy://networks/evm`, and `alchemy://networks/solana` with the same data as `list_chains`.

## Glossary

- **Calldata**: the hex payload of a transaction. The first 4 bytes select the function, the rest are its arguments.
- **Approve / allowance**: an ERC-20 permission letting a spender move your tokens. "Unlimited" means the maximum uint256.
- **Spender**: the exact address authorized in a token allowance. A dapp can use multiple spender contracts; a brand name alone is not an address.
- **Balance covered**: in Lab 6, the smaller of the observed token balance and allowance for one pair. An upper bound from those reads, not proof of transferability. Do not sum it across spenders.
- **Permit2 layer**: a token's allowance to Permit2 and Permit2's downstream app permissions are separate. Lab 6 reads only the first layer.
- **Mined transaction**: one already included in a block. It has a hash and a receipt. You can inspect it but not change it.
- **Unsigned call**: a transaction you have not signed yet. It can be simulated. This is where a preflight is useful.
- **Receipt**: the result of a mined transaction: success or failure, gas used, and the event logs it emitted.
- **Gaps**: the section of the report that lists what the skill could not verify, and why.
- **Webhook**: an HTTP POST sent by Alchemy to your receiver when subscribed activity occurs; the subscription remains until removed.
- **Replay**: applying an alert rule to historical transfers. Useful without a receiver, but not automatic monitoring or evidence of a delivered event.
- **Teardown**: delete only the resource this run created, after confirmation of its exact ID, and verify its absence.
