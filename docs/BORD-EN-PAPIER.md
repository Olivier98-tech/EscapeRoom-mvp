# 🎬 Spelverloop — hints & wat je op bord of papier zet

Per oefening: **is het duidelijk?**, **is de hint oké?**, en **wat schrijf je op
het bord of op papier?** Niks hoeft geprint te worden — met de hand kan.
De klok **telt op vanaf 0** (geen deadline); je rangschikt op snelste tijd.

---

## Level 1 — Binaire cijfercode → `9284`
- **Duidelijk:** ja. De QR legt uit dat elk cijfer een 4-bit binair getal is (1001, 0010, 1000, 0100).
- **Hint:** oké — leert de bitwaarden 8-4-2-1 met een veilig voorbeeld (0110 = 6), verklapt geen cijfer.
- 📋 **Op bord:** `8  4  2  1` (plaatswaarden). Zo reken je 1001 → 8+0+0+1 = **9**.

## Level 2 — Firewall / Caesar → `unlock_firewall --code=vencode`
- **Duidelijk:** grotendeels; ze moeten herkennen dat de tekst één plek verschoven is.
- **Hint:** oké (U→T, i→h; de code zelf ontcijferen).
- 📋 **Op bord:** het alfabet `A B C … Z` met een pijl **−1** (elke letter één terug).

## Level 3 — Hexadecimaal → `save_the_world`
- **Duidelijk:** ja (er staat dat het hex is).
- **Hint:** oké (0x53=S, 0x41=A, wijst op de underscores).
- 📋 **Op bord/papier:** „gebruik een ASCII-tabel (online)" + één voorbeeld `0x41 = A`.

## Level 4 — Kluis → `◉ ⚪ ▲ ⚫`
- **Duidelijk:** ja; het scherm zegt „de reeks zit in de kluis" + de kluiscode-hint.
- **Hint:** oké (wijst naar de kluis, waarschuwt ◉ ≠ ◎; verklapt code noch volgorde).
- 📦 **Op papier / in de kluis:** briefje **◉ ⚪ ▲ ⚫**, slot op **435**.
  (Kluiscode = lettertelling van **SAVE·THE·WORLD** = 4·3·5.)

## Level 5 — Priemkwadraten → `4, 9, 25, 49`
- **Duidelijk:** ja, mits ze priemgetallen kennen.
- **Hint:** iets gul (noemt 2, 3, 5, 7) maar laat het kwadrateren zelf doen.
- 📋 **Op bord:** `priemgetallen: 2 3 5 7 11 …`

## Level 6a — Geheugen-doolhof → `7381`
- **Duidelijk:** ja; start bij adres **B**, volg de pijlen (→), noteer bij elke stop de waarde tot EINDE.
- **Hint:** oké (waarschuwt voor de lus-lokvallen, verklapt het pad niet).
- 📋 **Op bord/papier:** niets nodig — volledig op het scherm.

## Level 6b — Bouw de zin
- **Duidelijk:** ja; de emoji's staan in dezelfde volgorde als de zin, met feedback „17/17 — alleen de volgorde".
- **Hint:** oké (geeft de opbouw, niet de hele zin).
- 📋 **Op bord:** de emoji-reeks groot: `📡 👁️ 🌍 🔒 🚫 🧠 ⚠️ ⏳`.

## Level 6c — ASCII-code → `rescue`
- **Duidelijk:** ja.
- **Hint:** oké (114=r, 101=e, ASCII-tabel).
- 📋 **Op bord/papier:** dezelfde ASCII-verwijzing als level 3.

---

## Kort samengevat — wat je klaarzet

**Op het bord (met de hand):**
`8 4 2 1` (L1) · alfabet met −1 (L2) · „ASCII-tabel online" + `0x41=A` (L3/6c) ·
`priemgetallen 2 3 5 7` (L5) · de emoji-reeks `📡 👁️ 🌍 🔒 🚫 🧠 ⚠️ ⏳` (L6b).

**Op papier / in de kluis:**
briefje **◉ ⚪ ▲ ⚫**, slot op **435** (L4).

---

## Antwoordsleutel (spelleider)

| Level | Antwoord |
|---|---|
| 1 | `9284` (binair 1001·0010·1000·0100) |
| 2 | `unlock_firewall --code=vencode` |
| 3 | `save_the_world` |
| 4 | `◉ ⚪ ▲ ⚫` — kluiscode `435` |
| 5 | `4, 9, 25, 49` |
| 6a | `7381` (doolhof B→G→D→F) |
| 6b | het signaal wordt gezien de wereld is vergrendeld de mensheid niet bewust van gevaar de tijd dringt |
| 6c | `rescue` |
| Admin-PIN | `2150` |
