// Futtatás: node check.js
const assert = require('assert');
const { calc } = require('./pricing.js');

const two = [{ price: 1000, qty: 2 }];
assert.deepStrictEqual(calc(two, { pay: 'card' }).total, 2000);
assert.strictEqual(calc(two, { pay: 'revolut' }).earned, 100);           // 5× pont
assert.strictEqual(calc(two, { pay: 'card' }).earned, 20);
assert.strictEqual(calc(two, { student: true }).total, 1700);            // -15%
assert.strictEqual(calc(two, { student: true, coupon: 'nap20' }).total, 1600); // nagyobb nyer
assert.strictEqual(calc(two, { coupon: 'KAMU' }).couponValid, false);
assert.strictEqual(calc(two, { usePoints: true, points: 499 }).total, 2000);  // kevés pont
const r = calc(two, { usePoints: true, points: 600 });
assert.strictEqual(r.total, 1000);
assert.strictEqual(r.pointsSpent, 500);
assert.strictEqual(calc([{ price: 500, qty: 1 }], { usePoints: true, points: 500 }).total, 0); // nem megy mínuszba
console.log('ok');
