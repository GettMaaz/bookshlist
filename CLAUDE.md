# CLAUDE.md

Tento soubor poskytuje pokyny pro Claude Code (claude.ai/code) při práci s kódem v tomto repozitáři.

## Projekt

BookShlist: SPA v React 19 + Vite + TypeScript + Tailwind 3 pro vyhledávání knih (Open Library API) a jejich organizaci do wishlistů. Frontend je v tomto repozitáři; data wishlistů ukládá **samostatný REST backend, který v tomto repozitáři není**.

## Příkazy

```bash
npm run dev                          # Vite dev server
npm run build                        # vite build (no type-check step)
npm run lint                         # eslint .
npx vitest run                       # run all tests once (CI-style)
npx vitest run -t "create wishlist"  # run tests whose name matches
npm test                             # vitest in watch mode
npx tsc -p tsconfig.app.json --noEmit  # type-check (not part of any npm script)
```

Úskalí:
- `npm run lint` lintuje jen `**/*.{js,jsx}` (viz `eslint.config.js`), takže **nekontroluje** žádné zdrojové soubory `.ts`/`.tsx`. Typovou bezpečnost zajišťuje jen `tsc`.
- `tsc` aktuálně hlásí dvě už existující chyby v `src/main.tsx` (CSS side-effect import nemá deklaraci; `getElementById` může vrátit null). `vite build` `tsc` nespouští, takže build neblokují.
- Konfigurace Vitestu je uvnitř `vite.config.js` (`globals: true`, `jsdom`, setup soubor `src/setupTests.js`, který načítá `@testing-library/jest-dom`).

## Architektura

Routing (`src/App.tsx`): `BrowserRouter` s cestami `/` (Home), `/wishlist` (Wishlist), `/about` (About) a sdíleným `Navbar`. Home a About jsou statické; téměř veškerá logika je v `src/pages/Wishlist.tsx`.

**`Wishlist.tsx` je jedna velká stavová komponenta**, která vlastní veškerý stav (výsledky hledání, wishlisty, vybraná kniha/seznam, tři příznaky modálů) a všechna síťová volání. Podřízené komponenty (`WishlistCard`, `BookCard`) jsou prezentační a dostávají callbacky. Modály (přidání do seznamu / vytvoření seznamu / potvrzení smazání) jsou inline podmíněně renderované `fixed` overlaye ve stejném souboru, ne samostatné komponenty.

### Dvě externí API, natvrdo zapsané URL

- **Open Library** (`https://openlibrary.org/search.json?q=…&limit=5`): vyhledávání s debounce 300 ms, spustí se jen tehdy, když je dotaz delší než 3 znaky. Obálky se berou z `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`.
- **Backend wishlistů** na `http://localhost:3000` (natvrdo v `Wishlist.tsx`, bez env/konfigurace). Používané endpointy:
  - `GET /wishlists` → `[{ id, name }]`
  - `GET /wishlists/:id/books` → `Book[]` (načítá se jednou pro každý wishlist při mountu, `Promise.all`)
  - `POST /wishlists` `{ name }` → `{ id }`
  - `DELETE /wishlists/:id`
  - `POST /wishlists/:id/books` `{ key, title, author_name, cover_i }`
  - `DELETE /wishlists/:id/books/:key` (klíč prochází přes `encodeURIComponent`, protože klíče Open Library vypadají jako `/works/OL123W`)

### Konvence stavu a dat, na které je potřeba dávat pozor

- Pole `name` z backendu se v klientském typu `WishlistProp` (`src/types.ts`) mapuje na `text`; `Book.key` (klíč díla v Open Library) je všude identita knihy.
- Mutace nejdřív `await`ují fetch a pak přímo aktualizují lokální stav, bez kontroly `res.ok` a bez ošetření chyb či rollbacku, takže i neúspěšný požadavek změní UI. Ochrana proti duplicitám při přidání knihy do seznamu je jen na straně klienta (`books.some(b => b.key === …)`).
- „Create list“ nejdřív POSTne seznam a potom POSTne vybranou knihu do něj pomocí vráceného `id`.
- README stále zmiňuje ukládání do localStorage; to bylo odstraněno ve prospěch backend API (commity `02e77fd`, `9411915`, `d944ac3`).

### Testy

`src/pages/Wishlist.test.jsx` (čisté JSX, ne TS) renderuje `<Wishlist />` přímo, bez routeru, a v každém testu stubuje `global.fetch`. Stub větví podle URL: cokoli obsahující `localhost:3000` vrací odpověď backendu, vše ostatní vrací výsledky z Open Library. Nové testy, které se dotýkají stránky Wishlist, musí tento vzor dodržet, protože v testech není žádný skutečný backend ani síť. Inputy v modálech se hledají podle indexu (`getAllByRole("textbox")[1]` je input pro název při vytváření seznamu; `[0]` je vyhledávací pole) a tlačítka pro smazání podle textu `×`, takže změna pořadí v DOM nebo přidání inputů/tlačítek `×` rozbije stávající testy.

## Poznámky ke stylu kódu

- Text v UI je anglicky, ale některé identifikátory v `Wishlist.tsx` jsou česky (`nactiKnihy`, `knihy`, `hotove`, `nacti`) vedle anglických; drž se okolního pojmenování a stávající identifikátory nepřejmenovávej.
- Stylování jsou inline utility třídy Tailwindu (paleta amber/orange); žádná knihovna komponent se nepoužívá.
