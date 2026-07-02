# 🕹 Escape Room 2150 — Red de Mensheid van de Kwaadaardige Code

Een digitale escape room voor teams van 2–6 spelers. Zes levels vol codes,
raadsels en één fysieke zoektocht, verpakt in een retro-terminal thema.
Volledig statisch — draait lokaal of via GitHub Pages, geen server nodig.

## 🚀 Snel starten

**Lokaal:** open `index.html` in een browser.
**Online:** push naar GitHub — de workflow in `.github/workflows/static.yml`
publiceert automatisch naar GitHub Pages.

**Spelleiders:** lees eerst
[`docs/FACILITATOR-GUIDE.md`](docs/FACILITATOR-GUIDE.md) (antwoorden + admin portaal)
en [`docs/PREPARATION-CHECKLIST.md`](docs/PREPARATION-CHECKLIST.md) (klaarzetten).

## 📁 Structuur

```
├── index.html              # Intro + start van de missie (start de timer)
├── admin.html              # Spelleider portaal (PIN-beveiligd)
├── finale.html             # Overwinningsscherm
├── levels/
│   ├── level1.html         # QR-cijfercode
│   ├── level2.html         # Firewall (Caesar-cijfer)
│   ├── level3.html         # Hexadecimaal
│   ├── level4.html         # Symbolencode (fysieke aanwijzing!)
│   ├── level5.html         # Kernel-matrix (priemkwadraten)
│   └── level6.html         # Finale: drie sloten
├── css/style.css           # Eén gedeeld design-systeem
├── js/game.js              # Gedeelde engine (timer, voortgang, hints, lockouts)
├── assets/audio + images
└── docs/                   # Spelleider-documentatie
```

## ✨ Features

- **Globale afteltimer** — zichtbaar op elk level, instelbaar (5–240 min) via het admin portaal, met +5/+10 min tijdens het spel
- **Voortgangsbeveiliging** — levels zijn niet via de URL over te slaan; voortgang overleeft een refresh
- **Hint-systeem** — na 2 foute pogingen per puzzel wordt een hint beschikbaar
- **Eerlijke lockouts** — 45 sec na een fout antwoord, opgeslagen in localStorage (refresh omzeilt niets)
- **Geheime antwoorden** — antwoorden staan alleen als hash in de code; view-source verklapt niets
- **Admin portaal** — timer, reset, blokkades wissen en levels overslaan voor vastgelopen teams
- **Geluid aan/uit** — toggle in de HUD, voorkeur wordt onthouden
- **Toegankelijkheid** — toetsenbordfocus zichtbaar, `prefers-reduced-motion` gerespecteerd

## 🔧 Belangrijkste fixes t.o.v. de vorige versie

1. **Level 2 was onoplosbaar**: het ontsleutelde antwoord was `VENCODE`, maar de code
   controleerde op `ENCODE`. Gefixt.
2. **Level 6**: dubbele/conflicterende scriptblokken verwijderd; de zin-puzzel vereist
   nu weer de volledige zin (een debug-shortcut accepteerde slechts één woord).
3. **Lockouts**: 5 minuten → 45 seconden, én persistent (een refresh reset ze niet meer).
4. **Audio**: autoplay werkt niet in moderne browsers; audio start nu via knoppen met
   nette fallbacks.
5. **Structuur**: alles in één mappenstructuur, gedeelde CSS/JS, geen dubbele bestanden,
   consistente bestandsnamen.
6. **Verhaal**: „laatste level"-tekst bij level 4 klopte niet (er kwamen er nog twee) — gecorrigeerd.
7. **Level 5** had geen enkele aanwijzing voor het juiste patroon; de puzzel is nu
   zelfstandig oplosbaar via een raadsel (kwadraten van de eerste vier priemgetallen).

## 🔐 Antwoorden aanpassen

Antwoorden staan als salted hash in `js/game.js`. Nieuw antwoord instellen:

```bash
node -e '
const SALT="EC2150:";
function hash(s){s=SALT+s;let h=5381;for(let i=0;i<s.length;i++){h=((h*33)^s.charCodeAt(i))>>>0;}return h.toString(16);}
console.log(hash("jouw nieuwe antwoord in kleine letters"));
'
```

Plak de uitkomst in de `HASHES`-tabel bovenin `js/game.js`. Antwoorden worden
vóór het hashen genormaliseerd: kleine letters, spaties samengevoegd, getrimd.
