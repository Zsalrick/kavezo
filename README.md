# Arkánum Kávéház · Győr – iskolai projekt

Tarot ihlette kávéház statikus weboldala (HTML/CSS/JS, build nélkül).

- **Árlista + online rendelés** – kosár, átvételi idő, rendelésszám
- **Fake bejelentkezés** – bármilyen adattal működik, hűségpontokat gyűjt
- **Revolut Pay (szimulált)** – 5× hűségpont; valódi fizetés nem történik
- **Nyereményjáték** – napi egy tarot-lap húzás, egyes lapok kuponkódot adnak
- **Kedvezmények** – diák −15%, kuponok, 500 pont = 1000 Ft
- Események (tarot-tanfolyam, pakli-workshop), nyitvatartás, térkép

Minden adat a böngésző `localStorage`-ában van, nincs szerver.

Futtatás: `python -m http.server`, majd http://localhost:8000
Árazás teszt: `node check.js`

Kávéfotók: [Unsplash](https://unsplash.com/license) (ingyenes licenc). Térkép: © OpenStreetMap.
