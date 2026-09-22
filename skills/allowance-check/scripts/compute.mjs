// Pure local arithmetic. No network calls, wallet access, or file output.
import { pathToFileURL } from 'node:url';

export const UINT256_MAX = (1n << 256n) - 1n;

export function uint256(value) {
  if (typeof value !== 'string' || !/^(?:[0-9]+|0x[0-9a-fA-F]+)$/.test(value)) return null;
  const parsed = BigInt(value);
  return parsed <= UINT256_MAX ? parsed : null;
}

export function formatUnits(value, decimals) {
  const raw = uint256(value);
  if (raw === null) return null;
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) return raw.toString() + ' base units';
  if (decimals === 0) return raw.toString();
  const padded = raw.toString().padStart(decimals + 1, '0');
  const fraction = padded.slice(-decimals).replace(/0+$/, '');
  return padded.slice(0, -decimals) + (fraction ? '.' + fraction : '');
}

export function analyzePair(balanceRaw, allowanceRaw, decimals) {
  const balance = uint256(balanceRaw);
  const allowance = uint256(allowanceRaw);
  const scale = Number.isInteger(decimals) && decimals >= 0 && decimals <= 255 ? decimals : null;
  const status = allowance === null ? 'UNKNOWN' : allowance === 0n ? 'NONE' :
    allowance === UINT256_MAX ? 'UNLIMITED' : 'LIMITED';
  const covered = balance === null || allowance === null ? null :
    balance < allowance ? balance : allowance;
  const result = {
    decimals: scale,
    balanceRaw: balance?.toString() ?? null,
    allowanceRaw: allowance?.toString() ?? null,
    status,
    balanceCoveredRaw: covered?.toString() ?? null,
    observation: allowance === null || allowance === 0n ? null :
      balance === null ? 'BALANCE_UNKNOWN' : balance === 0n ? 'ZERO_BALANCE_PERMISSION' : 'BALANCE_OVERLAP',
  };
  return {
    ...result,
    balanceDisplay: formatUnits(result.balanceRaw, scale),
    allowanceDisplay: status === 'UNLIMITED' ? 'UNLIMITED' : formatUnits(result.allowanceRaw, scale),
    balanceCoveredDisplay: formatUnits(result.balanceCoveredRaw, scale),
  };
}

function addressKey(value) {
  if (typeof value !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error('Invalid full address');
  return value.toLowerCase();
}

function selectedMap(items, getAddress) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 3) throw new Error('Select one to three items');
  const map = new Map();
  for (const item of items) {
    const key = addressKey(getAddress(item));
    if (map.has(key)) throw new Error('Deduplicate selected addresses before computing');
    map.set(key, item);
  }
  return map;
}

// Input: one owner, selected tokens with raw balances/decimals, selected spender
// addresses, and unwrapped final allowance results. Missing reads remain null.
// Only the selected lists define the matrix; response order never defines identity.
export function analyzeMatrix(input) {
  addressKey(input.owner);
  if (input.network !== 'eth-mainnet') throw new Error('Only eth-mainnet is supported');
  const tokens = selectedMap(input.tokens, token => token.address);
  const spenders = selectedMap(input.spenders, spender => spender);
  if (!Array.isArray(input.allowances)) throw new Error('Allowances must be an array');
  const values = new Map();
  for (const entry of input.allowances) {
    const token = addressKey(entry.token);
    const spender = addressKey(entry.spender);
    if (!tokens.has(token) || !spenders.has(spender)) throw new Error('Allowance outside selected matrix');
    const key = token + ':' + spender;
    if (values.has(key)) throw new Error('Provide one final result per pair; log retries separately');
    values.set(key, entry.allowanceRaw);
  }
  const rows = [];
  for (const [tokenKey, token] of tokens) {
    for (const [spenderKey, spender] of spenders) {
      rows.push({
        token: token.address,
        spender,
        ...analyzePair(token.balanceRaw, values.get(tokenKey + ':' + spenderKey), token.decimals),
      });
    }
  }
  const unknown = rows.filter(row => row.status === 'UNKNOWN').length;
  return {
    owner: input.owner,
    network: input.network,
    coverage: {
      tokens: tokens.size,
      spenders: spenders.size,
      requestedPairs: rows.length,
      knownAllowances: rows.length - unknown,
      unknownAllowances: unknown,
    },
    summary: {
      activePermissions: rows.filter(row => row.status === 'LIMITED' || row.status === 'UNLIMITED').length,
      zeroBalancePermissions: rows.filter(row => row.observation === 'ZERO_BALANCE_PERMISSION').length,
    },
    rows,
  };
}

// Accept JSON on stdin and emit computed JSON on stdout. Importing is also supported.
if (typeof process !== 'undefined' && process.argv?.[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    let input = '';
    for await (const chunk of process.stdin) input += chunk;
    process.stdout.write(JSON.stringify(analyzeMatrix(JSON.parse(input)), null, 2) + '\n');
  } catch (error) {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  }
}
