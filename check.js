// Futtatás: node check.js
const assert = require('assert');
const { calc, levelFor, validStudentId, pickupSlots, isOpen } = require('./pricing.js');

const two = [{ price: 1000, qty: 2 }];
assert.strictEqual(calc(two, { pay: 'card' }).total, 2000);
assert.strictEqual(calc(two, { pay: 'revolut' }).earned, 100);           // 5× pont
assert.strictEqual(calc(two, { pay: 'card' }).earned, 20);
assert.strictEqual(calc(two, { student: true }).total, 1700);            // 15%
assert.strictEqual(validStudentId('7212345678'), true);
assert.strictEqual(validStudentId('72123 456789'), true);   // szóköz mehet, 11 jegy
assert.strictEqual(validStudentId('12345'), false);
assert.strictEqual(validStudentId('72123456ab'), false);

// Hűségszintek
assert.strictEqual(levelFor(0).level.name, 'A Bolond');
assert.strictEqual(levelFor(299).toNext, 1);
assert.strictEqual(levelFor(300).level.name, 'A Mágus');
assert.strictEqual(levelFor(1500).level.reward, 'saját Arkánum tarot pakli');
assert.strictEqual(levelFor(99999).next, undefined);

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
