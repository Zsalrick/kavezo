// ponytail: minden adat a böngésző localStorage-ában él, nincs szerver. Valódi rendeléshez backend kell.
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`;

const MENU = [
  { id: 'magus', arcana: 'I · A Mágus', name: 'Espresso', desc: 'Tiszta erő, egyetlen kortyban.', price: 690, img: img('1530174883092-c2a7aa3f1cfe') },
  { id: 'csillag', arcana: 'XVII · A Csillag', name: 'Cappuccino', desc: 'Selymes tejhab, csillagnyi kakaóval.', price: 990, img: img('1563311977-d285756282dc') },
  { id: 'fopapno', arcana: 'II · A Főpapnő', name: 'Flat white', desc: 'Dupla ristretto, finom mikrohab.', price: 1190, img: img('1541167760496-1628856ab772') },
  { id: 'hold', arcana: 'XVIII · A Hold', name: 'Levendulás latte', desc: 'Házi levendulaszirup, holdfény-lágy.', price: 1390, img: img('1559001724-fbad036dbc9e') },
  { id: 'nap', arcana: 'XIX · A Nap', name: 'Jeges latte', desc: 'Hideg, napfényes, karamellás.', price: 1390, img: img('1461023058943-07fcbe16d735') },
  { id: 'remete', arcana: 'IX · A Remete', name: 'Filterkávé', desc: 'Lassan csepegtetve, elmélyüléshez.', price: 890, img: img('1510591509098-f4fdc6d0ff04') },
  { id: 'bolond', arcana: '0 · A Bolond', name: 'Vajas croissant', desc: 'Új nap, új kezdet.', price: 790, img: img('1555507036-ab1f4038808a') },
  { id: 'kerek', arcana: 'X · A Szerencsekerék', name: 'Reggeli menü', desc: 'Cappuccino + croissant, suli előtt.', price: 1590, img: img('1565252556328-92ee4a9a0983') },
];

const DECK = [
  { num: '0', name: 'A Bolond', sym: '✧', text: 'Új kezdet vár. Merj belevágni – ma egy új kávét is kipróbálhatsz!' },
  { num: 'I', name: 'A Mágus', sym: '∞', text: 'Minden készséged megvan a sikerhez. Használd az értelmedet és az akaraterődet!' },
  { num: 'II', name: 'A Főpapnő', sym: '☽', text: 'Hallgass az intuíciódra – a válasz már benned van.' },
  { num: 'III', name: 'Az Uralkodónő', sym: '❀', text: 'Bőség és kreativitás ideje. Kényeztesd magad egy croissant-nal.' },
  { num: 'VI', name: 'A Szeretők', sym: '♡', text: 'Döntés előtt állsz – a szíved jó iránytű.' },
  { num: 'VII', name: 'A Szekér', sym: '➶', text: 'Lendületben vagy: tartsd a fókuszt, és célba érsz.' },
  { num: 'IX', name: 'A Remete', sym: '✶', text: 'Szánj időt magadra. Egy csendes kávé is lehet meditáció.' },
  { num: 'X', name: 'A Szerencsekerék', sym: '✺', text: 'Fordul a kerék – most neked kedvez!', coupon: 'SZERENCSE50' },
  { num: 'XVII', name: 'A Csillag', sym: '★', text: 'Remény és inspiráció. Jó irányba tartasz.', coupon: 'CSILLAG10' },
  { num: 'XVIII', name: 'A Hold', sym: '☾', text: 'Nem minden az, aminek látszik – figyelj a részletekre.' },
  { num: 'XIX', name: 'A Nap', sym: '☀', text: 'Öröm, siker, napfény. Ragyogó napod lesz!', coupon: 'NAP20' },
  { num: 'XXI', name: 'A Világ', sym: '◯', text: 'Egy szakasz lezárul – ünnepeld meg, amit elértél!' },
];

const $ = (s) => document.querySelector(s);
const ft = (n) => n.toLocaleString('hu-HU') + ' Ft';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const today = () => new Date().toISOString().slice(0, 10);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

let cart = load('cart', {});   // { menuId: db }
let user = load('user', null); // { name, email, points }

const cartLines = () => Object.entries(cart).map(([id, qty]) => ({ ...MENU.find((m) => m.id === id), qty })).filter((l) => l.price);
const opts = () => {
  const f = new FormData($('#checkout-form'));
  return { student: f.has('student'), coupon: f.get('coupon'), usePoints: f.has('usePoints'), points: user?.points, pay: f.get('pay') };
};

// --- Árlista ---
$('#menu-list').append(...MENU.map((m) => {
  const card = el('article', 'item');
  const pic = el('img');
  Object.assign(pic, { src: m.img, alt: m.name, loading: 'lazy', width: 600, height: 450 });
  const body = el('div', 'body');
  const row = el('div', 'row');
  const add = el('button', 'btn', 'Kosárba');
  add.type = 'button';
  add.onclick = () => { cart[m.id] = (cart[m.id] || 0) + 1; save('cart', cart); render(); };
  row.append(el('span', 'price', ft(m.price)), add);
  body.append(el('span', 'arcana', m.arcana), el('h3', null, m.name), el('p', 'desc', m.desc), row);
  card.append(pic, body);
  return card;
}));

// --- Kosár + összesítő ---
function render() {
  const lines = cartLines();
  $('#cart-count').textContent = lines.reduce((s, l) => s + l.qty, 0);
  $('#login-btn').textContent = user ? `${user.name} · ${user.points} pont` : 'Bejelentkezés';

  const list = $('#cart-list');
  list.replaceChildren(...lines.map((l) => {
    const li = el('li', null, `${l.name} × ${l.qty} – ${ft(l.price * l.qty)}`);
    const rm = el('button', null, '−');
    rm.type = 'button';
    rm.ariaLabel = `${l.name} eltávolítása`;
    rm.onclick = () => { if (--cart[l.id] <= 0) delete cart[l.id]; save('cart', cart); render(); };
    li.append(rm);
    return li;
  }));
  if (!lines.length) list.append(el('li', 'muted', 'A kosár üres.'));

  $('#points-row').hidden = !(user && user.points >= 500);
  const o = opts();
  const r = calc(lines, o);
  const rows = [['Részösszeg', ft(r.subtotal)]];
  if (r.pct) rows.push([`Kedvezmény (−${r.pct}%)`, '−' + ft(Math.round(r.subtotal * r.pct / 100))]);
  if (o.coupon && !r.couponValid) rows.push(['Kuponkód', 'érvénytelen']);
  if (r.pointsSpent) rows.push([`${r.pointsSpent} pont beváltva`, '−' + ft(POINTS_REDEEM.value)]);
  rows.push(['Fizetendő', ft(r.total)]);
  rows.push([user ? 'Ezzel kapott pont' : 'Pontgyűjtés', user ? `+${r.earned}` : 'jelentkezz be!']);
  $('#summary').replaceChildren(...rows.map(([k, v]) => {
    const p = el('p', k === 'Fizetendő' ? 'total' : null);
    p.append(el('span', null, k), el('span', null, v));
    return p;
  }));
  return r;
}

function openDialog(d) { d.returnValue = ''; d.showModal(); }

$('#cart-btn').onclick = () => { render(); openDialog($('#cart-dialog')); };
$('#checkout-form').oninput = render;
$('#cart-dialog').onclose = () => {
  if ($('#cart-dialog').returnValue !== 'ok') return;
  const r = render();
  if (!cartLines().length) return alert('A kosár üres.');
  if (opts().pay !== 'revolut') return finish(r);
  $('#pay-amount').textContent = ft(r.total);
  $('#pay-points').textContent = user ? `+${r.earned} hűségpont (5×)` : 'Jelentkezz be az 5× pontokért!';
  openDialog($('#pay-dialog'));
};
$('#pay-dialog').onclose = () => {
  if ($('#pay-dialog').returnValue === 'ok') finish(render());
  else openDialog($('#cart-dialog'));
};

function finish(r) {
  const pickup = new FormData($('#checkout-form')).get('pickup');
  if (user) { user.points += r.earned - r.pointsSpent; save('user', user); }
  cart = {};
  save('cart', cart);
  $('#checkout-form').reset();
  render();
  const no = Math.floor(1000 + Math.random() * 9000);
  alert(`Köszönjük a rendelést!\n\nRendelésszám: #${no}\nÁtvétel: ${pickup}\nFizetve: ${ft(r.total)}` +
    (user ? `\n+${r.earned} pont (egyenleg: ${user.points})` : '') + '\n\n„Kortyolj a jövőbe!”');
}

// --- Fake bejelentkezés ---
$('#login-btn').onclick = () => {
  if (!user) return openDialog($('#login-dialog'));
  if (confirm(`Bejelentkezve: ${user.name} (${user.email})\nPontok: ${user.points}\n\nKijelentkezel?`)) {
    user = null; save('user', null); render();
  }
};
$('#login-dialog').onclose = () => {
  if ($('#login-dialog').returnValue !== 'ok') return;
  const f = new FormData($('#login-form'));
  // Fake: bármilyen jelszót elfogad, a jelszót nem tároljuk.
  user = { name: f.get('username'), email: f.get('email'), points: 0 };
  save('user', user);
  $('#login-form').reset();
  render();
};

// --- Nyereményjáték: napi egy húzás ---
function showCard(idx) {
  const c = DECK[idx];
  const face = $('#drawn');
  face.replaceChildren(el('span', 'num', c.num), el('span', 'sym', c.sym), el('span', 'name', c.name));
  face.hidden = false;
  $('#deck').disabled = true;
  const msg = $('#draw-msg');
  msg.replaceChildren(el('em', null, c.text), el('br'));
  if (c.coupon) {
    msg.append('Nyertél! Kuponkódod: ', el('code', null, c.coupon), ' – add meg a pénztárnál.');
  } else {
    msg.append('Most nem nyertél kupont – holnap újra próbálhatod!');
  }
}
$('#deck').onclick = () => {
  const idx = Math.floor(Math.random() * DECK.length);
  save('draw', { date: today(), idx });
  showCard(idx);
};
const draw = load('draw', null);
if (draw?.date === today() && DECK[draw.idx]) showCard(draw.idx);

render();
