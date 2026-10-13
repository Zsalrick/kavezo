// Közös keret minden oldalra: fejléc (hamburger menü), lábléc, fake bejelentkezés, kosár számláló.
// ponytail: minden adat a böngésző localStorage-ában él, nincs szerver.
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const ft = (n) => n.toLocaleString('hu-HU') + ' Ft';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const openDialog = (d) => { d.returnValue = ''; d.showModal(); };

// Fake fiókok e-mail szerint, hogy kijelentkezés után is megmaradjanak a pontok, pecsétek, rendelések.
let user = load('user', null); // { name, email, points, stamps, credits, studentId, interests }
// points: elkölthető egyenleg (a pakli levonódik belőle), lifetime: összes valaha gyűjtött pont, ebből jön a szint.
function migrate(u) {
  // Hűségkártya-szám: ezt mutatja a QR-kód a profilban, a pultnál ezzel írjuk jóvá a helyben vásárlást.
  if (u && !u.memberId) {
    u.memberId = 'AK' + String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
    save('accounts', { ...load('accounts', {}), [u.email]: u }); // azonnal mentjük, hogy a kártyaszám ne változzon
    if (load('user', null)?.email === u.email) save('user', u);
  }
  if (u && u.lifetime == null) { u.lifetime = u.points || 0; u.points = Math.max(0, (u.points || 0) - (u.decksClaimed || 0) * DECK_POINTS); }
  // Szintlépés után a pecsétkártya rövidebb lehet: a felesleges pecsétek ingyen kávévá válnak.
  if (u) Object.assign(u, addStamps(u, 0, levelFor(u.lifetime).level.every));
  return u;
}
migrate(user);
const saveUser = () => {
  save('user', user);
  if (user) save('accounts', { ...load('accounts', {}), [user.email]: user });
  updateHeader();
};

const ICON = {
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
};
const PAGES = [
  ['index.html', 'Főoldal'],
  ['rendeles.html', 'Rendelés'],
  ['pakli.html', 'Paklik'],
  ['kedvezmenyek.html', 'Kedvezmények'],
  ['esemenyek.html', 'Események'],
  ['kapcsolat.html', 'Kapcsolat'],
];
const current = location.pathname.split('/').pop() || 'index.html';

document.body.insertAdjacentHTML('afterbegin', `
  <a class="skip" href="#main">Ugrás a tartalomra</a>
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Arkánum Kávéház, főoldal">
      <img src="assets/emblem.svg" alt="" width="44" height="44">
      <span class="brand-text"><b>Arkánum</b><small>Kávéház · Győr</small></span>
    </a>
    <nav id="site-nav" class="site-nav" aria-label="Fő navigáció">
      ${PAGES.map(([href, label]) => `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      <div class="nav-extra">
        <a class="btn block" href="rendeles.html">Rendelés</a>
        <p class="nav-status" data-open-status></p>
      </div>
    </nav>
    <div class="header-actions">
      <button type="button" class="icon-btn account-btn" data-login>${ICON.user}<span class="account-label">Belépés</span></button>
      <a class="icon-btn cart-link" href="rendeles.html#kosar" aria-label="Kosár">${ICON.bag}<span class="count" id="cart-count" hidden>0</span></a>
      <button type="button" class="hamburger" aria-expanded="false" aria-controls="site-nav" aria-label="Menü megnyitása"><span></span><span></span><span></span></button>
    </div>
  </header>`);

document.body.insertAdjacentHTML('beforeend', `
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="assets/emblem.svg" alt="" width="56" height="56">
        <p><b>Arkánum Kávéház</b><br>Győr, belváros</p>
      </div>
      <div>
        <h3>Nyitvatartás</h3>
        <p>Hétköznap 7:00-tól 20:00-ig<br>Szombaton 9:00-tól 20:00-ig<br>Vasárnap 10:00-tól 18:00-ig</p>
      </div>
      <nav aria-label="Lábléc">
        <h3>Oldalak</h3>
        <ul>${PAGES.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul>
      </nav>
    </div>
    <p class="fineprint">Iskolai projekt, a bejelentkezés és a fizetés nem valódi. Fotók: <a href="https://unsplash.com/license">Unsplash</a>. <a href="pult.html">Pult nézet</a></p>
  </footer>

  <dialog id="login-dialog" class="modal">
    <form method="dialog" id="login-form">
      <img src="assets/emblem.svg" alt="" width="56" height="56" class="modal-emblem">
      <h2>Belépés</h2>
      <p class="muted">Belépve minden rendelés után pontot kapsz.</p>
      <label>Név <input name="username" required autocomplete="name"></label>
      <label>E-mail <input name="email" type="email" required autocomplete="email"></label>
      <label>Jelszó <input name="password" type="password" required autocomplete="current-password"></label>
      <button value="ok" class="btn block">Belépés</button>
      <button value="cancel" formnovalidate class="btn-text block">Mégse</button>
      <p class="muted small center">Demo: bármilyen adattal be tudsz lépni.</p>
    </form>
  </dialog>
`);

// Kártyaszám olvasható formában: AK 1234 5678
const formatMember = (id) => id.replace(/^(AK)(\d{4})(\d{4})$/, '$1 $2 $3');

// Saját QR-kód SVG-ként (a qrcode-generator könyvtárral, csak ott töltjük be, ahol kell).
function qrSvg(text) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount(), q = 3;
  let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + q} ${r + q}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n + 2 * q} ${n + 2 * q}" role="img" aria-label="Hűségkártya QR-kód"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#2b1a42" shape-rendering="crispEdges"/></svg>`;
}

// --- Hamburger menü ---
const burger = $('.hamburger');
const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
};
burger.onclick = () => setMenu(!document.body.classList.contains('menu-open'));
$$('#site-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// --- Fejléc állapot ---
function updateHeader() {
  // Csak a ma is létező tételeket számoljuk (régi kosárban maradhatott megszűnt tétel).
  const n = Object.entries(load('cart', {})).filter(([id]) => MENU.some((m) => m.id === id)).reduce((a, [, q]) => a + q, 0);
  const c = $('#cart-count');
  c.textContent = n;
  c.hidden = !n;
  $('.account-label').textContent = user ? `${user.points} pont` : 'Belépés';
  $('.account-btn').setAttribute('aria-label', user ? `Fiókom, ${user.points} pont` : 'Belépés');
}

// --- Fake bejelentkezés ---
let afterLogin = null;
function requireLogin(cb) {
  if (user) return cb();
  afterLogin = cb;
  openDialog($('#login-dialog'));
}
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-login]')) return;
  setMenu(false);
  if (!user) return requireLogin(() => {});
  location.href = 'profil.html';
});
$('#login-dialog').addEventListener('close', () => {
  if ($('#login-dialog').returnValue !== 'ok') { afterLogin = null; return; }
  const f = new FormData($('#login-form'));
  // Fake: bármilyen jelszót elfogad, a jelszót nem tároljuk.
  const email = f.get('email').trim().toLowerCase();
  user = migrate(load('accounts', {})[email] || { name: f.get('username'), email, points: 0, lifetime: 0, stamps: 0, credits: 0, interests: [] });
  saveUser();
  $('#login-form').reset();
  afterLogin?.();
  afterLogin = null;
  document.dispatchEvent(new Event('userchange'));
});
function logout() {
  user = null;
  saveUser();
  document.dispatchEvent(new Event('userchange'));
}

// --- "Most nyitva" jelzés ---
function openStatus(now = new Date()) {
  const [, c] = HOURS[now.getDay()];
  if (isOpen(now)) return `Ma ${c}:00-ig vagyunk nyitva.`;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const [o] = HOURS[d.getDay()];
    if (i > 0 || now.getHours() < o) return `Most zárva vagyunk, ${i === 0 ? 'ma' : i === 1 ? 'holnap' : d.toLocaleDateString('hu-HU', { weekday: 'long' })} ${o}:00-kor nyitunk.`;
  }
}
$$('[data-open-status]').forEach((e) => { e.textContent = openStatus(); });

// --- Események: érdeklődés jelzése ---
function renderInterest() {
  $$('[data-interest]').forEach((b) => {
    const on = user?.interests?.includes(b.dataset.interest);
    b.textContent = on ? 'Szólunk, ha lesz időpont ✓' : 'Szóljatok, ha lesz időpont';
    b.classList.toggle('quiet', !!on);
  });
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-interest]');
  if (!b) return;
  requireLogin(() => {
    user.interests ??= [];
    const k = b.dataset.interest;
    user.interests = user.interests.includes(k) ? user.interests.filter((x) => x !== k) : [...user.interests, k];
    saveUser();
    renderInterest();
  });
});
document.addEventListener('userchange', renderInterest);
renderInterest();
updateHeader();
