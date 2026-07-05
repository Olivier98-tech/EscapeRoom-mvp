# 🌐 Centraal spelleider-dashboard opzetten (gratis, ~2 min)

Met een gratis Firebase-project zie je op **één scherm** (`control.html`) alle
groepen live en kun je per groep **skippen, unlocken en tijd bijgeven** — op
afstand, over alle laptops heen. Zonder deze stap werkt het spel gewoon per
toestel (via `admin.html`).

## Stappen

1. Ga naar <https://console.firebase.google.com> → **Project toevoegen**. Geef
   een naam (bv. `escaperoom-2150`), Google Analytics mag uit. → **Aanmaken**.
2. Linkermenu **Build → Realtime Database** → **Database maken** → kies regio
   (bv. *europe-west1*) → start in **testmodus** (open regels). → Inschakelen.
3. Ga naar ⚙️ **Projectinstellingen** → onderaan bij **Je apps** klik het web-icoon
   **`</>`** → geef een bijnaam → **App registreren**. Kopieer het getoonde
   `firebaseConfig`-object.
4. Open `js/firebase-config.js` in dit project en plak de waarden
   (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`). De
   **`databaseURL`** is cruciaal — die eindigt op `…firebasedatabase.app`.
5. Push naar GitHub (of gebruik lokaal). Open daarna **`control.html`** als
   spelleider (PIN **2150**).

## Testen

Start op een ander toestel de missie (met een groepsnaam). Binnen enkele
seconden verschijnt die groep in `control.html`, met knoppen **⏭ Skip · 🔓 Unlock
· +5 · +10**.

## Belangrijk (privacy & beveiliging)

- Er wordt alleen gedeeld: groepsnaam, huidig level, resterende tijd. Geen
  antwoorden of persoonsgegevens.
- **Testmodus = open database**: iedereen met de link kan lezen/schrijven. Prima
  tijdens de les. Zet de database daarna weer dicht: Realtime Database → **Rules**
  → `".read": false, ".write": false`.
- De PIN op `control.html` houdt leerlingen uit het bedienpaneel; hij beveiligt
  de database zelf niet.
