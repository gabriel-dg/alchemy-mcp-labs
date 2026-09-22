// Offline synthetic values only. Never query these fixture addresses.
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { UINT256_MAX, uint256, formatUnits, analyzePair, analyzeMatrix } from './compute.mjs';

const owner = '0x1111111111111111111111111111111111111111';
const tokenA = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const tokenB = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const tokenC = '0xcccccccccccccccccccccccccccccccccccccccc';
const spenderA = '0x2222222222222222222222222222222222222222';
const spenderB = '0x3333333333333333333333333333333333333333';
const spenderC = '0x4444444444444444444444444444444444444444';

function input() {
  return {
    owner, network: 'eth-mainnet',
    tokens: [
      { address: tokenA, balanceRaw: '0x0', decimals: 6 },
      { address: tokenB, balanceRaw: '50000000', decimals: 6 },
      { address: tokenC, balanceRaw: '1', decimals: 18 },
    ],
    spenders: [spenderA, spenderB, spenderC],
    allowances: [
      { token: tokenA, spender: spenderA, allowanceRaw: UINT256_MAX.toString() },
      { token: tokenA, spender: spenderB, allowanceRaw: '1500000' },
      { token: tokenA, spender: spenderC, allowanceRaw: '0' },
      { token: tokenB, spender: spenderA, allowanceRaw: '100000000' },
      { token: tokenB, spender: spenderB, allowanceRaw: '15000000' },
      { token: tokenB, spender: spenderC, allowanceRaw: UINT256_MAX.toString() },
      { token: tokenC, spender: spenderA, allowanceRaw: '1' },
      { token: tokenC, spender: spenderB, allowanceRaw: null }, // failed read
      { token: tokenC, spender: spenderC, allowanceRaw: '0' },
    ],
  };
}

test('mixed matrix preserves nine pairs, active counts and zero-balance permissions', () => {
  const result = analyzeMatrix(input());
  assert.deepEqual(result.coverage, { tokens: 3, spenders: 3, requestedPairs: 9, knownAllowances: 8, unknownAllowances: 1 });
  assert.deepEqual(result.summary, { activePermissions: 6, zeroBalancePermissions: 2 });
  assert.deepEqual(result.rows.map(row => row.status),
    ['UNLIMITED', 'LIMITED', 'NONE', 'LIMITED', 'LIMITED', 'UNLIMITED', 'LIMITED', 'UNKNOWN', 'NONE']);
  assert.deepEqual(result.rows.map(row => row.balanceCoveredDisplay),
    ['0', '0', '0', '50', '15', '50', '0.000000000000000001', null, '0']);
  assert.equal(result.rows[1].allowanceDisplay, '1.5');
  assert.equal(result.rows[0].allowanceDisplay, 'UNLIMITED');
});

test('joins addresses case-insensitively and ignores response order', () => {
  const fixture = input();
  const expected = analyzeMatrix(fixture);
  fixture.allowances.reverse();
  fixture.allowances = fixture.allowances.map(entry => ({ ...entry, token: '0x' + entry.token.slice(2).toUpperCase() }));
  assert.deepEqual(analyzeMatrix(fixture), expected);
});

test('missing, failed and malformed reads remain unknown, never zero', () => {
  for (const value of [null, undefined, '', '0x', '-1', '1.5', '1e6', 0, 1, 'error 0', (UINT256_MAX + 1n).toString()]) {
    assert.equal(uint256(value), null);
    assert.equal(analyzePair('0', value, 18).status, 'UNKNOWN');
    assert.equal(analyzePair('0', value, 18).balanceCoveredRaw, null);
    assert.equal(analyzePair(value, '0', 18).status, 'NONE');
    assert.equal(analyzePair(value, '0', 18).balanceCoveredRaw, null);
  }
  const fixture = input();
  fixture.allowances = [];
  const result = analyzeMatrix(fixture);
  assert.equal(result.rows.length, 9);
  assert.equal(result.coverage.unknownAllowances, 9);
});

test('uint256 maximum and maximum minus one have different statuses', () => {
  assert.equal(analyzePair('1', UINT256_MAX.toString(), 18).status, 'UNLIMITED');
  assert.equal(analyzePair('1', (UINT256_MAX - 1n).toString(), 18).status, 'LIMITED');
  assert.equal(analyzePair('1', '0x' + UINT256_MAX.toString(16), 18).status, 'UNLIMITED');
});

test('formatting preserves exact units, tiny positives and unknown decimals', () => {
  assert.equal(formatUnits('1', 18), '0.000000000000000001');
  assert.equal(formatUnits('1', 0), '1');
  assert.equal(formatUnits('1', 255), '0.' + '0'.repeat(254) + '1');
  assert.equal(formatUnits('0', 6), '0');
  assert.equal(formatUnits('1234500', 6), '1.2345');
  assert.equal(formatUnits('9007199254740993', 0), '9007199254740993');
  for (const decimals of [null, undefined, -1, 256, 1.5, '6']) {
    const row = analyzePair('5', '3', decimals);
    assert.equal(row.decimals, null);
    assert.equal(row.status, 'LIMITED');
    assert.equal(row.balanceCoveredDisplay, '3 base units');
  }
});

test('positive allowance with unknown balance stays active with unknown coverage', () => {
  const row = analyzePair(null, '10', 6);
  assert.equal(row.status, 'LIMITED');
  assert.equal(row.observation, 'BALANCE_UNKNOWN');
  assert.equal(row.balanceCoveredRaw, null);
});

test('all-zero matrix retains nine known pairs and no active permissions', () => {
  const fixture = input();
  fixture.tokens = fixture.tokens.map(token => ({ ...token, balanceRaw: '0' }));
  fixture.allowances = fixture.allowances.map(entry => ({ ...entry, allowanceRaw: '0' }));
  const result = analyzeMatrix(fixture);
  assert.equal(result.summary.activePermissions, 0);
  assert.equal(result.coverage.knownAllowances, 9);
  for (const row of result.rows) {
    assert.equal(row.status, 'NONE');
    assert.equal(row.observation, null);
    assert.equal(row.balanceCoveredRaw, '0');
  }
});

test('rejects ambiguous identities and inputs outside this lab', () => {
  assert.throws(() => analyzeMatrix({ ...input(), owner: owner.slice(0, -1) }));
  assert.throws(() => analyzeMatrix({ ...input(), network: 'base-mainnet' }));
  assert.throws(() => analyzeMatrix({ ...input(), tokens: [] }));
  assert.throws(() => analyzeMatrix({ ...input(), spenders: [...input().spenders, owner] }));
  assert.throws(() => analyzeMatrix({ ...input(), tokens: [input().tokens[0], input().tokens[0]] }));
  assert.throws(() => analyzeMatrix({ ...input(), allowances: [...input().allowances, input().allowances[0]] }));
  assert.throws(() => analyzeMatrix({ ...input(), allowances: [{ token: owner, spender: spenderA, allowanceRaw: '0' }] }));
});

test('can be imported in a JavaScript runtime without global process', () => {
  const url = new URL('./compute.mjs', import.meta.url).href;
  const source = 'delete globalThis.process; const { analyzePair } = await import(' +
    JSON.stringify(url) + '); console.log(JSON.stringify(analyzePair("0", "1", 6)));';
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).observation, 'ZERO_BALANCE_PERMISSION');
});

test('CLI emits computed JSON on stdin input and rejects malformed JSON without a report', () => {
  const script = fileURLToPath(new URL('./compute.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [script], { encoding: 'utf8', input: JSON.stringify(input()) });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), analyzeMatrix(input()));
  const invalid = spawnSync(process.execPath, [script], { encoding: 'utf8', input: '{' });
  assert.equal(invalid.status, 1);
  assert.equal(invalid.stdout, '');
  assert.ok(invalid.stderr.length > 0);
});
