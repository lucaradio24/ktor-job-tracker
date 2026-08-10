---
name: JobTracker
description: Un compagno calmo e preciso per tenere in ordine la ricerca di lavoro.
colors:
  graphite-background: "#0d0e10"
  graphite-surface: "#141517"
  graphite-surface-muted: "#111214"
  graphite-surface-strong: "#1a1b1e"
  porcelain: "#f2efe8"
  text-muted: "#b8b5ae"
  text-subtle: "#8d8b85"
  border: "#2b2c30"
  border-strong: "#414247"
  focus-violet: "#b6a8dc"
  danger: "#dc8580"
  danger-soft: "#352120"
  status-amber: "#d5ad69"
  status-amber-soft: "#30291d"
  status-violet: "#ad9fd4"
  status-violet-soft: "#292534"
  status-green: "#87b99a"
  status-green-soft: "#203027"
  status-rose: "#d9847f"
  status-rose-soft: "#352321"
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
    backgroundColor: "{colors.porcelain}"
    textColor: "{colors.graphite-background}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    minHeight: "2.75rem"
  button-secondary:
    backgroundColor: "{colors.graphite-surface}"
    textColor: "{colors.porcelain}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 1rem"
    minHeight: "2.75rem"
  input:
    backgroundColor: "{colors.graphite-surface}"
    textColor: "{colors.porcelain}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 0.75rem"
    minHeight: "2.75rem"
  application-card:
    backgroundColor: "{colors.graphite-surface-strong}"
    textColor: "{colors.porcelain}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  navigation-active:
    backgroundColor: "{colors.graphite-surface-strong}"
    textColor: "{colors.porcelain}"
    typography: "{typography.title}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    minHeight: "2.75rem"
---

# Design System: JobTracker

## Overview

**Creative North Star: “Night Route”**

JobTracker è un ambiente operativo calmo e preciso per un percorso che può essere stressante. Il linguaggio visivo Graphite + Porcelain riduce il rumore: grafite per la struttura, porcellana per testo e azioni primarie, colori di stato attenuati per orientarsi senza trasformare la dashboard in un pannello neon.

La metafora del percorso vive nella board a tre tappe attive, nelle linee di avanzamento e nella cronologia della candidatura. Gli esiti sono separati dalla pipeline, così ciò che è ancora in corso resta immediatamente leggibile. La mascotte è contestuale: aiuta negli stati vuoti o orientativi, non compete con il lavoro quotidiano.

**Key Characteristics:**

- Graphite + Porcelain, con temi scuro e chiaro coerenti.
- Topbar compatta con Candidature, Statistiche e Impostazioni.
- Pipeline attiva a tre colonne: Candidature, Colloqui, Offerte.
- Esiti separati: Non selezionate e Ritirate.
- Inspector contestuale affiancato su desktop e a pagina intera su mobile.
- Profondità sobria, moto breve e densità regolabile.

## Colors

### Primary

- **Porcelain:** testo ad alto contrasto e azione primaria nel tema scuro; nel tema chiaro il rapporto si inverte con il grafite.
- **Graphite:** fondo, superfici e struttura della workspace; non è nero assoluto e non usa effetti vetro.

### Semantic signals

- **Ambra:** candidatura inviata.
- **Violetto:** colloquio.
- **Verde:** offerta.
- **Rosa:** esito negativo, ritiro o pericolo contestuale.
- **Violetto focus:** focus visibile e non affidato al solo colore.

### Named Rules

**The Porcelain Action Rule.** L’azione primaria usa il massimo contrasto Graphite/Porcelain; i colori di stato non diventano CTA generiche.

**The Semantic Signal Rule.** I colori di stato mantengono lo stesso significato in board, card, inspector, filtri e statistiche.

## Typography

**Display Font:** Manrope (con Segoe UI e system-ui come fallback)  
**Body Font:** Manrope (con Segoe UI e system-ui come fallback)

Una sola famiglia sostiene sia la scansione operativa sia i messaggi orientativi. La gerarchia nasce da dimensione, peso, spaziatura e contenuto. Date, durate e conteggi usano numeri tabulari quando la comparazione beneficia dell’allineamento.

### Hierarchy

- **Display:** titoli principali brevi.
- **Headline:** titoli di pagina, inspector e dialoghi.
- **Title:** intestazioni di colonne, card e gruppi di impostazioni.
- **Body:** istruzioni, descrizioni e dati.
- **Label:** eyebrow, stati e categorie compatte; maiuscolo solo se aiuta la scansione.

### Named Rules

**The One Family Rule.** Manrope è l’unica voce tipografica; non si introducono font decorativi per creare enfasi.

## Layout

La shell usa una topbar sticky e compatta. Su desktop la dashboard presenta tre colonne equivalenti per `APPLIED`, `INTERVIEW` e `OFFER`; `REJECTED` e `WITHDRAWN` vivono nella vista separata “Uscite”. Quando una card è selezionata, l’inspector entra come regione contestuale accanto alla board. Su mobile la navigazione occupa una seconda riga, la pipeline usa filtri di stato e l’inspector sostituisce la lista come vista a pagina intera con ritorno esplicito.

Statistiche e Impostazioni riusano la stessa shell e la stessa larghezza di lettura. La densità “Compatta” riduce la spaziatura senza ridurre i target interattivi; “Comoda” resta il valore predefinito.

**The Scan Before Scroll Rule.** Titolo, ricerca, azione primaria, tappe attive ed esiti devono essere comprensibili prima dello scorrimento.

**The Active Route Rule.** La board mostra soltanto il lavoro vivo; gli esiti restano raggiungibili ma non occupano colonne permanenti.

## Elevation & Motion

Il sistema è quasi piatto a riposo. Bordi e differenze tonali definiscono la struttura; le ombre compaiono per hover, menu, inspector e dialoghi. Le transizioni usano durate brevi di 120–180 ms. La preferenza “Movimento ridotto” e `prefers-reduced-motion` eliminano animazioni e scorrimento fluido non essenziali.

**The Earned Elevation Rule.** Un elemento riceve profondità soltanto quando il suo comportamento giustifica un piano superiore.

**The Motion Has Meaning Rule.** Il movimento chiarisce selezione, entrata o feedback; non viene usato come decorazione continua.

## Shapes

Gli angoli sono morbidi ma operativi: piccoli sui campi, medi su card e pulsanti, ampi sui dialoghi. Le pillole sono riservate a stati e conteggi. I bordi sono sottili e neutri; indicatori più marcati compaiono per focus, selezione e stato.

## Components

### Topbar

Logo, navigazione principale e account convivono in una barra compatta. Lo stato attivo combina superficie, bordo, indicatore e `aria-current`. Su mobile la navigazione diventa una seconda riga a tre destinazioni senza perdere le etichette.

### Application Board

La board desktop visualizza tre tappe attive con una route line e consente il drag-and-drop. Menu di stato e inspector forniscono alternative esplicite e accessibili. Su mobile si seleziona una tappa per volta tramite filtri con conteggio.

### Application Card

Azienda e ruolo sono la gerarchia primaria; data, città e stato completano la scansione. Selezione, focus e trascinamento sono distinti. L’apertura della card mostra l’inspector senza trasformare tutta la card in un link opaco.

### Application Inspector

Mostra identità, stato corrente, tempo dalla candidatura, tempo nello stato quando noto, cronologia e azioni di avanzamento o uscita. Su desktop è contestuale; su mobile è una vista completa con controllo “Indietro”. La modifica dei dettagli resta separata dal cambio di stato.

### Forms

La creazione chiede azienda, ruolo, data e stato, con `APPLIED` come default ma tutti e cinque gli stati selezionabili. Città, link e note restano secondari. La chiusura di un form sporco richiede conferma. La modifica descrittiva usa un flusso separato e non duplica i controlli di stato dell’inspector.

### Statistics

Le metriche usano numeri e barre CSS, senza librerie grafiche. Evidenziano candidature recenti, avanzamenti, offerte, distribuzione corrente, città e copertura dello storico. Le durate compaiono solo quando esiste un timestamp attendibile e dichiarano la dimensione del campione.

### Settings

Tema (`dark`, `light`, `system`), densità (`comfortable`, `compact`) e movimento (`system`, `reduced`) sono preferenze locali applicate subito. Il tema di sistema reagisce al dispositivo; l’inizializzazione anticipata evita lampeggi di tema.

### Mascot Moments

Il robot appare negli stati vuoti e nei momenti che richiedono orientamento o rassicurazione. Nella dashboard piena resta assente.

## Data-informed UX

`statusHistory` è una cronologia di transizioni posseduta dal server. Alla creazione il server registra come prima transizione lo stato scelto con il proprio timestamp; i cambi successivi aggiungono una voce solo quando lo stato cambia davvero. Inspector e statistiche trattano i record legacy senza cronologia come dati sconosciuti, mai come durata zero.

`nextAction` è intenzionalmente rinviato: non compare nel modello, nei form o nell’interfaccia finché non esiste un bisogno prodotto confermato.

## Do’s and Don’ts

### Do

- Usare Graphite/Porcelain per gerarchia e azioni; riservare i segnali cromatici allo stato.
- Tenere le tre tappe attive separate dagli esiti.
- Garantire focus visibile, target tattili e alternativa esplicita al drag-and-drop.
- Mostrare “dato non disponibile” o la copertura del campione quando manca lo storico.
- Usare il robot solo quando aggiunge orientamento.

### Don’t

- Reintrodurre sidebar, palette corallo o una quarta colonna degli esiti.
- Trasformare il tema scuro in neon, glassmorphism o estetica gaming.
- Inventare durate dai record legacy senza timestamp.
- Usare colore, drag-and-drop o animazione come unico canale informativo.
- Aggiungere `nextAction` in modo speculativo.
