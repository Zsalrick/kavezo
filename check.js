// Futtatás: node check.js
const assert = require('assert');
const { calc, pickupSlots, isOpen } = require('./pricing.js');

const two = [{ price: 1000, qty: 2 }];
assert.strictEqual(calc(two, { pay: 'card' }).total, 2000);
assert.strictEqual(calc(two, { pay: 'revolut' }).earned, 100);           // 5× pont
assert.strictEqual(calc(two, { pay: 'card' }).earned, 20);
assert.strictEqual(calc(two, { student: true }).total, 1700);            // 15%
assert.strictEqual(calc(two, { student: true, coupon: 'nap20' }).total, 1600); // a nagyobb nyer
assert.strictEqual(calc(two, { coupon: 'KAMU' }).couponValid, false);
assert.strictEqual(calc(two, { usePoints: true, points: 499 }).total, 2000);  // kevés pont
const r = calc(two, { usePoints: true, points: 600 });
assert.strictEqual(r.total, 1000);
assert.strictEqual(r.pointsSpent, 500);
assert.strictEqual(calc([{ price: 500, qty: 1 }], { usePoints: true, points: 500 }).total, 0); // nem megy mínuszba

// Kedd 9:02 -> első időpont 9:30, ma
const tue = new Date(2026, 9, 13, 9, 2);
let s = pickupSlots(tue, 3);
assert.deepStrictEqual(s.map((x) => x.day + ' ' + x.time), ['Ma 9:30', 'Ma 9:45', 'Ma 10:00']);
// Kedd 19:50 -> zárás után, holnap 7:00-tól
s = pickupSlots(new Date(2026, 9, 13, 19, 50), 2);
assert.deepStrictEqual(s.map((x) => x.day + ' ' + x.time), ['Holnap 7:00', 'Holnap 7:15']);
// Szombat 19:50 -> vasárnap 10:00 (vasárnap később nyit)
s = pickupSlots(new Date(2026, 9, 17, 19, 50), 1);
assert.strictEqual(s[0].time, '10:00');
assert.strictEqual(isOpen(tue), true);
assert.strictEqual(isOpen(new Date(2026, 9, 18, 9, 0)), false); // vasárnap 9:00
console.log('ok');
