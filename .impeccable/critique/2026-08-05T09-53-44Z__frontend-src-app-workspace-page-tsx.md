---
target: frontend/src/app/(workspace)/page.tsx
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
timestamp: 2026-08-05T09-53-44Z
slug: frontend-src-app-workspace-page-tsx
---
# Impeccable Critique — JobTracker board

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|------:|-----------|
| 1 | Visibility of System Status | 2 | Loading e rollback esistono, ma create/edit/delete non hanno una chiusura positiva chiara. |
| 2 | Match System / Real World | 3 | Le fasi della ricerca sono naturali; terminologia dei rifiuti e copy tecnico sugli errori divergono. |
| 3 | User Control and Freedom | 2 | Dialoghi e conferme sono solidi; mancano undo, alternativa esplicita al drag e recupero delle ritirate. |
| 4 | Consistency and Standards | 2 | Token coerenti, ma dettaglio non rifinito, nav sempre attiva e controlli visibili/loading divergenti. |
| 5 | Error Prevention | 3 | Controlli nativi, default e conferma di eliminazione prevengono gli errori principali. |
| 6 | Recognition Rather Than Recall | 2 | Ricerca e creazione sono visibili; trascinamento e destinazioni della nav richiedono deduzione. |
| 7 | Flexibility and Efficiency | 1 | Il drag aiuta il puntatore, ma mancano alternativa rapida, lista, scorciatoie e batch. |
| 8 | Aesthetic and Minimalist Design | 3 | Palette e gerarchia sono sobrie; placeholder e stati vuoti ridondanti aggiungono rumore. |
| 9 | Error Recovery | 2 | Gli errori preservano i dati, ma non sempre indicano una ripresa concreta. |
| 10 | Help and Documentation | 0 | Nessun aiuto contestuale spiega movimento, stati o modello della board. |
| **Total** |  | **20/40** | **Acceptable — miglioramenti significativi necessari.** |

## Design Specificity Verdict

**Coerente ma solo parzialmente specifica per JobTracker.** Login, lingua italiana, Corallo d'azione, colori di stato e mascotte costruiscono identità. Il nucleo autenticato resta però una Kanban dark abbastanza generica da poter servire lead, ticket o progetti. Mancano momenti specifici della ricerca di lavoro: guida al primo movimento, ritirate, riconoscimento di colloqui e offerte, recupero dopo rifiuti o errori.

**Deterministic scan:** `detect.mjs --json frontend/src` è terminato con exit code 0 e zero finding. Il risultato conferma l'assenza di pattern meccanici vietati, ma non contraddice i problemi di IA e interazione emersi dalla review.

**Visual evidence:** due schede browser nuove hanno reindirizzato `/` a `/login`, quindi la board autenticata non era visibile. Login è stato verificato visivamente; la board è stata valutata dal sorgente. L'iniezione overlay non era disponibile perché la superficie browser consentiva sola lettura; nessun overlay utente viene dichiarato.

## Overall Impression

La base è ordinata, leggibile e tecnicamente prudente. La maggiore opportunità è trasformare una Kanban generica in uno strumento chiaramente dedicato alla ricerca di lavoro, senza perdere la sobrietà Operate.

## What's Working

- **Gerarchia operativa forte:** titolo, CTA singola, ricerca e quattro fasi seguono un ordine di scansione naturale.
- **Form difensivi:** controlli nativi, default, errori inline, busy state, Escape e conferma distruttiva riducono gli errori.
- **Semantica degli stati leggibile:** colore, testo e icona lavorano insieme; il significato non dipende dal solo colore.

## Priority Issues

### [P1] Le candidature ritirate scompaiono

I form e il modello espongono `WITHDRAWN`, ma la board non ha una destinazione per questo stato. Una candidatura ritirata non corrisponde ad alcuna colonna e diventa irraggiungibile.

**Fix:** mantenere “Ritirate” in un archivio/filtro chiaramente raggiungibile, come già deciso nel brief shape.

**Suggested command:** `$impeccable harden`

### [P1] Il cambio stato dipende dal puntatore ed è poco scopribile

La card è trascinabile per intero, mentre il controllo esplicito dello stato è commentato. Tastiera, screen reader e touch non hanno un percorso equivalente chiaro.

**Fix:** aggiungere un menu stato visibile e accessibile; mantenere il drag come acceleratore desktop con handle e annuncio del risultato.

**Suggested command:** `$impeccable adapt`

### [P1] Il breakpoint intermedio della board è incompleto

Le quattro colonne richiedono una larghezza minima, ma la regola a due colonne sotto 80rem è commentata e la colonna singola parte soltanto sotto 48rem.

**Fix:** progettare deliberatamente tablet e desktop compatto; il brief confermato prevede due colonne visibili o scorrimento orizzontale esplicito.

**Suggested command:** `$impeccable adapt`

### [P1] La navigazione promette destinazioni inesistenti e nasconde logout

“Impostazioni” punta a un placeholder invisibile, “Candidature” resta sempre attiva e il footer account/logout viene nascosto su tablet e mobile.

**Fix:** mostrare solo destinazioni reali, derivare lo stato attivo dalla rotta e conservare l'accesso account a ogni breakpoint.

**Suggested command:** `$impeccable clarify`

### [P2] Dettaglio e chiusura delle azioni sembrano incompleti

La pagina dettaglio/modifica non eredita la qualità della board e create/edit/delete terminano senza conferma positiva o ripristino del contesto.

**Fix:** progettare un dettaglio coerente, un ritorno chiaro alla board e feedback accessibili di successo.

**Suggested command:** `$impeccable polish`

## Cognitive Load

**Moderato: 3 checklist failure.** La board supera i test di focus, chunking, raggruppamento, gerarchia e memoria di lavoro. I form mostrano però sette gruppi simultanei, offrono più di quattro decisioni visibili e non applicano progressive disclosure ai campi opzionali. La ricerca senza risultati genera inoltre quattro messaggi di colonna non pertinenti.

## Emotional Journey

Il login rassicura e la board comunica controllo. Le valli arrivano quando l'utente deve scoprire il drag, incontra “Impostazioni” senza destinazione o perde una candidatura ritirata. L'eliminazione è gestita bene, ma creazione, modifica, movimento e offerta non ricevono una chiusura positiva coerente con “Il Compagno di Ricerca”.

## Persona Red Flags

### Alex — power user

- Nessuna alternativa rapida al drag, azione batch o scorciatoia.
- La vista lista resta commentata.
- La modifica interrompe il contesto della board e termina senza conferma.

### Sam — tastiera e screen reader

- Creazione e dialoghi hanno una buona base semantica.
- Il cambio stato non è esposto come controllo focusabile.
- Il drag sull'intera card confligge potenzialmente con link annidati.
- Account e logout spariscono ai breakpoint compatti.

### Jordan — first-timer

- Nessuna guida spiega il movimento delle card.
- Le voci della sidebar sembrano aree diverse ma puntano alla stessa pagina.
- “Impostazioni” appare disponibile senza esserlo.
- La ricerca vuota mostra messaggi sul ciclo di vita anziché spiegare che non ci sono risultati.

## Minor Observations

- `.card:not(.draggin):hover` contiene un refuso rispetto alla classe `.dragging`.
- Lo skeleton conserva spazio per il toggle vista commentato, causando layout shift.
- Un empty state globale con mascotte e CTA sarebbe più utile di quattro messaggi passivi.
- L'errore “controlla che il server sia raggiungibile” trasferisce responsabilità tecnica all'utente.
- Il not-found della candidatura usa “è stata rimosso” anziché “rimossa”.
- Il copy legale del login cita termini e privacy senza collegamenti.

## Questions to Consider

- Qual è il minimo segnale necessario per insegnare il cambio stato senza tutorial?
- Come può JobTracker riconoscere colloqui, offerte e rifiuti senza trasformarsi in un prodotto gamificato?
- Quale informazione specifica della ricerca di lavoro dovrebbe distinguere la card da una Kanban generica?
