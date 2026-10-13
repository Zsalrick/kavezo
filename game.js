// Nyereményjáték: naponta egy húzás a paklinkból.
const today = () => new Date().toLocaleDateString('sv'); // helyi dátum, ÉÉÉÉ-HH-NN

function showCard(idx) {
  const c = DECK[idx];
  const face = $('#drawn');
  face.replaceChildren(el('span', 'num', c.num), el('span', 'sym', c.sym), el('span', 'name', c.name));
  face.hidden = false;
  $('#deck').disabled = true;
  $('.deck-label').textContent = 'Holnap újra húzhatsz';
  const msg = $('#draw-msg');
  msg.replaceChildren(el('p', 'card-text', c.text));
  if (c.coupon) {
    const win = el('div', 'win');
    const code = el('code', null, c.coupon);
    const copy = el('button', 'btn small', 'Kód másolása');
    copy.type = 'button';
    copy.onclick = () => navigator.clipboard?.writeText(c.coupon).then(() => { copy.textContent = 'Kimásolva ✓'; });
    win.append(el('p', null, 'Nyertél! A kuponkódod:'), code, copy, el('p', 'small', 'Add meg a kosárban a rendelésnél.'));
    msg.append(win);
  } else {
    msg.append(el('p', 'muted', 'Most nem nyertél kupont, de holnap újra próbálkozhatsz!'));
  }
}

$('#deck').onclick = () => {
  const idx = Math.floor(Math.random() * DECK.length);
  save('draw', { date: today(), idx });
  showCard(idx);
};
const draw = load('draw', null);
if (draw?.date === today() && DECK[draw.idx]) showCard(draw.idx);
