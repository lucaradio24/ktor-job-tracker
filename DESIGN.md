---
name: JobTracker
description: Un compagno calmo e preciso per tenere in ordine la ricerca di lavoro.
colors:
  night-surface: "#10161e"
  night-surface-muted: "#0d131a"
  night-surface-strong: "#17202a"
  text-primary: "#f2f4f7"
  text-muted: "#a4abb4"
  text-subtle: "#7d8792"
  border: "#27313c"
  border-strong: "#394652"
  action-coral: "#ff5146"
  action-coral-soft: "#30280f"
  focus-violet: "#b18cff"
  danger: "#ff5b50"
  danger-soft: "#391b1b"
  status-amber: "#ffb800"
  status-amber-soft: "#382d0e"
  status-violet: "#b18cff"
  status-violet-soft: "#281e3e"
  status-green: "#35d77d"
  status-green-soft: "#123327"
  status-rose: "#ff5b50"
  status-rose-soft: "#391b1b"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 3.6vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Manrope, Segoe UI, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  pill: "999px"
spacing:
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.action-coral}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "3.25rem"
  button-secondary:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.night-surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 0.75rem"
    height: "2.75rem"
  application-card:
    backgroundColor: "{colors.night-surface-strong}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem 0.5rem"
  navigation-active:
    backgroundColor: "{colors.night-surface-strong}"
    textColor: "{colors.text-primary}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "3.5rem"
---

# Design System: JobTracker

## Overview

**Creative North Star: "Il Compagno di Ricerca"**

JobTracker deve sembrare un compagno calmo, competente e umano durante un percorso che può essere stressante. La sua precisione nasce da griglie leggibili, gerarchie nette e contenuti compatti; il calore arriva dal Corallo d'azione, dai Segnali di percorso e dalla mascotte, mai da decorazioni gratuite.

Il sistema combina superfici quasi piatte con una stratificazione sobria. Spaziatura e bordi separano la maggior parte dei livelli; le ombre entrano soltanto quando un elemento si solleva davvero, reagisce o richiede attenzione. La mascotte accompagna login, onboarding, stati vuoti, errori e successi; nella board piena può comparire soltanto come firma minima e non urgente.

**Key Characteristics:**

- Notte operativa scura, leggibile e priva di estetica gaming.
- Corallo d'azione raro e inequivocabile sulle azioni primarie.
- Segnali di percorso usati semanticamente per lo stato delle candidature.
- Superfici quasi piatte, bordi fini e profondità riservata agli stati reali.
- Mascotte utile e rassicurante, mai protagonista durante il lavoro intenso.

## Colors

La palette unisce una Notte operativa blu-nera, un Corallo d'azione caldo e Segnali di percorso ad alta leggibilità.

### Primary

- **Corallo d'azione:** riservato alle CTA primarie e ai momenti che fanno avanzare il flusso.

### Secondary

- **Segnali di percorso:** ambra per candidature, violetto per colloqui, verde per offerte e rosa per rifiuti o pericolo; ogni colore mantiene lo stesso significato in tutta l'app.

### Neutral

- **Notte operativa:** fondo globale e superfici scure leggermente differenziate per struttura.
- **Testo lunare:** tre livelli di contrasto per contenuto primario, secondario e ausiliario.
- **Bordi freddi:** separano superfici e controlli senza trasformare la schermata in una griglia rumorosa.

### Named Rules

**The One Action Rule.** Il Corallo d'azione identifica l'azione primaria; non va usato come riempimento decorativo.

**The Semantic Signal Rule.** I Segnali di percorso non cambiano significato tra board, card, filtri, statistiche o messaggi.

## Typography

**Display Font:** Manrope (con Segoe UI e system-ui come fallback)  
**Body Font:** Manrope (con Segoe UI e system-ui come fallback)

**Character:** una sola famiglia geometrica e cordiale sostiene sia la scansione operativa sia i messaggi più umani. Il sistema crea gerarchia con scala, peso e spaziatura, non con più font.

### Hierarchy

- **Display:** titoli principali brevi, compatti e autorevoli.
- **Headline:** titoli di dialoghi e superfici secondarie.
- **Title:** intestazioni di colonne, card e navigazione.
- **Body:** istruzioni, descrizioni e dati leggibili; mantenere brevi le righe nei flussi operativi.
- **Label:** eyebrow e categorie in maiuscolo soltanto quando aiutano l'orientamento.

### Named Rules

**The One Family Rule.** Manrope è l'unica voce tipografica; la gerarchia nasce dal contenuto, non dal cambio di carattere.

## Layout

La workspace desktop usa una shell a due colonne con sidebar stabile e area di lavoro fluida. La board presenta quattro colonne equivalenti e limita la larghezza complessiva per mantenere leggibili card e intestazioni. La scala spaziale segue multipli di 0.25rem, con 0.75-1rem per il ritmo interno e 1.5-2.5rem per separare regioni.

Tra 48rem e 64rem la sidebar diventa un rail a icone; sotto 48rem passa a navigazione orizzontale superiore e i contenuti diventano una singola colonna. Form e azioni passano da due colonne a una sotto 40rem, con un ulteriore accatastamento sotto 24rem. Le azioni principali diventano a larghezza piena quando lo spazio non consente una coppia leggibile.

**The Scan Before Scroll Rule.** La gerarchia deve chiarire titolo, azione primaria, ricerca e stati prima che l'utente inizi a scorrere.

## Elevation & Depth

Il sistema è quasi piatto a riposo. Le differenze tonali e i bordi definiscono la struttura; ombre leggere compaiono su card interattive, hover e menu, mentre l'ombra profonda è riservata a dialoghi e superfici modali.

### Shadow Vocabulary

- **Contatto:** ombra minima per separare una card azionabile dal contenitore.
- **Sollevamento:** ombra media durante hover, trascinamento o apertura di un menu.
- **Modalità:** ombra profonda per dialoghi e shell isolate.

### Named Rules

**The Earned Elevation Rule.** Un elemento riceve un'ombra soltanto quando il suo comportamento giustifica un piano superiore.

## Shapes

Gli angoli sono morbidi ma non giocosi: piccoli sui campi, medi su card e pulsanti, ampi sui dialoghi. Le pillole sono riservate a conteggi e stati compatti. I bordi sono sottili e freddi; i contorni colorati appaiono per focus, drop target o pericolo.

## Components

### Buttons

- **Shape:** rettangoli morbidi, con altezza tattile e raggio medio.
- **Primary:** Corallo d'azione, testo bianco e peso forte; una sola azione primaria per regione.
- **Hover / Focus:** lieve sollevamento o schiarimento, più focus violetto chiaramente visibile.
- **Secondary / Danger:** superfici scure bordate; il pericolo usa il rosa solo quando l'azione è distruttiva.

### Chips

- **Style:** colore di stato su fondo tonale abbinato, forma pill e testo compatto.
- **State:** semanticamente stabile; non usare i chip di stato come pulsanti generici.

### Cards / Containers

- **Corner Style:** raggio medio.
- **Background:** superficie forte sopra superficie regolare, con gradiente appena percepibile dove già presente.
- **Shadow Strategy:** quasi piatta a riposo, sollevata soltanto durante hover o drag.
- **Border:** sottile per definire la struttura.
- **Internal Padding:** compatto, in genere 0.75-1rem.

### Inputs / Fields

- **Style:** superficie scura, bordo forte, raggio piccolo e altezza minima adatta al tocco.
- **Focus:** bordo violetto con alone sottile; il focus non dipende dal solo colore.
- **Error / Disabled:** messaggio vicino al campo, rosa semantico e opacità soltanto per lo stato disabilitato.

### Navigation

Sidebar testuale su desktop, rail a icone su tablet e barra orizzontale su mobile. Lo stato attivo combina fondo tonale, indicatore ambra e `aria-current`; le etichette possono essere visivamente nascoste ma restano accessibili.

### Application Card

La card mostra azienda e ruolo come gerarchia primaria, poi data, città e stato. È trascinabile nella board desktop e mantiene sempre un accesso esplicito al dettaglio; il colore comunica lo stato senza sostituire il testo.

### Mascot Moments

La mascotte appare in login, onboarding, stati vuoti, errori e successi per spiegare o rassicurare. Nella board piena resta assente oppure compare come firma minima, senza competere con candidature e azioni.

## Do's and Don'ts

### Do:

- **Do** usare spaziatura e bordi come primo strumento di struttura.
- **Do** mantenere invariati i significati dei quattro Segnali di percorso.
- **Do** garantire focus visibile, target tattili e alternative esplicite al drag-and-drop.
- **Do** usare la mascotte per stati con un bisogno emotivo o orientativo reale.

### Don't:

- **Don't** trasformare il fondo scuro in neon, glassmorphism o estetica gaming.
- **Don't** aggiungere ombre a ogni contenitore.
- **Don't** usare il Corallo d'azione per più azioni concorrenti nella stessa regione.
- **Don't** usare la mascotte come decorazione ripetuta nella board piena.
