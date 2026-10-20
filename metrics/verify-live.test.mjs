import assert from "node:assert/strict";
import test from "node:test";
import { verifyLiveMetrics } from "./verify-live.mjs";

const bucket = (orders = 0, usdc = 0) => ({ orders, usdc });
function sample() {
  return {
    meta: { live: true, snapshot: {} },
    totals: { settledOrders: 1, settledUsdc: 0.3, days: 1, zec: bucket(1, 0.3) },
    corridors: [bucket(1, 0.3)],
    products: { buy: bucket(1, 0.3), sell: bucket(), pay: bucket(), donationSubsetOfSell: bucket() },
    zecAttribution: { buy: bucket(1, 0.3), sell: bucket(), pay: bucket(), otherAssets: bucket(), unresolved: bucket(), total: bucket(1, 0.3), attested: bucket() },
    timeline: [{ date: "2000-01-01", ...bucket(1, 0.3), cumulativeOrders: 1, cumulativeUsdc: 0.3 }],
    users: { accountsWithOrders: 1, settledAccounts: 1, newByMonth: [{ month: "2000-01", accounts: 1 }], repeatAccounts: 0, ordersPerAccount: { "1": 1, "2-4": 0, "5-9": 0, "10+": 0 } },
  };
}

test("accepts a consistent public response, with or without protocol types", () => {
  const data = sample();
  assert.equal(verifyLiveMetrics(data).protocolTypesChecked, false);
  data.protocolProducts = { buy: bucket(1, 0.3), sell: bucket(), pay: bucket() };
  assert.equal(verifyLiveMetrics(data).protocolTypesChecked, true);
});

test("reports stale evidence without certifying freshness", () => {
  const data = sample(); data.stale = true;
  assert.equal(verifyLiveMetrics(data).stale, true);
});

for (const [name, corrupt] of [
  ["corridor omission", (d) => { d.corridors = []; }],
  ["fractional order count", (d) => { d.totals.settledOrders = 0.5; }],
  ["excess decimal precision", (d) => { d.totals.settledUsdc = 0.3000001; }],
  ["cumulative mismatch", (d) => { d.timeline[0].cumulativeUsdc = 0.2; }],
  ["invalid calendar date", (d) => { d.timeline[0].date = "2000-02-31"; }],
  ["duplicated donation", (d) => { d.products.donationSubsetOfSell = bucket(1, 0.3); }],
  ["overstated attestation", (d) => { d.zecAttribution.attested = bucket(1, 0.3); }],
  ["inconsistent account totals", (d) => { d.users.settledAccounts = 2; }],
]) {
  test(`rejects ${name}`, () => { const data = sample(); corrupt(data); assert.throws(() => verifyLiveMetrics(data)); });
}
