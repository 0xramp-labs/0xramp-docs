// Recompute the published aggregate snapshot. Node.js 20+, no dependencies.
// This checks arithmetic and coverage; it does not independently authenticate
// the private mapping between application activity and public escrow orders.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const file = process.argv[2] || new URL("./m1-baseline.json", import.meta.url);
const d = JSON.parse(readFileSync(file, "utf8"));
const units = (amount) => {
  assert.ok(Number.isFinite(amount) && amount >= 0, "invalid USDC amount");
  const n = Math.round(amount * 1e6);
  assert.ok(Number.isSafeInteger(n), "USDC amount exceeds exact range");
  return BigInt(n);
};
const count = (n) => { assert.ok(Number.isSafeInteger(n) && n >= 0); return n; };
const check = (name, rows) => {
  assert.equal(rows.reduce((n, row) => n + count(row.orders), 0), d.totals.settledOrders, `${name}: orders`);
  assert.equal(rows.reduce((n, row) => n + units(row.usdc), 0n), units(d.totals.settledUsdc), `${name}: volume`);
};
assert.equal(d.meta.window.start, "2026-08-01T00:00:00Z");
assert.equal(d.meta.window.endExclusive, "2026-09-28T00:00:00.000Z");
assert.equal(d.timeline.length, 58);
let cumulativeOrders = 0;
let cumulativeUsdc = 0n;
for (let i = 0; i < d.timeline.length; i++) {
  assert.equal(d.timeline[i].date, new Date(Date.parse(d.meta.window.start) + i * 86400000).toISOString().slice(0, 10));
  cumulativeOrders += count(d.timeline[i].orders);
  cumulativeUsdc += units(d.timeline[i].usdc);
  assert.equal(d.timeline[i].cumulativeOrders, cumulativeOrders, "daily cumulative orders");
  assert.equal(units(d.timeline[i].cumulativeUsdc), cumulativeUsdc, "daily cumulative volume");
}
check("daily settlements", d.timeline);
check("corridors", d.corridors);
check("application products", [d.products.buy, d.products.sell, d.products.pay]);
check("protocol types", Object.values(d.protocolProducts));
check("asset attribution", [d.zecAttribution.buy, d.zecAttribution.sell, d.zecAttribution.pay, d.zecAttribution.otherAssets, d.zecAttribution.unresolved]);
assert.equal(d.timeline.at(-1).cumulativeOrders, d.totals.settledOrders);
assert.equal(units(d.timeline.at(-1).cumulativeUsdc), units(d.totals.settledUsdc));
assert.equal(units(d.zecAttribution.total.usdc), ["buy", "sell", "pay"].reduce((n, key) => n + units(d.zecAttribution[key].usdc), 0n));
assert.equal(d.zecAttribution.total.orders, ["buy", "sell", "pay"].reduce((n, key) => n + count(d.zecAttribution[key].orders), 0));
assert.deepEqual(d.zecAttribution.total, d.totals.zec);
assert.equal(units(d.reconciliation.settledUsdc), units(d.totals.settledUsdc));
assert.equal(d.reconciliation.settledOrders, d.totals.settledOrders);
assert.equal(Math.round(d.reconciliation.volumeDifferenceUsdc * 1e6), Number(units(d.totals.settledUsdc) - units(d.reconciliation.originalUsdc)));
assert.ok(d.zecAttribution.attested.orders <= d.zecAttribution.sell.orders);
assert.ok(units(d.zecAttribution.attested.usdc) <= units(d.zecAttribution.sell.usdc));
console.log(JSON.stringify({
  result: "Aggregate checks passed",
  window: [d.meta.window.start, d.meta.window.endExclusive],
  settledOrders: d.totals.settledOrders,
  settledUsdc: d.totals.settledUsdc,
  zec: d.totals.zec,
  reconciliation: d.reconciliation,
  verificationBoundary: d.meta.coverage.reproduction,
}, null, 2));
