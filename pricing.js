// Árazás, kedvezmények, nyitvatartás. Külön fájl, hogy a check.js Node-ból is tesztelhesse.
const COUPONS = { SZERENCSE50: 50, NAP20: 20, CSILLAG10: 10 }; // kód -> % kedvezmény
const STUDENT_PCT = 15;
const POINTS_REDEEM = { cost: 500, value: 1000 }; // 500 pont = 1000 Ft
const POINTS_PER_100FT = { revolut: 5, card: 1, cash: 1 }; // Revolut Pay = 5× pont
const HOURS = { 0: [10, 18], 1: [7, 20], 2: [7, 20], 3: [7, 20], 4: [7, 20], 5: [7, 20], 6: [9, 20] }; // nap (0 = vasárnap) -> [nyit, zár]

// lines: [{ price, qty }]; opts: { student, coupon, usePoints, points, pay }
function calc(lines, opts = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const couponPct = COUPONS[(opts.coupon || '').trim().toUpperCase()] || 0;
  // A %-os kedvezmények nem vonhatók össze: a nagyobb érvényes.
  const pct = Math.max(opts.student ? STUDENT_PCT : 0, couponPct);
  const discount = Math.round(subtotal * pct / 100);
  let total = subtotal - discount;
  const redeem = opts.usePoints && (opts.points || 0) >= POINTS_REDEEM.cost && total > 0;
  if (redeem) total = Math.max(0, total - POINTS_REDEEM.value);
  const earned = Math.floor(total / 100) * (POINTS_PER_100FT[opts.pay] || 1);
  return { subtotal, pct, discount, couponValid: couponPct > 0, total, pointsSpent: redeem ? POINTS_REDEEM.cost : 0, earned };
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

if (typeof module !== 'undefined') module.exports = { calc, pickupSlots, isOpen, COUPONS };
