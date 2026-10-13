# Arkánum Kávéház · Győr

Iskolai projekt: egy tarot ihlette kávéház weboldala. Statikus oldal (HTML, CSS, JS), build nélkül, GitHub Pages-en fut:
https://zsalrick.github.io/kavezo/

## Oldalak

| Oldal | Fájl |
|---|---|
| Főoldal | `index.html` |
| Árlista és online rendelés | `arlista.html` (+ `order.js`) |
| Tarot paklik, ajándék pakli beváltása | `pakli.html` (+ `pakli.js`) |
| Kedvezmények és hűségprogram | `kedvezmenyek.html` |
| Események | `esemenyek.html` |
| Kapcsolat, nyitvatartás, térkép | `kapcsolat.html` |
| Pult nézet a személyzetnek (demo) | `pult.html` |

Közös részek: `site.js` (fejléc hamburger menüvel, lábléc, belépés), `style.css`.
Árlista és tarot pakli: `data.js`. Árazás, hűségprogram, nyitvatartás: `pricing.js`.

## Tudnivalók

- A bejelentkezés és a fizetés **nem valódi**. Minden adat a böngésző `localStorage`-ában van.
- Revolut Pay: szimulált fizetőablak. A vendég ötször annyi RevPointsot kap (ezt a Revolut adja, nem mi).
- Hűségprogram: 100 Ft = 1 pont, szintenként minden 10./9./8. kávé ingyenes, ajándék pakli 1000 pontnál, utána minden 2000 pontnál.
- Teszt: `node check.js`
- Helyi futtatás: `python -m http.server`, majd http://localhost:8000

Fotók: [Unsplash](https://unsplash.com/license). Térkép: © OpenStreetMap.
