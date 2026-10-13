// Az árlista és a tarot pakli. Itt írjátok át az árakat, neveket, leírásokat.
const photo = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

const CATEGORIES = [
  { id: 'kavek', name: 'Kávék' },
  { id: 'kulonleges', name: 'Különlegességek' },
  { id: 'hideg', name: 'Hideg italok' },
  { id: 'sutemeny', name: 'Sütemények' },
];

const MENU = [
  { id: 'espresso', cat: 'kavek', arcana: 'I · A Mágus', name: 'Espresso', desc: 'Tiszta erő, egyetlen kortyban.', price: 690, img: '1530174883092-c2a7aa3f1cfe', featured: true },
  { id: 'doppio', cat: 'kavek', arcana: 'XV · Az Ördög', name: 'Doppio', desc: 'Dupla adag, ha nagy a kísértés.', price: 890, img: '1612183515105-8c737ba7585d' },
  { id: 'americano', cat: 'kavek', arcana: 'VII · A Szekér', name: 'Americano', desc: 'Hosszú út, egyenletes lendület.', price: 790, img: '1572286258217-40142c1c6a70' },
  { id: 'cappuccino', cat: 'kavek', arcana: 'XVII · A Csillag', name: 'Cappuccino', desc: 'Selymes tejhab, csillagnyi kakaóval.', price: 990, img: '1563311977-d285756282dc' },
  { id: 'flatwhite', cat: 'kavek', arcana: 'II · A Főpapnő', name: 'Flat white', desc: 'Dupla ristretto, finom mikrohab.', price: 1190, img: '1541167760496-1628856ab772' },
  { id: 'latte', cat: 'kavek', arcana: 'III · Az Uralkodónő', name: 'Caffè latte', desc: 'Bőséges tej, lágy kávé.', price: 1190, img: '1593443320739-77f74939d0da' },
  { id: 'filter', cat: 'kavek', arcana: 'IX · A Remete', name: 'Filterkávé', desc: 'Lassan csepegtetve, elmélyüléshez.', price: 890, img: '1510591509098-f4fdc6d0ff04' },
  { id: 'levendula', cat: 'kulonleges', arcana: 'XVIII · A Hold', name: 'Levendulás latte', desc: 'Házi levendulaszirup, holdfény lágyságú.', price: 1390, img: '1559001724-fbad036dbc9e', featured: true },
  { id: 'matcha', cat: 'kulonleges', arcana: 'XIV · A Mértékletesség', name: 'Matcha latte', desc: 'Japán matcha, harmónia egy csészében.', price: 1290, img: '1515823064-d6e0c04616a7' },
  { id: 'jegeslatte', cat: 'hideg', arcana: 'XIX · A Nap', name: 'Jeges latte', desc: 'Hideg, napfényes, karamellás.', price: 1390, img: '1461023058943-07fcbe16d735', featured: true },
  { id: 'coldbrew', cat: 'hideg', arcana: 'XX · Az Ítélet', name: 'Cold brew', desc: '18 órán át áztatva, tisztán.', price: 1190, img: '1517701550927-30cf4ba1dba5' },
  { id: 'jegesmatcha', cat: 'hideg', arcana: 'VIII · Az Erő', name: 'Jeges matcha', desc: 'Frissítő, mégis kitartó.', price: 1390, img: '1717603545758-88cc454db69b' },
  { id: 'croissant', cat: 'sutemeny', arcana: '0 · A Bolond', name: 'Vajas croissant', desc: 'Új nap, új kezdet.', price: 790, img: '1555507036-ab1f4038808a' },
  { id: 'sajttorta', cat: 'sutemeny', arcana: 'XXI · A Világ', name: 'Sajttorta', desc: 'Kerek egész, erdei gyümölccsel.', price: 1290, img: '1524351199678-941a58a3df50' },
  { id: 'reggeli', cat: 'sutemeny', arcana: 'X · A Szerencsekerék', name: 'Reggeli menü', desc: 'Cappuccino és croissant, suli előtt.', price: 1590, img: '1565252556328-92ee4a9a0983' },
];

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
