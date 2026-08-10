---
target: workspace candidature e flusso detail/edit
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
timestamp: 2026-08-06T16-15-58Z
slug: frontend-src-app-workspace-page-tsx
---
Method: dual-agent (A: impeccable_design_review · B: impeccable_detector)

## Design Health Score

| # | Euristica | Punteggio | Problema principale |
|---|---|---:|---|
| 1 | Visibilità dello stato | 2 | Loading ed errori esistono, ma creazione, spostamento, eliminazione e salvataggio non hanno una conferma coerente. |
| 2 | Corrispondenza col mondo reale | 3 | Linguaggio chiaro, con incoerenza tra “Rifiutate” e “Non selezionata”. |
| 3 | Controllo e libertà | 2 | Mancano undo sugli spostamenti e protezione delle modifiche non salvate. |
| 4 | Coerenza e standard | 2 | Colori solidi, ma dettaglio, feedback e sheet mobile non seguono ancora la direzione approvata. |
| 5 | Prevenzione errori | 2 | Validazione e conferma eliminazione aiutano; uscire dall’edit può perdere modifiche senza avviso. |
| 6 | Riconoscimento, non memoria | 3 | Azioni principali visibili; l’ellipsis resta l’unico indizio per il cambio stato. |
| 7 | Flessibilità ed efficienza | 2 | Drag-and-drop, menu e ricerca sono buoni; mancano acceleratori per modifica/salvataggio. |
| 8 | Estetica e minimalismo | 2 | Base pulita, ma box, gradienti e ombre appiattiscono la gerarchia; i form espongono troppo. |
| 9 | Recupero dagli errori | 2 | Errori campo e rollback esistono; l’errore board non offre retry, dismiss o contesto sufficiente. |
| 10 | Aiuto e documentazione | 1 | Mancano guida al primo utilizzo, hint sul cambio stato e aiuto contestuale. |
| **Totale** |  | **21/40** | **Accettabile — base valida, ma serve un passaggio strutturale.** |

## Design Specificity Verdict

JobTracker è moderatamente riconoscibile, non ancora inconfondibile. Il mock `jobtracker-flow-02-focus-first.png` ha un percorso visivo specifico — topbar calma, headline rassicurante, unica CTA corallo, ricerca/archivio, pipeline in quattro fasi — ma l’implementazione si avvicina ancora a un dark SaaS generico. L’interesse grafico mancante è strutturale: ritmo delle fasi, superfici più piatte, composizione dei form e feedback di stato; non servono altre decorazioni.

Il detector non ha trovato problemi nel target principale. La scansione dei componenti ha prodotto un solo warning, `border-accent-on-rounded` in `ApplicationsDashboard.module.css:295`, valutato falso positivo: il bordo rosa identifica semanticamente l’archivio Ritirate. L’ispezione live del workspace è stata bloccata dal redirect Auth0 a `/login`; non è stato quindi mostrato alcun overlay nel browser.

## Impressione generale

La direzione visuale è buona: calma, leggibile, semanticamente coerente. Il salto di qualità non passa da più effetti, ma da una grammatica unica per “ho agito / sta salvando / è riuscito / è fallito / posso annullare”. La maggiore opportunità è collegare toast e dirty save bar in un unico sistema di feedback.

## Cosa funziona

- Colori di stato coerenti tra colonne, card, chip, drop target e filtri mobile.
- Buone fondamenta accessibili: controlli nativi, errori inline, focus visibile, alternativa esplicita al drag-and-drop.
- Il corallo resta quasi sempre riservato all’azione primaria, evitando rumore.

## Carico cognitivo

Alto: 4/8 controlli falliscono. I form mostrano sette campi senza separare essenziali e opzionali; l’edit espone contemporaneamente campi, Save, Cancel e Delete; una card ritirata può offrire cinque azioni diverse. La board, invece, resta leggibile grazie alle quattro fasi e a una sola CTA primaria.

## Priority Issues

### [P1] Nessun modello per modifiche non salvate

L’edit usa valori non controllati, mostra sempre Salva/Annulla e permette di uscire senza avviso. Introdurre una action bar sticky in stile Auth0 che compare solo dopo la prima modifica: messaggio “Hai modifiche non salvate”, “Annulla modifiche” e “Salva modifiche”. Deve restare durante scroll ed errori, mostrare lo stato di salvataggio e scomparire solo a successo. Su mobile va sopra la safe area senza coprire la danger zone. Aggiungere guardia su back/refresh/navigazione e `Ctrl/Cmd+S`.

### [P1] Feedback delle mutation frammentato

Creazione, spostamento, eliminazione e salvataggio non condividono una strategia. Introdurre una sola regione toast applicativa: `role="status"` per successi, `role="alert"` per errori; top-right sotto la topbar su desktop e sotto la topbar su mobile. Usare toast per eventi globali/conclusi, mantenere gli errori dei campi inline, non sostituire la conferma distruttiva. Per spostamenti rapidi evitare un successo rumoroso per ogni drag: movimento ottimistico come feedback visivo, annuncio accessibile della persistenza e toast solo per errore/rollback o undo significativo.

### [P1] Contrasto insufficiente delle CTA corallo

Bianco su `#ff5146` misura circa 3.22:1, sotto AA per testo normale. Usare testo notte `#10161e` sul corallo attuale, oppure scurire il corallo a circa `#d93c34` mantenendo il bianco. Non schiarire ulteriormente il corallo in hover.

### [P2] Form create/detail non ancora composti come nei mock

Il dettaglio ha un header quasi grezzo e manca un ritorno esplicito. Separare Azienda, Posizione, Stato e Data come essenziali; collassare Città, Link e Descrizione sotto “Informazioni opzionali”. Centrare l’edit a larghezza leggibile, dare una testata chiara e spostare l’eliminazione in una danger zone separata. La save bar condizionale deve sostituire il footer permanente.

### [P2] Board troppo incorniciata e sheet mobile incompleto

Colonne e card hanno troppi piani visivi a riposo. Appiattire le superfici, eliminare l’ombra permanente delle card e riservare elevazione a hover/drag; rendere più autorevole il ritmo delle colonne con spine semantiche. Il menu mobile va trasformato in un vero bottom sheet con titolo “Cambia stato”, Annulla, focus contenuto, scrim interattivo e stato corrente. Il detector segnala il bordo alto rosa dell’archivio, ma in questo contesto è intenzionale e va mantenuto.

## Persona Red Flags

**Alex, power user:** Salva è attivo anche senza modifiche; manca `Ctrl/Cmd+S`; nessun undo; azioni rapide di stato possono ricevere risposte fuori ordine.

**Sam, tastiera/screen reader:** i cambi di stato non hanno annunci italiani dedicati; il contenitore draggable include controlli interattivi; il bottom sheet è ancora un menu visuale; il contrasto bianco/corallo fallisce AA.

**Giulia, job seeker al primo utilizzo:** quattro colonne vuote ripetono il vuoto invece di indicare il primo passo; l’ellipsis non insegna il cambio stato; “Rifiutate” è più duro di “Non selezionate”; la chiusura silenziosa del salvataggio non rassicura.

## Osservazioni minori

- Preferire “Non selezionate” in tutta l’app.
- La ricerca vuota dovrebbe offrire “Cancella ricerca” e il momento mascotte previsto dal design system.
- Le date delle card senza anno diventano ambigue su archivi lunghi.
- La topbar non dovrebbe dichiarare sempre la board come pagina corrente nel dettaglio.
- I filtri extra del mock 03 non servono ancora: aggiungerli solo quando esiste un bisogno reale.

## Questions to Consider

- Dopo un edit salvato, è meglio restare nel dettaglio con conferma o tornare alla board con toast? L’attuale redirect immediato non chiude bene nessuna delle due esperienze.
- Per gli spostamenti di stato vogliamo un undo esplicito o basta rollback+errore quando la persistenza fallisce?
- Il carattere distintivo di JobTracker deve venire soprattutto dal ritmo della pipeline, dal linguaggio rassicurante o dai micro-feedback di avanzamento?
