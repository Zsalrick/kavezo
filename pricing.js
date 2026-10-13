// Árazás, kedvezmények, hűségprogram, nyitvatartás. Külön fájl, hogy a check.js Node-ból is tesztelhesse.
const STUDENT_PCT = 15;
const POINTS_PER_100FT = 1; // hűségpont minden fizetési módnál ugyanannyi; a Revolut Pay 5× RevPointsát a Revolut adja
// Hűségszintek, "A Bolond útja": minden szint egy nagy arkánum, a ponthatár a lap számának százszorosa.
// every: minden hányadik kávé ingyenes.
const LEVELS = [
  { min: 0, num: '0', name: 'A Bolond', every: 10 },
  { min: 300, num: 'III', name: 'Az Uralkodónő', every: 9 },
  { min: 700, num: 'VII', name: 'A Szekér', every: 8 },
  { min: 1000, num: 'X', name: 'A Szerencsekerék', every: 7 },
  { min: 1700, num: 'XVII', name: 'A Csillag', every: 6 },
];
const HOURS = { 0: [10, 18], 1: [7, 20], 2: [7, 20], 3: [7, 20], 4: [7, 20], 5: [7, 20], 6: [9, 20] }; // nap (0 = vasárnap) -> [nyit, zár]

// Diákigazolvány száma: 10 vagy 11 számjegy (az oktatási azonosító 11 jegyű).
const validStudentId = (id) => /^\d{10,11}$/.test((id || '').replace(/\s/g, ''));

// lines: [{ price, qty, coffee, freeable, pointsX }]; opts: { student, freeCoffee }
// pointsX: pontszorzó az adott tételre (a napi menüre 2×).
// freeCoffee: egy ingyen kávé beváltása, a kosár legolcsóbb beváltható kávéja lesz ingyenes.
function calc(lines, opts = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const freeable = lines.filter((l) => l.freeable).map((l) => l.price);
  const free = opts.freeCoffee && freeable.length ? Math.min(...freeable) : 0;
  const pct = opts.student ? STUDENT_PCT : 0;
  const discount = Math.round((subtotal - free) * pct / 100);
  const total = subtotal - free - discount;
  const bonusBase = lines.reduce((s, l) => s + l.price * l.qty * ((l.pointsX || 1) - 1), 0) * (100 - pct) / 100;
  const earned = (Math.floor(total / 100) + Math.floor(bonusBase / 100)) * POINTS_PER_100FT;
  const coffees = lines.reduce((s, l) => s + (l.coffee ? l.qty : 0), 0) - (free ? 1 : 0); // az ingyenes nem ad pecsétet
  return { subtotal, free, pct, discount, total, earned, coffees };
}

// Pecsétkártya: "minden 10. ingyenes" = 9 fizetett kávé után jár egy ingyen kávé.
function addStamps(card, bought, every) {
  const all = (card.stamps || 0) + bought;
  return { stamps: all % (every - 1), credits: (card.credits || 0) + Math.floor(all / (every - 1)) };
}

// Ajándék pakli: minden 1000 pont után jár egy. A pontok nem fogynak el.
const GIFT_EVERY = 1000;
function giftDecks(points, claimed = 0) {
  const earned = Math.floor(points / GIFT_EVERY);
  return { earned, available: Math.max(0, earned - claimed), nextAt: (earned + 1) * GIFT_EVERY };
}

// Melyik szinten van, és mennyi kell a következőhöz.
function levelFor(points) {
  const i = LEVELS.findLastIndex((l) => points >= l.min);
  const next = LEVELS[i + 1];
  return { level: LEVELS[i], index: i, next, toNext: next ? next.min - points : 0 };
}

const pad = (n) => String(n).padStart(2, '0');
const hhmm = (d) => `${d.getHours()}:${pad(d.getMinutes())}`;

function isOpen(now) {
  const [o, c] = HOURS[now.getDay()];
  const h = now.getHours() + now.getMinutes() / 60;
  return h >= o && h < c;
}

// A következő n átvételi időpont 15 percenként, legkorábban 15 perc múlva, nyitvatartáson belül.
function pickupSlots(now, n = 8) {
  const out = [];
  const t = new Date(now.getTime() + 15 * 60000);
  t.setSeconds(0, 0);
  t.setMinutes(Math.ceil(t.getMinutes() / 15) * 15);
  for (let guard = 0; out.length < n && guard < 7 * 96; guard++, t.setMinutes(t.getMinutes() + 15)) {
    const [o, c] = HOURS[t.getDay()];
    const h = t.getHours() + t.getMinutes() / 60;
    if (h < o || h > c - 0.25) continue; // utolsó átvétel zárás előtt 15 perccel
    const dayDiff = Math.round((new Date(t).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 864e5);
    const day = dayDiff === 0 ? 'Ma' : dayDiff === 1 ? 'Holnap' : t.toLocaleDateString('hu-HU', { weekday: 'long' });
    out.push({ value: t.toISOString(), day, time: hhmm(t) });
  }
  return out;
}

if (typeof module !== 'undefined') module.exports = { calc, addStamps, giftDecks, levelFor, validStudentId, pickupSlots, isOpen };
