// Rendelés oldal (kínálat árakkal + kosár).
let cart = load('cart', {}); // { kulcs: db }, a napi menü kulcsa 'napi:<kávé id>'
const setCart = () => { save('cart', cart); updateHeader(); renderAll(); };
const byId = (id) => MENU.find((m) => m.id === id);
function itemFor(key) {
  const [id, coffee] = key.split(':');
  const m = byId(id);
  if (!m) return null;
  return coffee ? { ...m, key, name: `Napi menü: ${byId(coffee)?.name}, ${dailyPastry().name.toLowerCase()}` } : { ...m, key };
}
const lines = () => Object.entries(cart).map(([key, qty]) => { const it = itemFor(key); return it && { ...it, qty }; }).filter(Boolean);
const change = (key, d) => { cart[key] = (cart[key] || 0) + d; if (cart[key] <= 0) delete cart[key]; setCart(); };

function stepper(m, big) {
  const key = m.key || m.id;
  const wrap = el('div', 'stepper' + (big ? ' big' : ''));
  const qty = cart[key] || 0;
  if (!qty) {
    const add = el('button', 'add-btn', '+');
    add.type = 'button';
    add.ariaLabel = `${m.name} hozzáadása`;
    add.onclick = () => change(key, 1);
    wrap.append(add);
    return wrap;
  }
  const minus = el('button', null, '−');
  const plus = el('button', null, '+');
  minus.type = plus.type = 'button';
  minus.ariaLabel = `Egy ${m.name} kevesebb`;
  plus.ariaLabel = `Egy ${m.name} több`;
  minus.onclick = () => change(key, -1);
  plus.onclick = () => change(key, 1);
  wrap.append(minus, el('span', 'qty', qty), plus);
  return wrap;
}

// Napi menü: a kávét a vendég választja, a süti a nap sütije.
function napiButton() {
  const wrap = el('div', 'stepper');
  const add = el('button', 'add-btn', '+');
  add.type = 'button';
  add.ariaLabel = 'Napi menü, kávé kiválasztása';
  add.onclick = () => {
    $('#napi-ok').textContent = `Kosárba · ${ft(byId('napi').price)}`;
    $('#napi-sub').textContent = `Mellé ma ${dailyPastry().name.toLowerCase()} és egy kártya jár. Dupla hűségpontot kapsz rá.`;
    $('#napi-coffees').replaceChildren(...MENU.filter((m) => m.freeable).map((m, i) => {
      const label = el('label', 'pay-opt');
      const input = el('input');
      Object.assign(input, { type: 'radio', name: 'napi-coffee', value: m.id, checked: i === 0 });
      label.append(input, el('span', null, m.name));
      return label;
    }));
    openDialog($('#napi-dialog'));
  };
  const n = Object.entries(cart).filter(([k]) => k.startsWith('napi')).reduce((s, [, q]) => s + q, 0);
  wrap.append(add);
  if (n) wrap.prepend(el('span', 'qty', `${n} a kosárban`));
  return wrap;
}
// Szám nélkül a kapcsoló nem marad bekapcsolva (renderAll visszaállítja), helyette a profilba küldünk.
$('#opt-student').addEventListener('change', () => { $('#student-need').hidden = !!user?.studentId; });
$('#napi-dialog').addEventListener('close', () => {
  if ($('#napi-dialog').returnValue === 'ok') change('napi:' + $('input[name=napi-coffee]:checked').value, 1);
});

// --- Kínálat ---
$('#bonus-line').textContent = `Mai bónusz: ${dailyBonus().name}, rendelésenként +${DAILY_BONUS} pont jár rá.`;
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
    line.append(el('h3', null, m.name));
    if (m.bonus) line.append(el('span', 'bonus-tag', `+${DAILY_BONUS} pont ma`));
    line.append(el('span', 'leader'), el('span', 'price', ft(m.price)));
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
// Diákkedvezmény csak belépve, kitöltött diákigazolvány-számmal jár.
// A diákigazolvány-számot a profilban kell megadni, a kosár onnan veszi.
const wantsStudent = () => !!user?.studentId && $('#opt-student').checked;
const opts = () => ({
  student: wantsStudent(),
  freeCoffee: !!user?.credits && $('#opt-free').checked, // ponytail: rendelésenként egy ingyen kávé váltható be
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
  $$('.ctl').forEach((c) => c.replaceChildren(c.dataset.id === 'napi' ? napiButton() : stepper(byId(c.dataset.id))));

  const ls = lines();
  const count = ls.reduce((s, l) => s + l.qty, 0);
  $('#cart-empty').hidden = !!count;
  $('#cart-full').hidden = $('#cart-foot').hidden = !count;
  $('#student-on').hidden = !user;
  $('#student-off').hidden = !!user;
  if (!user?.studentId) $('#opt-student').checked = false;
  $('#student-has').hidden = !wantsStudent();
  $('#student-has').textContent = `Diákigazolvány: ${user?.studentId}`;
  const canFree = !!user?.credits && ls.some((l) => l.freeable);
  $('#free-row').hidden = !canFree;
  $('#free-count').textContent = user?.credits ? `${user.credits} ingyen kávéd van, a kosár legolcsóbb kávéja lesz ingyenes.` : '';

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

  const rows = [['Részösszeg', ft(r.subtotal)]];
  if (r.free) rows.push(['Ingyen kávé', ft(r.free), 'save']);
  if (r.pct) rows.push([`Diákkedvezmény (${r.pct}%)`, ft(r.discount), 'save']);
  if (r.bonus && user) rows.push(['Napi bónusz', `+${r.bonus} pont`, 'pts']);
  rows.push([user ? 'Hűségpont és pecsét' : 'Hűségpont', user ? `${r.earned} pont, ${r.coffees} pecsét` : 'Lépj be a pontokért', 'pts']);
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
// Kosár ürítése: első érintésre megerősítést kér, hogy ne lehessen véletlenül törölni.
let clearTimer;
$('#clear-cart').onclick = (e) => {
  const b = e.currentTarget;
  if (!b.dataset.sure) {
    b.dataset.sure = '1';
    b.textContent = 'Biztosan üríted? Koppints újra';
    clearTimer = setTimeout(() => { delete b.dataset.sure; b.textContent = 'Kosár ürítése'; }, 4000);
    return;
  }
  clearTimeout(clearTimer);
  delete b.dataset.sure;
  b.textContent = 'Kosár ürítése';
  cart = {};
  setCart();
};
$('.cart-link').onclick = (e) => { e.preventDefault(); openCart(); };
$$('[data-close]').forEach((b) => (b.onclick = () => b.closest('dialog').close()));
drawer.addEventListener('click', (e) => { if (e.target === drawer) drawer.close(); }); // kattintás a háttérre
drawer.addEventListener('input', renderAll);
document.addEventListener('userchange', renderAll);

$('#order-btn').onclick = () => {
  const r = renderAll();
  if (opts().pay !== 'revolut') return finish(r);
  $('#pay-amount').textContent = ft(r.total);
  $('#pay-points').textContent = 'Ötször annyi RevPoints kerül a Revolut appodba.';
  drawer.close();
  openDialog($('#pay-dialog'));
};
$('#pay-dialog').addEventListener('close', () => {
  if ($('#pay-dialog').returnValue === 'ok') finish(renderAll());
  else openCart();
});

function finish(r) {
  const slot = $('input[name=pickup]:checked');
  const student = r.pct ? user.studentId : null;
  const before = user && levelFor(user.lifetime).level;
  let newFree = 0;
  if (user) {
    const left = (user.credits || 0) - (r.free ? 1 : 0);
    const card = addStamps({ stamps: user.stamps, credits: left }, r.coffees, before.every);
    user.points += r.earned;
    user.lifetime += r.earned;
    Object.assign(user, addStamps(card, 0, levelFor(user.lifetime).level.every)); // szintlépésnél a pecsétkártya rövidül
    newFree = user.credits - left;
    saveUser();
  }
  const after = user && levelFor(user.lifetime).level;
  const no = Math.floor(1000 + Math.random() * 9000);
  // A pult nézet (pult.html) ebből a listából olvas. ponytail: csak ugyanazon a böngészőn látszik, valódi rendeléshez szerver kell.
  const orders = load('orders', []);
  orders.push({ no, at: new Date().toISOString(), email: user?.email, pickup: slot.value, pickupLabel: slot.dataset.label, name: user?.name || 'Vendég',
    items: lines().map((l) => `${l.qty}× ${l.name}`), cart: { ...cart }, total: r.total, discount: r.discount, pay: opts().pay, student, studentCheck: null, done: false });
  save('orders', orders);
  drawer.close();
  $('#done-no').textContent = '#' + no;
  $('#done-time').textContent = slot.dataset.label;
  $('#done-total').textContent = ft(r.total);
  $('#done-total-label').textContent = opts().pay === 'cash' ? 'Fizetendő átvételkor' : 'Fizetve';
  $('#done-student-row').hidden = !student;
  $('#done-student').textContent = student;
  $('#done-points').textContent = !user ? 'Legközelebb lépj be, és gyűjts pontot!'
    : `${r.earned} pontot és ${r.coffees} pecsétet kaptál.` + (newFree ? ` Összegyűlt egy ingyen kávé, a következő rendelésnél beválthatod!` : '')
      + (after !== before ? ` Új szintet értél el: ${after.name}, mostantól minden ${after.every}. kávé ingyenes.` : '');
  cart = {};
  $('#opt-student').checked = false;
  setCart();
  openDialog($('#done-dialog'));
}

renderAll();
if (location.hash === '#kosar') { history.replaceState(null, '', location.pathname); openCart(); }
