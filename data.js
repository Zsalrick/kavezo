// Az árlista és a tarot pakli. Itt írjátok át az árakat, neveket, leírásokat.
const photo = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const CATEGORIES = [
  { id: 'napi', name: 'Napi menü', img: '1565252556328-92ee4a9a0983', note: 'Olcsóbb, mintha külön vennéd. Egész nap kérhető, amíg a nap sütijéből van.' },
  { id: 'kavek', name: 'Kávék', img: '1609050471053-8636409f9f5b', note: 'Minden kávé mellé jár egy kártya, ez benne van az árban. Növényi tejet felár nélkül adunk.' },
  { id: 'kulonleges', name: 'Különlegességek', img: '1559001724-fbad036dbc9e', note: 'A szirupokat mi főzzük, a pult mögött.' },
  { id: 'hideg', name: 'Hideg italok', img: '1461023058943-07fcbe16d735', note: 'Áprilistól októberig, és aki nagyon kéri, télen is.' },
  { id: 'sutemeny', name: 'Péksütemények', img: '1530610476181-d83430b64dcd', note: 'Reggelente frissen érkeznek. A kínálat változik, kérdezd a pultnál, mi van ma.' },
];

const MENU = [
  { id: 'napi', cat: 'napi', arcana: 'V · A Főpap', name: 'Napi menü', desc: '', price: 1690 },
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
  { id: 'croissant', cat: 'sutemeny', arcana: '0 · A Bolond', name: 'Vajas croissant', desc: 'Új nap, új kezdet.', price: 790, daily: true },
  { id: 'csokiscroissant', cat: 'sutemeny', arcana: 'IV · Az Uralkodó', name: 'Csokis croissant', desc: 'Komoly és gazdag, étcsokoládéval.', price: 890, daily: true },
  { id: 'mandulas', cat: 'sutemeny', arcana: 'VI · A Szeretők', name: 'Mandulás croissant', desc: 'Mandula és vaj, tökéletes páros.', price: 990, daily: true },
  { id: 'fahejas', cat: 'sutemeny', arcana: 'X · A Szerencsekerék', name: 'Fahéjas csiga', desc: 'Körbe-körbe, mint a sors kereke.', price: 790, daily: true },
  { id: 'kakaos', cat: 'sutemeny', arcana: 'XI · Az Igazság', name: 'Kakaós csiga', desc: 'Az igazság az, hogy ez a kedvencünk.', price: 690, daily: true },
  { id: 'pogacsa', cat: 'sutemeny', arcana: 'XVI · A Torony', name: 'Sajtos pogácsa', desc: 'Rétegről rétegre épül.', price: 590, daily: true },
  { id: 'batyu', cat: 'sutemeny', arcana: 'XII · Az Akasztott', name: 'Túrós batyu', desc: 'Néha fejjel lefelé kell nézni a dolgokat.', price: 690, daily: true },
  { id: 'sajttorta', cat: 'sutemeny', arcana: 'XXI · A Világ', name: 'Sajttorta', desc: 'Kerek egész, erdei gyümölccsel.', price: 1290, img: '1524351199678-941a58a3df50' },
];

// A nap péksüteménye a hét napja szerint forog. Fotó nélküli tételek a kategória fotóját kapják.
const dailyPastry = (d = new Date()) => { const p = MENU.filter((m) => m.daily); return p[d.getDay() % p.length]; };
MENU.find((m) => m.id === 'napi').desc = `Bármelyik kávé, a nap péksüteménye és egy kártya. Ma ${dailyPastry().name.toLowerCase()} a nap sütije.`;
MENU.forEach((m) => { m.img ??= CATEGORIES.find((c) => c.id === m.cat).img; });

const DECK = [
  { num: '0', name: 'A Bolond', sym: '✧', text: 'Új kezdet vár. Merj belevágni, ma egy új kávét is kipróbálhatsz!' },
  { num: 'I', name: 'A Mágus', sym: '∞', text: 'Minden készséged megvan a sikerhez. Használd az értelmedet és az akaraterődet!' },
  { num: 'II', name: 'A Főpapnő', sym: '☽', text: 'Hallgass az intuíciódra, a válasz már benned van.' },
  { num: 'III', name: 'Az Uralkodónő', sym: '❀', text: 'Bőség és kreativitás ideje. Kényeztesd magad egy croissant-nal.' },
  { num: 'VI', name: 'A Szeretők', sym: '♡', text: 'Döntés előtt állsz. A szíved jó iránytű.' },
  { num: 'VII', name: 'A Szekér', sym: '➶', text: 'Lendületben vagy: tartsd a fókuszt, és célba érsz.' },
  { num: 'IX', name: 'A Remete', sym: '✶', text: 'Szánj időt magadra. Egy csendes kávé is lehet meditáció.' },
  { num: 'X', name: 'A Szerencsekerék', sym: '✺', text: 'Fordul a kerék, és most neked kedvez!', coupon: 'SZERENCSE50' },
  { num: 'XVII', name: 'A Csillag', sym: '★', text: 'Remény és inspiráció. Jó irányba tartasz.', coupon: 'CSILLAG10' },
  { num: 'XVIII', name: 'A Hold', sym: '☾', text: 'Nem minden az, aminek látszik. Figyelj a részletekre.' },
  { num: 'XIX', name: 'A Nap', sym: '☀', text: 'Öröm, siker, napfény. Ragyogó napod lesz!', coupon: 'NAP20' },
  { num: 'XXI', name: 'A Világ', sym: '◯', text: 'Egy szakasz lezárul. Ünnepeld meg, amit elértél!' },
];
