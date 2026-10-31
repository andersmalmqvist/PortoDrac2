# Porto Drac – Sant Elm, Mallorca

En privat, tvåspråkig (svenska/engelska) familjesajt för lägenheten Porto Drac i Sant Elm på Mallorca. Sajten är statisk HTML, CSS och JavaScript utan ramverk, byggsteg eller externa beroenden. Allt – bilder, typsnitt och ikoner – ligger lokalt.

## Snabbstart

Krav: Node.js (finns redan på datorn, version 24 eller senare rekommenderas).

```powershell
cd "C:\Users\Anders Malmqvist\Documents\Standardprojekt"
npm start
```

Öppna sedan **http://localhost:3000** i webbläsaren. Stoppa servern med `Ctrl+C`.

Om port 3000 är upptagen provar servern 3001, 3002 och så vidare. Den valda adressen skrivs i terminalen.

Sajten måste köras via servern. Om du öppnar `index.html` direkt med `file://` kan webbläsaren blockera ikonspriten (`bilder/icons.svg`) på grund av säkerhetsregler.

## Sidor

| Fil | Svenska | Engelska |
|---|---|---|
| `index.html` | Hem | Home |
| `lagenheten.html` | Lägenheten | The Apartment |
| `omradet.html` | Området | The Area |
| `galleri.html` | Galleri | Gallery |
| `utflykter.html` | Utflykter | Days Out |
| `praktiskt.html` | Praktiskt | Practical Info |
| `kontakt.html` | Kontakt | Contact |

## Struktur

```text
Standardprojekt/
├── index.html … kontakt.html   sju sidor
├── css/style.css               designsystem, komponenter, responsivt, utskrift
├── js/main.js                  språkväxling, mobilmeny, scroll-animationer, formulär
├── js/gallery.js               filter och lightbox på gallerisidan
├── bilder/                     25 foton, ikonsprite, favicon och credits.json
├── fonts/                      Inter och Playfair Display (woff2, lokalt)
├── server.js                   liten statisk server utan npm-paket
├── package.json                npm start
└── README.md
```

## Tvåspråkighet

Svenska är standardspråk. Varje synlig text har två attribut:

```html
<h2 data-sv="Välkommen" data-en="Welcome">Välkommen</h2>
```

Språkknappen **SV | EN** i headern byter all text, sparar valet i `localStorage` och uppdaterar `<html lang>`. Du kan också länka direkt till engelska med `?lang=en`, till exempel `http://localhost:3000/galleri.html?lang=en`.

Viktigt när du redigerar:

- Ändra både `data-sv`/`data-en` **och** den synliga texten mellan taggarna.
- Sätt aldrig `data-sv`/`data-en` på ett element som innehåller ikoner eller andra element. Lägg attributen på en inre `<span>` i stället, annars raderas barnen vid språkbyte.
- Bilder har `alt` plus `data-sv-alt`/`data-en-alt`.
- Formulärfält har `data-label-sv`/`data-label-en` som används i e-posttexten.

## Checklista innan sidan används

Alla uppgifter nedan är medvetet generella eller platshållare. Uppdatera dem innan sidan visas för familjen.

- [ ] **E-post:** `portodrac@example.com` finns i footern, på kontaktsidan och i formulärets `data-mailto`.
- [ ] **Telefon/WhatsApp:** `+46 70 000 00 00`, `tel:+46700000000` och `https://wa.me/46700000000`.
- [ ] **Exakt adress:** står som ”Sant Elm, Andratx, Mallorca – exakt adress skickas när vi har bestämt datumen” på Praktiskt och Kontakt.
- [ ] **WiFi:** nätverksnamnet står som ”Porto Drac” och lösenordet skickas inför ankomst. Fyll i det ni vill visa.
- [ ] **Nycklar och incheckning:** kontrollera tider (15.00/10.00), nyckelbox och rutin vid avresa.
- [ ] **Lägenhetsfakta:** 2 sovrum, 2 badrum, 4–6 gäster, terrass, WiFi, AC, tvättmaskin, diskmaskin, parkering på gatan, barnsäng på begäran. Justera om något inte stämmer.
- [ ] **Avstånd och restider:** 2 min till stranden, 10 min till Port d'Andratx, 40 min till Palma, 45 min till flygplatsen.
- [ ] **Rekommendationer:** restauranger, bageri, marknadsdag i Andratx och båttider till Sa Dragonera.
- [ ] **Nödnummer och vård:** 112, Guardia Civil 062, Centro de Salud i Andratx, apotek och Son Espases. Kontrollera adresser och tider.
- [ ] **Bilder:** byt gärna stockbilderna mot familjens egna foton (se nedan).

## Byta bilder

Bilderna är nedskalade till max 1400 px bredd (hero 1920 px) och komprimerade för lokal användning. Enklaste sättet att byta är att behålla filnamnen i `bilder/` och ersätta innehållet med egna foton i samma format (JPEG, gärna 4:3 eller 3:2, max cirka 1400 px bredd). Då behöver ingen HTML ändras.

Om du byter filnamn måste du också uppdatera `src`, `data-full` (galleriets lightbox) och `og:image` där bilden används.

Bilderna är placeholders från Wikimedia Commons. Innan sajten delas offentligt bör de ersättas med egna foton, eller så behåller du attributionen nedan enligt respektive licens.

## Bildkällor och licenser

Alla bilder är hämtade från Wikimedia Commons och har beskärts eller skals om. Licenserna gäller även de bearbetade filerna. Fullständig maskinläsbar lista finns i `bilder/credits.json`.

| Fil | Motiv | Fotograf | Licens | Källa |
|---|---|---|---|---|
| `andratx.jpg` | Torget i Andratx | Malopez 21 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Andratx,_Placa_Espa%C3%B1a.jpg) |
| `bedroom.jpg` | Sovrum med vit säng | michaeljohnbutton | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Mallorca-_Orient_Holiday_Sept-13_-_10042256286.jpg) |
| `cala-en-basset.jpg` | Cala en Basset | Chixoy | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Cala_en_Basset.JPG) |
| `coastal-path.jpg` | Kustlandskap på Mallorca | Rosa-Maria Rinkl | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Mallorca_-_Nordostk%C3%BCste.jpg) |
| `deia.jpg` | Olivlundar vid Deià | Geraint Owen from Llundain, London, Londres | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Deia,_Mallorca_(1515822272).jpg) |
| `hero.jpg` | Sant Elms bukt och Sa Dragonera | Cathy-ABL | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Sant_Elm_Mallorca.jpg) |
| `kitchen.jpg` | Lantligt kök med kopparkärl | Rosa-Maria Rinkl | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Alte_K%C3%BCche_in_der_Finca.jpg) |
| `la-trapa.jpg` | La Trapa ovanför Sant Elm | GerritR | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Blick_auf_La_Trapa_bei_Sant_Elm,_Mallorca.jpg) |
| `living-room.jpg` | Vardagsrum med rustika detaljer | Rosa-Maria Rinkl | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Kaminzimmer_in_Finca.jpg) |
| `mallorca-sea.jpg` | Turkost hav | Krejpe | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Mallorca_sea.jpg) |
| `mercat.jpg` | Mercat de l'Olivar i Palma | Wikimedia Commons | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Mercat_de_l%27Olivar.JPG) |
| `olive-trees.jpg` | Olivlund | Christoph Strässler | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Olive_Trees_at_Finca_p%C3%B9blica_Mortitx.jpg) |
| `palma-cathedral.jpg` | Katedralen La Seu i Palma | Thomas Wolf, www.foto-tw.de | [CC BY-SA 3.0 de](https://creativecommons.org/licenses/by-sa/3.0/de/) | [Commons](https://commons.wikimedia.org/wiki/File:Kathedrale_von_Palma_II.jpg) |
| `palma-old-town.jpg` | Palmas stadshus i kvällsljus | Thomas Wolf, www.foto-tw.de | [CC BY-SA 3.0 de](https://creativecommons.org/licenses/by-sa/3.0/de/) | [Commons](https://commons.wikimedia.org/wiki/File:Rathaus_Palma_de_Mallorca_abends.jpg) |
| `patio.jpg` | Inre patio i mallorkinsk stil | Rafael Ortega Díaz | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Patio-Interior-Finca-Raixa-Mallorca.jpg) |
| `port-andratx.jpg` | Hamnen i Port d'Andratx | Dietmar Rabich | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Port_d%27Andratx_(Mallorca,_Spain),_Harbour_--_2009_--_1540.jpg) |
| `sa-dragonera-sunset.jpg` | Solnedgång vid Sa Dragonera | Ce Ele 415 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Sunset_in_Sa_Dragonera_Islet.jpg) |
| `sa-dragonera.jpg` | Ön Sa Dragonera | Andrés Nieto Porras from Palma de Mallorca, España | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Sa_Dragonera_(4337500771).jpg) |
| `sant-elm-bay.jpg` | Stranden och skäret Pantaleu | Kai Alpers(KaiHB) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Sant_Elm_Pantaleu.JPG) |
| `sant-elm-sunset.jpg` | Solnedgång över havet vid Sant Elm | Foto Fitti | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:07159_Sant_Elm,_Illes_Balears,_Spain_-_panoramio_(89).jpg) |
| `sant-elm-village.jpg` | Båt vid kajen i Sant Elm | A.Savin | [FAL](https://artlibre.org/licence/lal/en/) | [Commons](https://commons.wikimedia.org/wiki/File:Mallorca_Sant_Elm_asv2023-04_img3.jpg) |
| `soller.jpg` | Sóller och bergen | Heuschrecke (Dmitry Tonkonog and Ksenia Fedosova) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Panorama_Soller_and_Ofre.jpg) |
| `terrace.jpg` | Terrass med havsutsikt i Sant Elm | Foto Fitti | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:07159_Sant_Elm,_Illes_Balears,_Spain_-_panoramio_(24).jpg) |
| `tramuntana.jpg` | Serra de Tramuntana | Geir Hval (www.MacWhale.eu) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Serra_de_Tramuntana_(2016.05.17).jpg) |
| `valldemossa.jpg` | Valldemossa | Abrget47j | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons](https://commons.wikimedia.org/wiki/File:Valldemossa_view.jpg) |

## Tillgänglighet och kvalitet

Sajten är kontrollerad med:

- axe-core (WCAG 2 A/AA): inga rapporterade brott på någon av de sju sidorna.
- Tre bredder: 390 px mobil, 900 px tablet och 1440 px desktop – ingen horisontell scroll.
- Alla interna länkar och bilder laddar; inga konsolfel.
- Tangentbord: skip-link flyttar fokus till `<main>`, mobilmenyn stängs med Escape och lämnar fokus på menyknappen.
- Språkväxling och valet sparas mellan sidor och omladdningar.
- Galleriets filter, lightbox, piltangenter, Escape och fokusretur fungerar.
- Formuläret validerar obligatoriska fält och öppnar e-postprogrammet; inget skickas till en server.
- Utskrift: meny, footer och knappar döljs och allt innehåll visas.

## Tekniska anteckningar

- Ingen spårning, inga cookies, ingen analys och `<meta name="robots" content="noindex, nofollow">`.
- Formuläret är helt klientsidigt. Det öppnar en `mailto:`-länk med ifyllda uppgifter och lagrar inget.
- Typsnitten Inter och Playfair Display ligger i `fonts/` och laddas lokalt.
- Ikonerna är en SVG-sprite i `bilder/icons.svg`. Användning: `<svg class="icon"><use href="bilder/icons.svg#icon-pin"></use></svg>`.
- `prefers-reduced-motion` respekteras; då stängs scroll-animationerna av.
- Servern skickar `Cache-Control: no-cache` så att ändringar syns direkt vid utveckling.

## Felsökning

**”Port 3000 används”** – servern väljer automatiskt nästa lediga port och skriver adressen i terminalen.

**Ikonerna syns inte** – öppna sidan via `npm start`, inte via `file://`.

**Formuläret gör inget** – kontrollera att webbläsaren har ett e-postprogram kopplat. Sidan visar en bekräftelse och öppnar `mailto:`-länken.

**Bilderna ser mjuka ut** – de är komprimerade för lokal användning. Byt till egna foton i högre upplösning om du vill ha skarpare bilder.
