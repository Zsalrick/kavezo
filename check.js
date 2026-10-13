// Futtatás: node check.js
const assert = require('assert');
const { calc, addStamps, dailyPickIndex, levelFor, validStudentId, pickupSlots, isOpen } = require('./pricing.js');

const two = [{ price: 1000, qty: 2 }];
assert.strictEqual(calc(two).total, 2000);
assert.strictEqual(calc(two).earned, 20);                                // 1 pont / 100 Ft, fizetési módtól függetlenül
assert.strictEqual(calc(two, { student: true }).total, 1700);            // 15%
// A hét menüje: 2× pont
const napi = [{ price: 1690, qty: 1, coffee: true, pointsX: 2 }];
assert.strictEqual(calc(napi).earned, 32);
assert.strictEqual(calc(napi, { student: true }).earned, 28);              // 1437 Ft -> 14 + 14
assert.strictEqual(calc([...napi, { price: 990, qty: 1 }]).earned, 26 + 16); // 2680 Ft -> 26, plusz 16 bónusz

// Ingyen kávé: a legolcsóbb beváltható kávé ingyenes, a hét menüje nem váltható be, de pecsétet ad.
const mix = [
  { price: 990, qty: 1, coffee: true, freeable: true },
  { price: 690, qty: 2, coffee: true, freeable: true },
  { price: 1690, qty: 1, coffee: true, freeable: false },
  { price: 790, qty: 1 },
];
let r = calc(mix, { freeCoffee: true });
assert.strictEqual(r.free, 690);
assert.strictEqual(r.total, 990 + 690 + 1690 + 790);
assert.strictEqual(r.coffees, 3);                                        // 4 kávé, ebből 1 ingyenes
r = calc(mix, { freeCoffee: true, student: true });
assert.strictEqual(r.total, 4160 - 624);                                 // a 15% az ingyen kávé után számolódik
assert.strictEqual(calc([{ price: 1690, qty: 1, coffee: true }], { freeCoffee: true }).free, 0);

// Pecsétkártya: minden 10. ingyenes = 9 után jár egy
assert.deepStrictEqual(addStamps({}, 9, 10), { stamps: 0, credits: 1 });
assert.deepStrictEqual(addStamps({ stamps: 7, credits: 0 }, 3, 10), { stamps: 1, credits: 1 });
assert.deepStrictEqual(addStamps({ stamps: 0, credits: 1 }, 7, 8), { stamps: 0, credits: 2 }); // minden 8. = 7 után
assert.deepStrictEqual(addStamps({ stamps: 8, credits: 0 }, 0, 8), { stamps: 1, credits: 1 }); // szintlépés után normalizál
assert.strictEqual(validStudentId('7212345678'), true);
assert.strictEqual(validStudentId('72123 456789'), true);   // szóköz mehet, 11 jegy
assert.strictEqual(validStudentId('12345'), false);
assert.strictEqual(validStudentId('72123456ab'), false);

// Hűségszintek
assert.strictEqual(levelFor(0).level.name, 'A Bolond');
assert.strictEqual(levelFor(299).toNext, 1);
assert.strictEqual(levelFor(300).level.every, 9);
assert.strictEqual(levelFor(1000).level.name, 'A Szerencsekerék');
assert.strictEqual(levelFor(1700).level.every, 6);

// Napi bónusz: +25 pont rendelésenként egyszer, és a nap terméke naponta változik
assert.strictEqual(calc([{ price: 990, qty: 3, bonus: true }]).earned, 29 + 25);
assert.strictEqual(calc([{ price: 990, qty: 1 }]).bonus, 0);
const picks = new Set(Array.from({ length: 30 }, (_, i) => dailyPickIndex(new Date(2026, 9, 1 + i), 20)));
assert.ok(picks.size > 10, 'a napi bónusz ne ugyanaz legyen minden nap');
assert.strictEqual(dailyPickIndex(new Date(2026, 9, 13, 8), 20), dailyPickIndex(new Date(2026, 9, 13, 22), 20)); // egész nap ugyanaz
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
