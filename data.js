// A kínálat. Itt írjátok át az árakat, neveket, leírásokat.
const photo = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const CATEGORIES = [
  { id: 'het', name: 'A hét menüje', img: '1565252556328-92ee4a9a0983', note: 'Hetente változik. Olcsóbb, mintha külön vennéd, és dupla hűségpont jár rá.' },
  { id: 'kavek', name: 'Kávék', img: '1609050471053-8636409f9f5b', note: 'Minden kávé mellé jár egy tarot kártya és hozzá egy kis magyarázó szöveg, ez benne van az árban. Növényi tejet felár nélkül adunk.' },
  { id: 'kulonleges', name: 'Különlegességek', img: '1559001724-fbad036dbc9e', note: 'A szirupokat mi főzzük, a pult mögött.' },
  { id: 'hideg', name: 'Hideg italok', img: '1461023058943-07fcbe16d735', note: 'Áprilistól októberig, és aki nagyon kéri, télen is.' },
  { id: 'sutemeny', name: 'Péksütemények', img: '1530610476181-d83430b64dcd', note: 'Reggelente frissen érkeznek. A kínálat változik, kérdezd a pultnál, mi van ma.' },
  { id: 'paklik', name: 'Tarot paklik', img: '1600429991827-5224817554f8', note: '78 lapos paklik, minden laphoz magyarázó kártyával. Belépve hűségpontból ajándékba is kérhetsz egyet.' },
];

const MENU = [
  { id: 'het', cat: 'het', arcana: 'Ezen a héten', name: 'A hét menüje', desc: '', price: 1700, pointsX: 2 },
  { id: 'espresso', cat: 'kavek', arcana: 'I · A Mágus', name: 'Espresso', desc: 'Tiszta erő, egyetlen kortyban.', price: 690, img: '1530174883092-c2a7aa3f1cfe' },
  { id: 'doppio', cat: 'kavek', arcana: 'XV · Az Ördög', name: 'Doppio', desc: 'Dupla adag, ha nagy a kísértés.', price: 890, img: '1612183515105-8c737ba7585d' },
  { id: 'americano', cat: 'kavek', arcana: 'VII · A Szekér', name: 'Americano', desc: 'Hosszú út, egyenletes lendület.', price: 790, img: '1572286258217-40142c1c6a70' },
  { id: 'cappuccino', cat: 'kavek', arcana: 'XVII · A Csillag', name: 'Cappuccino', desc: 'Selymes tejhab, csillagnyi kakaóval.', price: 990, img: '1563311977-d285756282dc' },
  { id: 'flatwhite', cat: 'kavek', arcana: 'II · A Főpapnő', name: 'Flat white', desc: 'Dupla ristretto, finom mikrohab.', price: 1190, img: '1541167760496-1628856ab772' },
  { id: 'latte', cat: 'kavek', arcana: 'III · Az Uralkodónő', name: 'Caffè latte', desc: 'Bőséges tej, lágy kávé.', price: 1190, img: '1593443320739-77f74939d0da' },
  { id: 'filter', cat: 'kavek', arcana: 'IX · A Remete', name: 'Filterkávé', desc: 'Lassan csepegtetve, elmélyüléshez.', price: 890, img: '1510591509098-f4fdc6d0ff04' },
  { id: 'levendula', cat: 'kulonleges', arcana: 'XVIII · A Hold', name: 'Levendulás latte', desc: 'Házi levendulaszirup, holdfény lágyságú.', price: 1390, img: '1559001724-fbad036dbc9e' },
  { id: 'matcha', cat: 'kulonleges', arcana: 'XIV · A Mértékletesség', name: 'Matcha latte', desc: 'Japán matcha, harmónia egy csészében.', price: 1290, img: '1515823064-d6e0c04616a7' },
  { id: 'jegeslatte', cat: 'hideg', arcana: 'XIX · A Nap', name: 'Jeges latte', desc: 'Hideg, napfényes, karamellás.', price: 1390, img: '1461023058943-07fcbe16d735' },
  { id: 'coldbrew', cat: 'hideg', arcana: 'XX · Az Ítélet', name: 'Cold brew', desc: '18 órán át áztatva, tisztán.', price: 1190, img: '1517701550927-30cf4ba1dba5' },
  { id: 'jegesmatcha', cat: 'hideg', arcana: 'VIII · Az Erő', name: 'Jeges matcha', desc: 'Frissítő, mégis kitartó.', price: 1390, img: '1717603545758-88cc454db69b' },
  { id: 'croissant', cat: 'sutemeny', arcana: '0 · A Bolond', name: 'Vajas croissant', desc: 'Új nap, új kezdet.', price: 790 },
  { id: 'csokiscroissant', cat: 'sutemeny', arcana: 'IV · Az Uralkodó', name: 'Csokis croissant', desc: 'Komoly és gazdag, étcsokoládéval.', price: 890 },
  { id: 'mandulas', cat: 'sutemeny', arcana: 'VI · A Szeretők', name: 'Mandulás croissant', desc: 'Mandula és vaj, tökéletes páros.', price: 990 },
  { id: 'fahejas', cat: 'sutemeny', arcana: 'X · A Szerencsekerék', name: 'Fahéjas csiga', desc: 'Körbe-körbe, mint a sors kereke.', price: 790 },
  { id: 'kakaos', cat: 'sutemeny', arcana: 'XI · Az Igazság', name: 'Kakaós csiga', desc: 'Az igazság az, hogy ez a kedvencünk.', price: 690 },
  { id: 'pogacsa', cat: 'sutemeny', arcana: 'XVI · A Torony', name: 'Sajtos pogácsa', desc: 'Rétegről rétegre épül.', price: 590 },
  { id: 'batyu', cat: 'sutemeny', arcana: 'XII · Az Akasztott', name: 'Túrós batyu', desc: 'Néha fejjel lefelé kell nézni a dolgokat.', price: 690 },
  { id: 'pakli-ejfel', cat: 'paklik', arcana: 'Éjlila és arany', name: 'Éjfél pakli', desc: 'A kávéház saját színei, holddal és csillagokkal.', price: 7990, design: 'ejfel' },
  { id: 'pakli-hajnal', cat: 'paklik', arcana: 'Krém és réz', name: 'Hajnal pakli', desc: 'Világos, papírszerű lapok rézszínű díszítéssel.', price: 7990, design: 'hajnal' },
  { id: 'pakli-macska', cat: 'paklik', arcana: 'Fekete és homok', name: 'Fekete macska pakli', desc: 'A Mágus macskája minden lapon ott van.', price: 8990, design: 'macska' },
  { id: 'pakli-erdo', cat: 'paklik', arcana: 'Mélyzöld és arany', name: 'Erdő pakli', desc: 'Esti erdő hangulat, levelekkel és gombákkal.', price: 7990, design: 'erdo' },
  { id: 'sajttorta', cat: 'sutemeny', arcana: 'XXI · A Világ', name: 'Sajttorta', desc: 'Kerek egész, erdei gyümölccsel.', price: 1290, img: '1524351199678-941a58a3df50' },
];

// A hét menüje: hetente itt írjátok át a tartalmát (a plakát: assets/het-menuje.jpg).
const WEEKLY = { pastry: 'Coraline fahéjas csiga', coffee: 'Cappuccino' };
MENU.find((m) => m.id === 'het').desc = `${WEEKLY.pastry}, ${WEEKLY.coffee.toLowerCase()} és kártyahúzás.`;
// Fotó nélküli tételek a kategória fotóját kapják.
MENU.forEach((m) => { m.img ??= CATEGORIES.find((c) => c.id === m.cat).img; });

// A nap bónusz terméke (+25 pont): a hét menüjét és a paklikat kivéve bármelyik lehet.
const BONUS_CANDIDATES = MENU.filter((m) => m.cat !== 'het' && m.cat !== 'paklik');
const dailyBonus = (d = new Date()) => BONUS_CANDIDATES[dailyPickIndex(d, BONUS_CANDIDATES.length)];
dailyBonus().bonus = true;

// Ezek számítanak kávénak a pecsétkártyán. A hét menüje pecsétet ad, de ingyen kávéként nem váltható be.
const COFFEE_IDS = ['espresso', 'doppio', 'americano', 'cappuccino', 'flatwhite', 'latte', 'filter', 'levendula', 'jegeslatte', 'coldbrew'];
MENU.forEach((m) => { m.coffee = m.id === 'het' || COFFEE_IDS.includes(m.id); m.freeable = COFFEE_IDS.includes(m.id); });

