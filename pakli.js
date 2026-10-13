// Paklik oldal: vásárlás (kosárba) vagy beváltás 1000 hűségpontért (levonódik az egyenlegből, a szint marad).
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
    box.replaceChildren(el('p', null, `Bármelyik paklit kérheted ${DECK_POINTS} hűségpontért is.`));
    const b = el('button', 'btn', 'Belépés');
    b.type = 'button';
    b.dataset.login = '';
    box.append(b);
    return;
  }
  const p = el('p');
  if (user.points >= DECK_POINTS) {
    p.append(el('b', null, `${user.points} pontod van.`), ` ${DECK_POINTS} pontért bármelyik paklit kérheted, válaszd ki lent.`);
  } else {
    p.textContent = `Bármelyik paklit kérheted ${DECK_POINTS} hűségpontért. Neked most ${user.points} pontod van, még ${DECK_POINTS - user.points} kell.`;
  }
  box.replaceChildren(p);
  if (lastGiftNo) box.append(el('p', 'gift-done', `Beváltva! Rendelésszám: #${lastGiftNo}. A pultnál ezzel kérd.`));
}

function renderDecks() {
  const canRedeem = user?.points >= DECK_POINTS;
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
    if (canRedeem) {
      const gift = el('button', 'btn quiet', `${DECK_POINTS} pontért kérem`);
      gift.type = 'button';
      gift.onclick = () => {
        chosen = d;
        $('#gift-title').textContent = d.name;
        $('#gift-text').textContent = `${DECK_POINTS} pontot levonunk, utána ${user.points - DECK_POINTS} pontod marad. A szinted nem változik.`;
        openDialog($('#gift-dialog'));
      };
      actions.append(gift);
    }
    if (cart[d.id]) { const go = el('a', 'text-link', 'Kosár megnyitása'); go.href = 'rendeles.html#kosar'; actions.append(go); }
    text.append(actions);
    art.append(fan(d), text);
    return art;
  }));
}

$('#gift-dialog').addEventListener('close', () => {
  if ($('#gift-dialog').returnValue !== 'ok' || !chosen || !user) return;
  if (user.points < DECK_POINTS) return;
  user.points -= DECK_POINTS;
  saveUser();
  lastGiftNo = Math.floor(1000 + Math.random() * 9000);
  // A pult nézet ugyanebből a listából olvas, mint a rendelések.
  const orders = load('orders', []);
  orders.push({ no: lastGiftNo, at: new Date().toISOString(), email: user.email, pickup: new Date().toISOString(), pickupLabel: 'Következő látogatáskor',
    name: user.name, items: [`1× ${chosen.name} (${DECK_POINTS} pontból)`], total: 0, pay: 'gift', student: null, done: false });
  save('orders', orders);
  render();
  scrollTo({ top: 0, behavior: 'smooth' });
});

const render = () => { renderGift(); renderDecks(); };
document.addEventListener('userchange', render);
render();
