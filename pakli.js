// Paklik oldal: vásárlás (kosárba) és ajándék pakli beváltása hűségpontból.
const DECKS = MENU.filter((m) => m.cat === 'paklik');
let chosen = null;
let lastGiftNo = null;

function fan(d) {
  const f = el('div', `fan deck-${d.design}`);
  f.setAttribute('aria-hidden', 'true');
  f.append(el('span', 'fan-card'), el('span', 'fan-card'));
  const top = el('span', 'fan-card');
  const img = el('img');
  Object.assign(img, { src: 'assets/emblem.svg', className: 'fan-emblem', alt: '' }); // csak a lap hátulja látszik
  top.append(img);
  f.append(top);
  return f;
}

function renderGift() {
  const box = $('#gift');
  if (!user) {
    box.replaceChildren(el('p', null, 'Hűségpontból ajándék pakli jár: az első 1000 pontnál, utána minden további 2000 pontnál.'));
    const b = el('button', 'btn', 'Belépés');
    b.type = 'button';
    b.dataset.login = '';
    box.append(b);
    return;
  }
  const g = giftDecks(user.points, user.decksClaimed || 0);
  const p = el('p');
  if (g.available) {
    p.append(el('b', null, `${g.available} ajándék paklid van.`), ' Válaszd ki lent, melyiket kéred, és a pultnál átveheted.');
  } else {
    p.textContent = `Ajándék pakli az első 1000 pontnál, utána minden további 2000 pontnál jár. Neked most ${user.points} pontod van, még ${g.nextAt - user.points} kell a következőig.`;
  }
  box.replaceChildren(p);
  if (lastGiftNo) box.append(el('p', 'gift-done', `Beváltva! Rendelésszám: #${lastGiftNo}. A pultnál ezzel kérd.`));
}

function renderDecks() {
  const g = user ? giftDecks(user.points, user.decksClaimed || 0) : { available: 0 };
  const cart = load('cart', {});
  $('#decks').replaceChildren(...DECKS.map((d) => {
    const art = el('article', 'deck');
    const text = el('div', 'deck-text');
    text.append(el('h2', null, d.name), el('p', 'arcana', d.arcana), el('p', null, d.desc), el('p', 'price', ft(d.price)));
    const actions = el('div', 'actions');
    const buy = el('button', 'btn', cart[d.id] ? `Kosárban (${cart[d.id]})` : 'Kosárba');
    buy.type = 'button';
    buy.onclick = () => { const c = load('cart', {}); c[d.id] = (c[d.id] || 0) + 1; save('cart', c); updateHeader(); renderDecks(); };
    actions.append(buy);
    if (g.available) {
      const gift = el('button', 'btn quiet', 'Ajándékként kérem');
      gift.type = 'button';
      gift.onclick = () => {
        chosen = d;
        $('#gift-title').textContent = d.name;
        $('#gift-text').textContent = `Ajándékba kéred ezt a paklit? Ezzel beváltasz egy ajándék paklit (összesen ${g.available} van), a pontjaid megmaradnak.`;
        openDialog($('#gift-dialog'));
      };
      actions.append(gift);
    }
    if (cart[d.id]) { const go = el('a', 'text-link', 'Kosár megnyitása'); go.href = 'arlista.html#kosar'; actions.append(go); }
    text.append(actions);
    art.append(fan(d), text);
    return art;
  }));
}

$('#gift-dialog').addEventListener('close', () => {
  if ($('#gift-dialog').returnValue !== 'ok' || !chosen || !user) return;
  if (!giftDecks(user.points, user.decksClaimed || 0).available) return;
  user.decksClaimed = (user.decksClaimed || 0) + 1;
  saveUser();
  lastGiftNo = Math.floor(1000 + Math.random() * 9000);
  // A pult nézet ugyanebből a listából olvas, mint a rendelések.
  const orders = load('orders', []);
  orders.push({ no: lastGiftNo, at: new Date().toISOString(), email: user.email, pickup: new Date().toISOString(), pickupLabel: 'Következő látogatáskor',
    name: user.name, items: [`1× ${chosen.name} (ajándék)`], total: 0, pay: 'gift', student: null, done: false });
  save('orders', orders);
  render();
  scrollTo({ top: 0, behavior: 'smooth' });
});

const render = () => { renderGift(); renderDecks(); };
document.addEventListener('userchange', render);
render();
