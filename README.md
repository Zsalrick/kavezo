# Arkánum Kávéház · Győr

Iskolai projekt: egy tarot ihlette kávéház weboldala. Statikus oldal (HTML, CSS, JS), build nélkül, GitHub Pages-en fut:
https://zsalrick.github.io/kavezo/

## Oldalak

| Oldal | Fájl |
|---|---|
| Főoldal | `index.html` |
| Árlista és online rendelés | `arlista.html` (+ `order.js`) |
| Nyereményjáték (napi kártyahúzás) | `nyeremenyjatek.html` (+ `game.js`) |
| Kedvezmények és hűségprogram | `kedvezmenyek.html` |
| Események | `esemenyek.html` |
| Kapcsolat, nyitvatartás, térkép | `kapcsolat.html` |

Közös részek: `site.js` (fejléc hamburger menüvel, lábléc, belépés), `style.css`.
Árlista és tarot pakli: `data.js`. Árazás, kedvezmények, nyitvatartás: `pricing.js`.

## Tudnivalók

- A bejelentkezés és a fizetés **nem valódi**. Minden adat a böngésző `localStorage`-ában van.
- Revolut Pay: szimulált fizetőablak, ötszörös hűségponttal.
- Teszt: `node check.js`
- Helyi futtatás: `python -m http.server`, majd http://localhost:8000

Fotók: [Unsplash](https://unsplash.com/license). Térkép: © OpenStreetMap.
