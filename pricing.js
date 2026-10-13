// Árazás és kedvezmények – külön fájl, hogy a check.js Node-ból is tesztelhesse.
const COUPONS = { SZERENCSE50: 50, NAP20: 20, CSILLAG10: 10 }; // kód -> % kedvezmény
const STUDENT_PCT = 15;
const POINTS_REDEEM = { cost: 500, value: 1000 }; // 500 pont = 1000 Ft
const POINTS_PER_100FT = { revolut: 5, card: 1, cash: 1 }; // Revolut Pay = 5× pont

// lines: [{ price, qty }]; opts: { student, coupon, usePoints, points, pay }
function calc(lines, opts = {}) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const couponPct = COUPONS[(opts.coupon || '').trim().toUpperCase()] || 0;
  // A %-os kedvezmények nem vonhatók össze: a nagyobb érvényes.
  const pct = Math.max(opts.student ? STUDENT_PCT : 0, couponPct);
  let total = subtotal - Math.round(subtotal * pct / 100);
  const redeem = opts.usePoints && (opts.points || 0) >= POINTS_REDEEM.cost && total > 0;
  if (redeem) total = Math.max(0, total - POINTS_REDEEM.value);
  const earned = Math.floor(total / 100) * (POINTS_PER_100FT[opts.pay] || 1);
  return { subtotal, pct, couponValid: couponPct > 0, total, pointsSpent: redeem ? POINTS_REDEEM.cost : 0, earned };
}

if (typeof module !== 'undefined') module.exports = { calc, COUPONS };
