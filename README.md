# Arkánum Kávéház · Győr

Iskolai projekt: egy tarot ihlette kávéház weboldala. Statikus oldal (HTML, CSS, JS), build nélkül, GitHub Pages-en fut:
https://zsalrick.github.io/kavezo/

## Oldalak

| Oldal | Fájl |
|---|---|
| Főoldal | `index.html` |
| Rendelés (kínálat árakkal, kosár) | `rendeles.html` (+ `order.js`) |
| Tarot paklik, ajándék pakli beváltása | `pakli.html` (+ `pakli.js`) |
| Kedvezmények és hűségprogram | `kedvezmenyek.html` |
| Események | `esemenyek.html` |
| Kapcsolat, nyitvatartás, térkép | `kapcsolat.html` |
| Pult nézet a személyzetnek (demo) | `pult.html` |

Közös részek: `site.js` (fejléc hamburger menüvel, lábléc, belépés), `style.css`.
Kínálat és tarot paklik: `data.js`. Árazás, hűségprogram, nyitvatartás: `pricing.js`.

## Tudnivalók

- A bejelentkezés és a fizetés **nem valódi**. Minden adat a böngésző `localStorage`-ában van.
- Revolut Pay: szimulált fizetőablak. A vendég ötször annyi RevPointsot kap (ezt a Revolut adja, nem mi).
- Hűségprogram: 100 Ft = 1 pont, szintek a „Bolond útja” szerint (0, 300, 700, 1000, 1700 pont), szintenként minden 10./9./8./7./6. kávé ingyenes, 1000 pontért pakli (levonódik, a szint az összes gyűjtött pontból számol), napi bónusz termék +25 pont, a hét menüje (hetente változik, a data.js-ben állítható) 2× pont.
- Teszt: `node check.js`
- Ha JS vagy CSS fájl változik, a HTML-ekben emeld a `?v=` számot (pl. `?v=3`), különben a böngésző a régi fájlt használhatja a cache-ből.
- Helyi futtatás: `python -m http.server`, majd http://localhost:8000

QR-kód a plakátokra (a weboldalra visz, embléma a közepén): `assets/qr-weboldal.svg`

Fotók: [Unsplash](https://unsplash.com/license). Térkép: © OpenStreetMap.
