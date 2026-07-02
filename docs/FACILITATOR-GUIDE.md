# 🎛 Spelleider Gids — Escape Room 2150

> ⚠️ **NIET DELEN MET SPELERS.** Dit document bevat alle antwoorden.

## Snel overzicht

| | |
|---|---|
| Spelers | 2–6 per team (ideaal: 3–4) |
| Duur | 60 min standaard (instelbaar via admin portaal) |
| Leeftijd | 10+ (puzzels 3 en 5 vragen wat reken-/decodeerwerk) |
| Benodigd | 1 laptop/tablet per team, geluid aan, telefoon met QR-scanner |
| Admin PIN | **2150** (het jaar uit het verhaal) |

## 🔑 Antwoordsleutel

| Level | Puzzel | Antwoord | Toelichting |
|---|---|---|---|
| 1 | QR-cijfercode | `9284` | Scanbare QR: onthult „sector 9, node 2, poort 8, sleutel 4" → 9284 |
| 2 | Firewall-commando | `unlock_firewall --code=VENCODE` | Caesar-cijfer shift −1: „Uifsf jt b tfdsfu dpef: WFODPEF" → „There is a secret code: VENCODE". Hoofdletters maken niet uit. |
| 3 | Hexadecimaal | `SAVE_THE_WORLD` | Hex → ASCII, mét underscores. Hoofdletters maken niet uit. |
| 4 | Symbolencode | `◉ ⚪ ▲ ⚫` (posities 3-2-5-1) | **Vereist een fysieke aanwijzing in de ruimte** — zie voorbereidingschecklist |
| 5 | Kernel-matrix | `04, 09, 25, 49` | „Priemkracht in het kwadraat": kwadraten van de eerste vier priemgetallen (2²=4, 3²=9, 5²=25, 7²=49) |
| 6a | QR-slot | `7381` | Scanbare QR: onthult „blok 7, ring 3, kern 8, poort 1" → 7381 |
| 6b | Zin-slot | `het signaal wordt gezien de wereld is vergrendeld de mensheid niet bewust van gevaar de tijd dringt` | 17 woorden, exacte volgorde |
| 6c | ASCII-slot | `rescue` | Decimale ASCII: 114 101 115 99 117 101 |

## 💡 Hint-systeem

- Na **2 foute pogingen** per puzzel wordt de hint-knop actief; spelers kiezen zelf of ze hem gebruiken.
- De eerste **3 foute pogingen** zijn vrij (geen wachttijd). Daarna loopt de blokkade op: 10, 20, 30… seconden, tot maximaal **1 minuut** per poging (blijft actief bij refresh — vals spelen door herladen werkt niet).
- Zit een groep muurvast? Gebruik in het admin portaal **„Wis alle blokkades"** of **„Sla over"**.

## 🎛 Admin portaal (`admin.html`)

1. Open `admin.html` (link „spelleider" staat onderaan de intro) en log in met PIN **2150**.
2. **Timer** — stel de duur in vóór de start (5–240 min) en geef tijdens het spel extra tijd met +5/+10.
3. **Start missie nu** — start de klok zonder de intro (bijv. bij herstart).
4. **Level overslaan** — markeert een level als voltooid; de spelers zien op de levelpagina direct een „ga direct verder"-melding.
5. **Reset alles** — wist timer, voortgang, pogingen en blokkades. Doe dit vóór elke nieuwe groep!

> ℹ️ Voortgang wordt per apparaat opgeslagen (localStorage). Open het admin portaal dus **op hetzelfde apparaat als waarop het team speelt**. Bij meerdere teams heeft elk apparaat zijn eigen spel — reset dus elk apparaat afzonderlijk.

## ⏱ Richtlijn tijdsverdeling (60 min)

| Onderdeel | Tijd |
|---|---|
| Intro + audio-briefing | 3 min |
| Level 1 — Cijfercode | 6 min |
| Level 2 — Firewall | 8 min |
| Level 3 — Hexa | 8 min |
| Level 4 — Symbolen (fysieke zoektocht) | 10 min |
| Level 5 — Kernel-matrix | 10 min |
| Level 6 — Drie finale sloten | 12 min |
| Finale + uitloop | 3 min |

Loopt een groep ≥5 min achter op schema? Wijs ze subtiel op de hint-knop, of geef +5 min via het portaal.

## 🛠 Problemen oplossen

| Probleem | Oplossing |
|---|---|
| Geen geluid | Browsers blokkeren autoplay: audio start pas na een klik. Controleer ook het 🔊-icoon in de HUD-balk. |
| „Systeem geblokkeerd" gaat niet weg | Admin portaal → „Wis alle blokkades". |
| Team is per ongeluk gereset | Admin → „Start missie nu", en sla reeds behaalde levels over met „Sla over". |
| Spelers proberen de broncode te lezen | Antwoorden staan alleen als hash in de code; view-source verklapt niets. |
| Pagina wijst terug naar de intro | Het spel is niet gestart op dat apparaat, of een eerder level is nog niet voltooid (levels kunnen niet worden overgeslagen via de URL). |

## 👥 Meerdere groepen tegelijk

De escape room draait volledig in de browser, zónder server. Elke groep speelt
daarom op een **eigen computer**: de timer, voortgang en blokkades worden per
toestel apart bewaard — groepen beïnvloeden elkaar niet.

- **Groepsnaam:** op de introdpagina kan elke groep een naam invullen. Die naam
  staat daarna in de HUD-balk (tijdens het spel) en bovenaan het admin portaal,
  zodat je meteen ziet welk toestel bij welke groep hoort.
- **Beheer per toestel:** open `admin.html` op de computer van de groep die je
  wilt beheren (timer, blokkades wissen, level overslaan, reset). Het admin
  portaal werkt op het toestel waar je het opent.
- **Reset vóór elke nieuwe groep:** gebruik „Reset alles" om timer, voortgang,
  pogingen, blokkades én de getoonde overgangsschermen te wissen.

## 🎬 Overgangsschermen

Elk level begint met een kort transitiescherm (verhaal + „▸ Start opdracht"),
zodat spelers eerst de context krijgen en nooit rechtstreeks in een opdracht
belanden — ook niet wanneer je een level **overslaat**: de groep gaat dan naar
het overgangsscherm van het volgende level, niet direct naar de puzzel.

## 🗺 Missiecontrole (dashboard)

Via de HUD-link „◈ missiecontrole" (of na elk opgelost level) komen spelers op
een overzichtspagina: welke missies opgelost zijn en hoe lang ze erover deden,
de snelste kraak, de totale speeltijd en hun volgende doelwit. De actieve missie
heeft een „▸ Hervat missie"-knop; nog niet bereikte missies staan geredacteerd
(met slot). Voltooide missies zijn alleen-lezen — ze tonen de tijd maar openen
niet opnieuw. Overgeslagen levels (via het admin portaal) tonen „vrijgegeven
door spelleider" in plaats van een tijd.
