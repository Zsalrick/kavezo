// Árlista és rendelés oldal.
let cart = load('cart', {}); // { menuId: db }
const setCart = () => { save('cart', cart); updateHeader(); renderAll(); };
const lines = () => MENU.filter((m) => cart[m.id]).map((m) => ({ ...m, qty: cart[m.id] }));
const change = (id, d) => { cart[id] = (cart[id] || 0) + d; if (cart[id] <= 0) delete cart[id]; setCart(); };

function stepper(m, big) {
  const wrap = el('div', 'stepper' + (big ? ' big' : ''));
  const qty = cart[m.id] || 0;
  if (!qty) {
    const add = el('button', 'add-btn', '+');
    add.type = 'button';
    add.ariaLabel = `${m.name} hozzáadása`;
    add.onclick = () => change(m.id, 1);
    wrap.append(add);
    return wrap;
  }
  const minus = el('button', null, '−');
  const plus = el('button', null, '+');
  minus.type = plus.type = 'button';
  minus.ariaLabel = `Egy ${m.name} kevesebb`;
  plus.ariaLabel = `Egy ${m.name} több`;
  minus.onclick = () => change(m.id, -1);
  plus.onclick = () => change(m.id, 1);
  wrap.append(minus, el('span', 'qty', qty), plus);
  return wrap;
}

// --- Árlista ---
$('#cat-bar').append(...CATEGORIES.map((c) => { const a = el('a', 'tab', c.name); a.href = '#' + c.id; return a; }));
$('#menu').append(...CATEGORIES.map((c) => {
  const sec = el('section', 'menu-cat');
  sec.id = c.id;
  const pic = el('img', 'cat-photo');
  Object.assign(pic, { src: photo(c.img, 1000), alt: '', loading: 'lazy', width: 1000, height: 700 });
  const text = el('div', 'cat-text');
  text.append(el('h2', null, c.name), el('p', 'cat-note', c.note));
  const list = el('ul', 'menu-list');
  list.append(...MENU.filter((m) => m.cat === c.id).map((m) => {
    const li = el('li', 'menu-item');
    const line = el('div', 'mi-line');
    line.append(el('h3', null, m.name), el('span', 'leader'), el('span', 'price', ft(m.price)));
    const ctl = el('div', 'ctl');
    ctl.dataset.id = m.id;
    li.append(line, ctl, el('p', 'desc', m.desc), el('p', 'arcana', m.arcana));
    return li;
  }));
  text.append(list);
  sec.append(pic, text);
  return sec;
}));

// Aktív kategória kiemelése görgetéskor
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  $$('#cat-bar .tab').forEach((a) => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
$$('.menu-cat').forEach((s) => io.observe(s));

// --- Kosár ---
const drawer = $('#cart');
const opts = () => ({
  student: $('#opt-student').checked,
  coupon: $('#opt-coupon').value,
  usePoints: $('#opt-points').checked,
  points: user?.points,
  pay: $('input[name=pay]:checked').value,
});

function renderSlots() {
  const keep = $('input[name=pickup]:checked')?.value;
  const now = new Date();
  const slots = pickupSlots(now, 8);
  const box = $('#slots');
  box.replaceChildren(...slots.map((s, i) => {
    const label = el('label', 'slot');
    const input = el('input');
    Object.assign(input, { type: 'radio', name: 'pickup', value: s.value });
    input.dataset.label = `${s.day} ${s.time}`;
    input.checked = keep ? keep === s.value : i === 0;
    label.append(input, el('small', null, s.day), el('b', null, s.time));
    return label;
  }));
  if (!$('input[name=pickup]:checked')) box.querySelector('input').checked = true;
}

function renderAll() {
  $$('.ctl').forEach((c) => c.replaceChildren(stepper(MENU.find((m) => m.id === c.dataset.id))));

  const ls = lines();
  const count = ls.reduce((s, l) => s + l.qty, 0);
  $('#cart-empty').hidden = !!count;
  $('#cart-full').hidden = $('#cart-foot').hidden = !count;
  $('#points-row').hidden = !(user && user.points >= 500);
  if (!user) $('#opt-points').checked = false;
  $('#login-hint').hidden = !!user;

  $('#cart-items').replaceChildren(...ls.map((l) => {
    const li = el('li', 'cart-line');
    const img = el('img');
    Object.assign(img, { src: photo(l.img, 160), alt: '', width: 56, height: 56 });
    const info = el('div', 'cl-info');
    info.append(el('b', null, l.name), el('small', null, ft(l.price * l.qty)));
    li.append(img, info, stepper(l, true));
    return li;
  }));

  const o = opts();
  const r = calc(ls, o);
  const coupon = $('#coupon-state');
  const couponPct = COUPONS[o.coupon.trim().toUpperCase()];
  coupon.textContent = !o.coupon.trim() ? '' : !r.couponValid ? 'Ismeretlen kód' : r.pct === couponPct ? 'Érvényes ✓' : 'Érvényes, de a diákkedvezmény a nagyobb';
  coupon.className = 'coupon-state ' + (r.couponValid ? 'ok' : 'bad');

  const rows = [['Részösszeg', ft(r.subtotal)]];
  if (r.pct) rows.push([`Kedvezmény (${r.pct}%)`, ft(r.discount), 'save']);
  if (r.pointsSpent) rows.push(['Pontbeváltás', ft(POINTS_REDEEM.value), 'save']);
  rows.push([user ? 'Ezzel kapott pont' : 'Hűségpont', user ? `${r.earned} pont` : 'Lépj be a pontokért', 'pts']);
  $('#summary').replaceChildren(...rows.map(([k, v, cls]) => {
    const p = el('p', cls);
    p.append(el('span', null, k), el('span', null, v));
    return p;
  }));
  $('#cart-bar').hidden = !count || drawer.open;
  $('#cart-bar-count').textContent = `${count} tétel`;
  $('#cart-bar-total').textContent = ft(r.total);
  $('#order-btn').textContent = `Megrendelem · ${ft(r.total)}`;
  return r;
}

function openCart() { renderSlots(); renderAll(); drawer.showModal(); $('#cart-bar').hidden = true; }
drawer.addEventListener('close', renderAll);
$('#cart-bar button').onclick = openCart;
$('.cart-link').onclick = (e) => { e.preventDefault(); openCart(); };
$$('[data-close]').forEach((b) => (b.onclick = () => b.closest('dialog').close()));
drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); }); // kattintás a háttérre
drawer.addEventListener('input', renderAll);
$('#cart-login').onclick = () => requireLogin(() => {});
document.addEventListener('userchange', renderAll);

$('#order-btn').onclick = () => {
  const r = renderAll();
  if (opts().pay !== 'revolut') return finish(r);
  $('#pay-amount').textContent = ft(r.total);
  $('#pay-points').textContent = user ? `${r.earned} hűségpontot kapsz (5×)` : 'Lépj be, és ötszörös pontot kapsz!';
  drawer.close();
  openDialog($('#pay-dialog'));
};
$('#pay-dialog').addEventListener('close', () => {
  if ($('#pay-dialog').returnValue === 'ok') finish(renderAll());
  else openCart();
});

function finish(r) {
  const slot = $('input[name=pickup]:checked');
  if (user) { user.points += r.earned - r.pointsSpent; saveUser(); }
  drawer.close();
  $('#done-no').textContent = '#' + Math.floor(1000 + Math.random() * 9000);
  $('#done-time').textContent = slot.dataset.label;
  $('#done-total').textContent = ft(r.total);
  $('#done-points').textContent = user ? `${r.earned} pontot kaptál, egyenleged ${user.points} pont.` : 'Legközelebb lépj be, és gyűjts pontot!';
  cart = {};
  $('#opt-coupon').value = '';
  $('#opt-student').checked = $('#opt-points').checked = false;
  setCart();
  openDialog($('#done-dialog'));
}

renderAll();
if (location.hash === '#kosar') { history.replaceState(null, '', location.pathname); openCart(); }
