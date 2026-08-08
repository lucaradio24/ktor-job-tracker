---
target: showArchived / ApplicationsDashboard
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
timestamp: 2026-08-08T17-01-46Z
slug: ts-applicationsdashboard-applicationsdashboard-tsx
---
Method: degraded single-context (sub-agent e browser live non esposti in questa sessione)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | Il conteggio cambia, ma non identifica chiaramente il filtro attivo e non viene annunciato. |
| 2 | Match System / Real World | 3/4 | Le categorie “Non selezionate” e “Ritirate” sono comprensibili e coerenti col prodotto. |
| 3 | User Control and Freedom | 2/4 | Manca “Tutte”/“Azzera filtro”; il chip premuto non può essere deselezionato. |
| 4 | Consistency and Standards | 2/4 | `aria-pressed` comunica un toggle, ma il click imposta sempre lo stesso filtro. |
| 5 | Error Prevention | 2/4 | Un filtro senza risultati può lasciare una lista vuota senza spiegazione. |
| 6 | Recognition Rather Than Recall | 3/4 | Le etichette sono riconoscibili, ma mancano conteggi per categoria e un riepilogo attivo. |
| 7 | Flexibility and Efficiency | 2/4 | Ricerca e filtri sono combinabili, ma manca un percorso rapido per tornare alla vista completa. |
| 8 | Aesthetic and Minimalist Design | 3/4 | Composizione sobria; header, chip e conteggio competono leggermente tra loro. |
| 9 | Error Recovery | 2/4 | Il recupero da “nessun risultato per il filtro” non è esplicito. |
| 10 | Help and Documentation | 1/4 | Il contesto è semplice, ma non c’è un aiuto inline sul modello di filtro. |
| **Totale** |  | **22/40** | **Acceptable: base solida, ma la gestione degli stati filtro va resa affidabile.** |

## Design Specificity Verdict

La superficie è coerente con JobTracker: esiti separati dalla pipeline, palette semantica e controlli compatti. Le scelte sono però ancora da “dashboard generica” nella parte di filtraggio: i chip non mostrano il numero di elementi, non esiste un filtro esplicito “Tutte” e il conteggio isolato richiede di interpretare da soli quale stato rappresenti.

Il detector statico è risultato pulito per il componente target: nessun rilievo automatico. Non è una prova di correttezza UX: il detector non verifica transizioni di stato, selezioni filtrate, empty state condizionali o contrasto calcolato sui token.

## What's Working

- La ricerca viene applicata prima del filtro di archivio: l’utente può restringere per azienda/ruolo e poi per esito.
- I filtri sono veri `<button>` con `aria-pressed`, target da 44px circa e focus visibile.
- La responsività mobile porta i filtri su una riga separata e mantiene i target tattili; colori e superfici usano token esistenti.

## Priority Issues

### [P1] Il filtro attivo non ha un reset reale

**Dove:** `ApplicationsDashboard.tsx:401-418`.

**Perché conta:** cliccando due volte sullo stesso chip non si torna alla vista completa; manca “Tutte” e `archiveFilter` resta valorizzato anche dopo il ritorno alla pipeline. `aria-pressed` fa inoltre aspettare un comportamento toggle che l’implementazione non offre.

**Fix:** introdurre un’opzione “Tutte” con stato `null`, oppure rendere il chip attivo deselezionabile; decidere esplicitamente se il filtro debba essere resettato entrando/uscendo dall’archivio.

### [P1] L’inspector può mostrare una candidatura esclusa dal filtro

**Dove:** `ApplicationsDashboard.tsx:259-267`.

**Perché conta:** in archivio `visibleApplications` usa `archivedApplications`, non `filteredArchivedApplications`. Se si seleziona una candidatura “Non selezionata” e poi si clicca “Ritirate”, la card sparisce ma l’inspector può restare aperto sul record non più visibile.

**Fix:** derivare `visibleApplications` dal risultato già filtrato e chiudere l’inspector quando l’elemento selezionato esce dal set visibile.

### [P1] Lo stato vuoto controlla il conteggio sbagliato

**Dove:** `ApplicationsDashboard.tsx:421-437`.

**Perché conta:** con candidature archiviate presenti ma nessuna corrispondente al filtro, `archivedApplications.length > 0` è vero e viene renderizzata una `ApplicationsList` vuota: l’utente vede spazio vuoto e “0”, senza spiegazione né azione di recupero.

**Fix:** controllare `filteredArchivedApplications.length`; distinguere almeno tra “Nessuna candidatura archiviata” e “Nessuna candidatura corrisponde al filtro”, con azione “Mostra tutte”.

### [P1] Contrasto insufficiente del filtro attivo nel tema chiaro

**Dove:** `ApplicationsDashboard.module.css:252-256`, token `frontend/src/styles/tokens.css:95-98`.

**Perché conta:** il testo attivo “Non selezionate” è circa 4.32:1 su `--color-status-rose-soft` e “Ritirate” circa 4.22:1 su `--color-status-slate-soft`; sotto il 4.5:1 richiesto da WCAG 1.4.3 per testo normale di questa dimensione.

**Fix:** scurire i token del testo nel tema chiaro o usare un testo neutro ad alto contrasto, mantenendo il colore di stato su bordo/background/indicatore.

### [P2] Il cambiamento del filtro non è esplicito per tecnologie assistive

**Dove:** `ApplicationsDashboard.tsx:400-423`.

**Perché conta:** il gruppo non ha un nome semantico, il conteggio è solo un numero e la lista aggiornata non viene annunciata. Un utente screen reader deve dedurre cosa sia cambiato dal focus sul bottone.

**Fix:** aggiungere `role="group"` e `aria-label`, un riepilogo come “Ritirate: 0 candidature” con `aria-live="polite"`, e un nome accessibile al conteggio.

### [P2] Il badge “Archivio” non rappresenta il contesto di ricerca

**Dove:** `ApplicationsDashboard.tsx:256-258`, `345-368`.

**Perché conta:** con una ricerca attiva il badge continua a mostrare il totale globale dell’archivio, mentre il conteggio nella vista mostra il sottoinsieme ricercato. I due numeri sono corretti separatamente ma ambigui insieme.

**Fix:** etichettare il badge come totale archivio oppure farlo seguire dal contesto corrente; il conteggio principale della vista dovrebbe essere il riepilogo dominante.

## Persona Red Flags

**Alex, power user:** non può azzerare il filtro con una scorciatoia o con un secondo click; per tornare alla lista completa deve uscire dall’archivio e rientrare, con stato precedente persistente.

**Sam, keyboard/screen reader:** i bottoni sono raggiungibili e hanno `aria-pressed`, ma manca il nome del gruppo e non viene annunciato che il risultato è diventato vuoto; il contrasto dei chip attivi fallisce nel tema chiaro.

**Riley, stress tester:** la combinazione “archivio con record” + filtro senza corrispondenze produce una lista vuota senza empty state; cambiare filtro mentre l’inspector è aperto può lasciare contenuto fuori dal risultato corrente.

## Minor Observations

- `.filterAction:last-child` lega il colore semantico all’ordine DOM: aggiungere “Tutte” o riordinare i chip può assegnare il tono sbagliato.
- Le `aria-label` dei chip duplicano e allungano il testo visibile; un nome di gruppo più un’etichetta breve sarebbe più naturale.
- Il mobile nasconde la scrollbar dei filtri: oggi ci sono solo due chip, ma se il set cresce l’overflow diventerebbe poco discoverable.

## Questions to Consider

- Vuoi che “Tutte” sia sempre visibile come terzo chip, o preferisci che il chip attivo si deselezioni con un secondo click?
- Il conteggio dell’archivio deve indicare sempre il totale globale oppure il totale filtrato dalla ricerca corrente?

## Recommended Actions

1. **[P1] `$impeccable harden`**: correggere stati vuoti, selezione dell’inspector e percorso di reset.
2. **[P1] `$impeccable audit`**: riallineare contrasto e annunci semantici dei filtri.
3. **[P2] `$impeccable clarify`**: definire copy per riepilogo, zero risultati e azione “Mostra tutte”.
4. **[P2] `$impeccable polish`**: rifinire gerarchia di chip, conteggi e overflow mobile.
