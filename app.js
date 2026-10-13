// ponytail: minden adat a böngésző localStorage-ában él, nincs szerver. Valódi rendeléshez backend kell.
const MENU = [
  { id: 'espresso', name: 'Espresso', price: 590 },
  { id: 'cappuccino', name: 'Cappuccino', price: 890 },
  { id: 'latte', name: 'Caffè latte', price: 990 },
  { id: 'flatwhite', name: 'Flat white', price: 1090 },
  { id: 'croissant', name: 'Vajas croissant', price: 690 },
  { id: 'cookie', name: 'Csokis keksz', price: 490 },
];
const POINTS_PER_100FT = { revolut: 5, card: 1, cash: 1 }; // Revolut Pay = 5× pont

const $ = (s) => document.querySelector(s);
const ft = (n) => n.toLocaleString('hu-HU') + ' Ft';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let cart = load('cart', {});        // { id: db }
let user = load('user', null);      // { name, email, points }

function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => sum + MENU.find((m) => m.id === id).price * qty, 0);
}

function render() {
  $('#cart-count').textContent = Object.values(cart).reduce((a, b) => a + b, 0);
  $('#login-btn').textContent = user ? `${user.name} · ${user.points} pont (kilépés)` : 'Bejelentkezés';

  const list = $('#cart-list');
  list.replaceChildren(...Object.entries(cart).map(([id, qty]) => {
    const li = document.createElement('li');
    const m = MENU.find((x) => x.id === id);
    li.textContent = `${m.name} × ${qty} – ${ft(m.price * qty)}`;
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.textContent = '−';
    rm.ariaLabel = `${m.name} eltávolítása`;
    rm.onclick = () => { if (--cart[id] === 0) delete cart[id]; save('cart', cart); render(); };
    li.append(rm);
    return li;
  }));
  if (!list.children.length) list.innerHTML = '<li class="muted">A kosár üres.</li>';

  const total = cartTotal();
  $('#cart-total').textContent = ft(total);
  const pay = new FormData($('#checkout-form')).get('pay');
  const pts = Math.floor(total / 100) * POINTS_PER_100FT[pay];
  $('#points-info').textContent = user
    ? `Ezzel a rendeléssel ${pts} pontot kapsz.`
    : 'Jelentkezz be, hogy pontokat gyűjts!';
}

$('#menu-list').append(...MENU.map((m) => {
  const div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `<h3>${m.name}</h3><p class="price">${ft(m.price)}</p>`;
  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Kosárba';
  btn.onclick = () => { cart[m.id] = (cart[m.id] || 0) + 1; save('cart', cart); render(); };
  div.append(btn);
  return div;
}));

$('#login-btn').onclick = () => {
  if (user) { user = null; save('user', null); render(); return; }
  $('#login-dialog').returnValue = ''; $('#login-dialog').showModal();
};
$('#login-dialog').onclose = () => {
  if ($('#login-dialog').returnValue !== 'ok') return;
  const f = new FormData($('#login-form'));
  // Fake login: bármilyen jelszót elfogad, a jelszót nem tároljuk.
  user = { name: f.get('name'), email: f.get('email'), points: 0 };
  save('user', user);
  $('#login-form').reset();
  render();
};

$('#cart-btn').onclick = () => { render(); $('#cart-dialog').returnValue = ''; $('#cart-dialog').showModal(); };
$('#checkout-form').onchange = render;
$('#cart-dialog').onclose = () => {
  if ($('#cart-dialog').returnValue !== 'ok') return;
  const total = cartTotal();
  if (!total) return alert('A kosár üres.');
  const pay = new FormData($('#checkout-form')).get('pay');
  const pts = Math.floor(total / 100) * POINTS_PER_100FT[pay];
  if (pay === 'revolut' && !confirm(`Revolut Pay (demo)\nFizetendő: ${ft(total)}\nJóváhagyod?`)) return;
  if (user) { user.points += pts; save('user', user); }
  cart = {};
  save('cart', cart);
  render();
  alert(`Köszönjük a rendelést! (${ft(total)})` + (user ? `\n+${pts} pont` : ''));
};

render();
