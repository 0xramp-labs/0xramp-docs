// Verify arithmetic in one saved response from the public live metrics API.
// Node.js 20+, no dependencies or network access. Does not authenticate attribution.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function verifyLiveMetrics(data) {
  const integer = (n) => {
    assert.ok(Number.isSafeInteger(n) && n >= 0, "Invalid non-negative count");
    return n;
  };
  const units = (n) => {
    assert.ok(typeof n === "number" && Number.isFinite(n) && n >= 0, "Invalid USDC amount");
    const scaled = n * 1e6;
    const rounded = Math.round(scaled);
    assert.ok(Number.isSafeInteger(rounded), "USDC amount exceeds exact micro-unit range");
    assert.ok(Math.abs(scaled - rounded) < 0.00001, "USDC amount exceeds six decimal places");
    return BigInt(rounded);
  };
  const sum = (rows, key, convert) => rows.reduce((n, row) => n + convert(row[key]), convert(0));
  const totalOrders = integer(data.totals.settledOrders);
  const totalUsdc = units(data.totals.settledUsdc);
  const reconcile = (label, rows) => {
    assert.ok(Array.isArray(rows), `${label}: missing rows`);
    assert.equal(sum(rows, "orders", integer), totalOrders, `${label}: order total`);
    assert.equal(sum(rows, "usdc", units), totalUsdc, `${label}: USDC total`);
  };
  reconcile("corridors", data.corridors);
  reconcile("daily settlements", data.timeline);
  const z = data.zecAttribution;
  reconcile("asset attribution", [z.buy, z.sell, z.pay, z.otherAssets, z.unresolved]);
  assert.equal(sum([z.buy, z.sell, z.pay], "orders", integer), integer(z.total.orders), "ZEC order total");
  assert.equal(sum([z.buy, z.sell, z.pay], "usdc", units), units(z.total.usdc), "ZEC USDC total");
  assert.equal(integer(data.totals.zec.orders), integer(z.total.orders), "ZEC displayed orders");
  assert.equal(units(data.totals.zec.usdc), units(z.total.usdc), "ZEC displayed USDC");
  assert.ok(integer(z.attested.orders) <= integer(z.sell.orders), "Attested orders exceed ZEC SELL");
  assert.ok(units(z.attested.usdc) <= units(z.sell.usdc), "Attested volume exceeds ZEC SELL");
  const p = data.products;
  reconcile("application products", [p.buy, p.sell, p.pay]);
  assert.ok(integer(p.donationSubsetOfSell.orders) <= integer(p.sell.orders), "Donations exceed SELL orders");
  assert.ok(units(p.donationSubsetOfSell.usdc) <= units(p.sell.usdc), "Donations exceed SELL volume");
  if (data.protocolProducts) reconcile("protocol types", Object.values(data.protocolProducts));
  let orders = 0;
  let usdc = 0n;
  let previous = null;
  for (const day of data.timeline) {
    assert.match(day.date, /^\d{4}-\d{2}-\d{2}$/, "Invalid UTC day");
    const stamp = Date.parse(`${day.date}T00:00:00Z`);
    assert.ok(Number.isFinite(stamp), "Invalid UTC date");
    assert.equal(new Date(stamp).toISOString().slice(0, 10), day.date, "Invalid calendar date");
    if (previous !== null) assert.equal(stamp - previous, 86400000, "Missing or duplicate UTC day");
    previous = stamp;
    orders += integer(day.orders);
    usdc += units(day.usdc);
    assert.equal(integer(day.cumulativeOrders), orders, "Daily cumulative orders");
    assert.equal(units(day.cumulativeUsdc), usdc, "Daily cumulative USDC");
  }
  assert.ok(data.timeline.length > 0, "Missing timeline");
  assert.equal(data.timeline.length, integer(data.totals.days), "Day count");
  const u = data.users;
  if (u) {
    assert.ok(integer(u.accountsWithOrders) >= integer(u.settledAccounts), "Settled accounts exceed accounts with orders");
    assert.equal(sum(u.newByMonth, "accounts", integer), u.settledAccounts, "New-account month totals");
    const buckets = ["1", "2-4", "5-9", "10+"].map((key) => integer(u.ordersPerAccount[key]));
    assert.equal(buckets.reduce((n, value) => n + value, 0), u.settledAccounts, "Account bucket totals");
    assert.equal(integer(u.repeatAccounts), u.settledAccounts - buckets[0], "Repeat-account count");
  }
  return {
    result: "Public aggregate arithmetic passed",
    live: data.meta?.live === true,
    stale: data.stale === true,
    capturedAt: data.meta?.snapshot?.takenAt ?? null,
    subgraphBlock: data.meta?.snapshot?.subgraphBlock ?? null,
    protocolTypesChecked: Boolean(data.protocolProducts),
    boundary: "Checks the saved public response only; does not authenticate application or asset attribution, unique people, or bank receipt.",
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2];
  assert.ok(file, "Usage: node verify-live.mjs metrics.json");
  console.log(JSON.stringify(verifyLiveMetrics(JSON.parse(readFileSync(file, "utf8"))), null, 2));
}
