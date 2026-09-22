# Lab 1: before you sign

Compatibility note (2026-09-21): Alchemy [announces Transaction Simulation deprecation for September 30, 2026](https://www.alchemy.com/docs/reference/simulation). Scenario B depends on those endpoints and needs migration review. The dated examples below document earlier behavior; do not treat an unavailable simulation as a successful preflight. [Lab 6](../06-allowance-check/README.md) reads existing permissions without simulation.

## Goal

Get a read-only safety briefing from your agent before you sign something. You give it one of three inputs and it returns a report with asset changes, risk flags, and a verdict: **OK**, **REVIEW**, or **DO NOT SIGN**.

| Scenario | Input | What the agent does |
|----------|-------|---------------------|
| **A. Wallet** | ENS name or address | Resolves the name, checks for EIP-7702 delegation, reads balance, tokens, recent transfers, NFTs |
| **B. Unsigned calldata** | `to` address plus hex calldata | **Simulates** the transaction with `simulateAssetChanges` and `simulateExecution` and reports what would change |
| **C. Mined transaction** | tx hash | Reads the transaction and receipt and explains what happened |

Scenario B is the one that matters. It is the difference between guessing what a wallet popup will do and seeing it. Everything runs on the Free tier. Nothing is signed or sent.

The playbook the agent follows is [skills/before-you-sign/SKILL.md](../../skills/before-you-sign/SKILL.md).

## Before you start

- [SETUP.md](../../SETUP.md) done and [Lab 0](../00-hello-mcp/README.md) passed
- This repo open in your agent, so it can read the skill file by path
- Claude Code users: the repo's `.claude/settings.json` pre-approves the read-only Alchemy tools this lab uses, so you will not be asked to confirm each call. Other agents may ask once per tool; say yes.

## Run it

Pick one scenario. Paste the block. The agent selects an app if needed, makes the tool calls, and prints the report. Cost varies by branch: explaining a mined transaction (C) takes about 6 calls, simulating calldata (B) about 11, and a wallet briefing (A, A2) 15 to 19, because it resolves the name and then reads tokens, transfers and NFTs.

### A. Wallet briefing for `vitalik.eth`

```text
Read skills/before-you-sign/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Input: vitalik.eth
Network: eth-mainnet
```

### A2. Wallet briefing for `nick.eth` (a plain account)

Same prompt, different wallet. `vitalik.eth` lands on REVIEW because of a delegation. This one is an ordinary account and should land on OK, so you can see both ends of the scale.

```text
Read skills/before-you-sign/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast.

Input: nick.eth
Network: eth-mainnet
```

### B. Simulate an unlimited USDC approve (the useful one)

This calldata approves an unlimited USDC allowance to `0x1111…1111`, an address that has no code and no known owner. It is a realistic phishing shape. Simulating it is harmless. `From` is a throwaway address with no code and no balance; an approve simulates fine without one.

```text
Read skills/before-you-sign/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Never sign, send, or broadcast. This is unsigned calldata: you must simulate it.

Network: eth-mainnet
From: 0x1234567890abcdef1234567890abcdef12345678
To: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
Value: 0
Calldata: 0x095ea7b30000000000000000000000001111111111111111111111111111111111111111ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
```

### C. Explain a mined transaction

```text
Read skills/before-you-sign/SKILL.md in this repo and follow it exactly. Select an Alchemy app first if none is selected. Use only the tools the skill allows. Do not call trace or debug tools.

Input: mined transaction 0xcdca6219c1c3f2e34b9c0a20347a6338219663aa9acd7adb1426fdabda0267d7
Network: eth-mainnet
```

## What you should see

Every run produces the same report shape:

```markdown
# Before you sign
- Input
- Network
- One-sentence summary
- Asset changes (table)
- Risk flags
- Gas / fee snapshot
- Verdict: OK | REVIEW | DO NOT SIGN
- Tools used (exact MCP names, in order)
- Gaps
```

Values observed on 2026-09-07. Each scenario was run cold by an agent that saw only the prompt and the skill file. The full reports, with every tool call and its parameters, are in [skills/before-you-sign/examples/](../../skills/before-you-sign/examples/). A run takes 6 to 19 tool calls and one to three minutes, depending on the branch. Those counts are from cold runs, one scenario per session. Running several scenarios back to back in one session is cheaper, because the agent reuses reads it has already made and says so under Gaps.

**Scenario A** resolves `vitalik.eth` to `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` through `web3Sha3` and two `ethCall`s. `ethGetCode` returns `0xef01005a7fc1…96f6d`, an EIP-7702 delegation to `0x5a7fc11397e9a8ad41bf10bf13f22b0a63f96f6d`. Balance about 6.7 ETH. Page 1 of transfers is vanity spam tokens named "Vitalik" and "<3" sent to the zero address. Expected verdict: **REVIEW**, because of the delegation. That is not an accusation. It means "look at who the delegate is before trusting a signature from this account".

**Scenario A2** resolves `nick.eth` to `0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5`. `ethGetCode` returns `0x`, a plain account. Balance about 9.2 ETH. Page 1 of outbound transfers shows tokens named "ETH" with lookalike spellings sent to addresses that mimic a real recipient. That is address poisoning aimed at the wallet, not activity by its owner. Expected verdict: **OK**, with the spam pattern listed under Risk flags.

**Scenario B** returns one simulated change: `APPROVE`, USDC, amount `115792089237316195423570985008687907853269984665640564039457584007913129.639935`, spender `0x1111…1111`. `ethGetCode` on the spender returns `0x`. Gas about 55,906. Expected verdict: **DO NOT SIGN**. Unlimited approval to an address with no code and no identity.

**Scenario C** is a real transfer of 120,133.877066 USDC from `vitalik.eth` to `0x3c7779d27348017415a9184acadc0d62052841ab` in block 25,077,520 on 2026-05-12. Status success, gas used 57,472, effective gas price 0.16 gwei, fee under 0.00001 ETH. Expected verdict: **OK**. It is a post-mine explanation, not a warning.

## Reading the output

- **Asset changes.** For B, what the transaction would move or approve. For C, what it did move. For A, the current balance plus a few recent transfers. Direction is from the input wallet's point of view.
- **Risk flags.** Things the skill noticed: unlimited approvals, spenders with no code, EIP-7702 delegation, spam-looking tokens, unknown counterparties. A flag is a reason to look, not a conviction.
- **Gas / fee snapshot.** Estimate for B, actual for C, current gas price for A.
- **Verdict.**
  - **OK**: simulation succeeded (when there is one), counterparties are consistent, no unlimited or spam flags.
  - **REVIEW**: something needs a human look: a delegation on the wallet you are signing from, an unlimited approval to a contract the agent cannot identify, a surprising recipient, a mined transaction that reverted or moved something the calldata does not explain, or a required tool failed.
  - **DO NOT SIGN**: only for unsigned calldata. Simulation reverts, unlimited approve to a spender with no code, spam contract, or a drain pattern.
  - For a mined transaction the verdict describes what happened. Signing is moot, so an EIP-7702 delegation on the sender is reported as information, not as a reason for REVIEW.
  - When a REVIEW names an address you do not recognise (a spender, a delegate, a recipient), run [Lab 2](../02-contract-inspector/README.md) on it. That is what Lab 2 is for.
- **Tools used.** The exact MCP calls in order. Use it to learn the API: every line is a tool you can call yourself.
- **Gaps.** What the skill could not check and why. "Paid plan required" means a PAYG tool was skipped. "Page 1 only" means the list was truncated. A missing token on page 1 does not mean the wallet does not hold it.

## Try your own

**Your wallet (A).** Replace `vitalik.eth` with your ENS name or `0x` address. Ask for another network by changing `Network:`. The app must have that network enabled.

**Something a dapp wants you to sign (B).** This is the real use case. Get the `to` address and the hex data from the wallet popup: MetaMask shows it under the **Hex** tab, Rabby under **View raw**. Paste them into the Scenario B prompt with your address as `From`. If the popup includes a value, put it in `Value:` in ETH.

**Build your own approve calldata (B).** An ERC-20 `approve(spender, amount)` encodes as the selector `0x095ea7b3`, the spender address left-padded to 32 bytes, and the amount as 32 bytes. Unlimited is all `f`. In Python:

```python
spender = "1111111111111111111111111111111111111111"   # 40 hex chars, no 0x
print("0x095ea7b3" + spender.rjust(64, "0") + "f" * 64)
```

Swap the spender for a known contract such as Uniswap's Permit2, `0x000000000022D473030F116dDEE9F6B43aC78BA3`, and compare. Verified on 2026-09-07: the simulation succeeds the same way, but `ethGetCode` on Permit2 returns contract code, so the verdict becomes REVIEW (unlimited approval to a known contract) instead of DO NOT SIGN. Same calldata shape, different spender, different answer.

**A transaction you saw on Etherscan (C).** Copy the hash from the Etherscan page and paste it into the Scenario C prompt. Works for any EVM network the app supports; set `Network:` to match.

**Paid tier.** If you are on PAYG, add "I am on PAYG, traces and spam filters are allowed" to the prompt. Scenario C will then include a trace, and Scenario A will filter spam NFTs.

**Install as a skill (Claude Code).** The repo ships a pointer at `.claude/skills/before-you-sign/`, so inside this repo you can type `/before-you-sign vitalik.eth`. To use it in any project, copy `skills/before-you-sign/` into `~/.claude/skills/`.

## Now build it

The verdict you just read is `simulateAssetChanges` and `simulateExecution` with a rulebook on top. Both are free-tier HTTP endpoints, so the same preflight fits in a wallet, a bot, or a CI check that refuses to merge a dangerous calldata fixture:

- [Transaction Simulation](https://www.alchemy.com/docs/reference/simulation) - asset changes, decoded execution, bundles
- [Alchemy MCP server docs](https://www.alchemy.com/docs/alchemy-mcp-server) - keep driving it from an agent instead
- [Free tier](https://www.alchemy.com/pricing) - 30M compute units a month

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| ENS resolve fails or the agent invents an address | Check the report's Tools used shows `web3Sha3` calls before `ethCall`. If the agent guessed the namehash, tell it: "compute the namehash with web3Sha3 as the skill describes". For `vitalik.eth` the namehash is `0xee6c4522aab0003e8d14cd40a6af439055fd2577951148c14b6cea9a53475835`. |
| Scenario B report has no `simulate*` call | The agent skipped the point of the lab. Reply: "You must call simulateAssetChanges and simulateExecution on this calldata." |
| 400 error mentioning payg | Expected on Free for spam filters and traces. It should appear under Gaps, not change the verdict. |
| Verdict is REVIEW on your own wallet because of EIP-7702 | You delegated your account at some point, often through a wallet feature. The report names the delegate address. Look it up before you worry. |
| Agent cannot find the skill file | The repo is not the working directory. Open the repo folder in your agent, or paste the contents of `SKILL.md` into the prompt. |
