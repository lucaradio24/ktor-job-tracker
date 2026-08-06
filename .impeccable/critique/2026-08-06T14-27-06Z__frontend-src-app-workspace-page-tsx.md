---
target: app desktop attuale
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-06T14-27-06Z
slug: frontend-src-app-workspace-page-tsx
---
# Critica desktop — Workspace candidature

## Design Health Score

| # | Euristica | Punteggio | Problema chiave |
|---|---|---:|---|
| 1 | Visibilità dello stato del sistema | 3 | Loading, salvataggio ed errori sono presenti; creazione e cambio di stato non hanno una conferma persistente o annunciata. |
| 2 | Corrispondenza con il mondo reale | 4 | Azienda, ruolo, candidatura, colloquio e offerta parlano la lingua dell’utente. |
| 3 | Controllo e libertà | 3 | Dialog annullabile, menu alternativo al drag e ripristino dall’archivio; manca l’annullamento immediato degli spostamenti. |
| 4 | Coerenza e standard | 3 | Sistema visivo coerente; “Rifiutate”, “Rifiutata”, “Non selezionata” e “Non selezionate” descrivono però lo stesso esito. |
| 5 | Prevenzione degli errori | 3 | Input nativi, campi obbligatori, rollback e conferma di eliminazione sono solidi; nessuna protezione dall’archiviazione/spostamento accidentale. |
| 6 | Riconoscimento anziché memoria | 3 | CTA, ricerca, stati e menu sono leggibili; il drag non è spiegato e non è evidente cosa richieda attenzione. |
| 7 | Flessibilità ed efficienza | 2 | Drag, menu e ricerca coprono due modalità d’uso; mancano ordinamento e acceleratori per board lunghe. |
| 8 | Estetica e minimalismo | 3 | Interfaccia calma e compatta; a board vuota quattro contenitori equivalenti competono con il primo passo. |
| 9 | Riconoscimento e recupero dagli errori | 2 | Il rollback evita incoerenze, ma l’avviso non offre retry, dismiss o azione correttiva; manca undo. |
| 10 | Aiuto e documentazione | 1 | I testi vuoti spiegano dove appariranno gli elementi, non insegnano il flusso né guidano il primo inserimento. |
| **Totale** |  | **27/40** | **Accettabile — fondamenta solide, ma il ciclo d’uso non è ancora completamente chiuso.** |

## Verdetto di specificità

### Valutazione di design

La direzione è già riconoscibile come JobTracker: notte operativa, corallo usato come unica azione primaria, colori semantici stabili, copy calmo e struttura centrata sul percorso della candidatura. Non è un mock generico applicato senza criterio.

La board popolata resta però parzialmente intercambiabile con un comune kanban: quattro colonne equivalenti, card con azienda/ruolo/data/città e azioni standard. Il carattere specifico del prodotto emerge soprattutto nei colori e nel copy, meno nel modo in cui aiuta una persona sotto stress a capire cosa fare dopo.

### Scansione deterministica

Il detector eseguito su `frontend/src/app/(workspace)/page.tsx` ha restituito `[]`: 0 finding, nessuna regola, severità o posizione da segnalare e nessun falso positivo. La scansione conferma che non ci sono anti-pattern meccanici evidenti sul target, ma non misura i vuoti di prodotto descritti qui.

### Evidenza browser

Il browser isolato è stato reindirizzato a `/login` perché privo di sessione autenticata; la workspace non era quindi osservabile live. Non è disponibile un overlay affidabile: il browser esponeva valutazione in sola lettura, non un canale di injection mutabile. La critica usa implementazione, design system, surface brief e mock approvato come evidenza principale.

## Impressione generale

La versione è molto più vicina alla direzione concordata di quanto sembri: la struttura base c’è già e non richiede un altro redesign. L’opportunità maggiore è trasformarla da board corretta a compagno affidabile: insegnare il primo passo, confermare ciò che è successo e mettere in evidenza ciò che richiede attenzione.

## Cosa funziona

- **Gerarchia operativa chiara.** Titolo, CTA, ricerca, archivio e quattro stati si leggono prima dello scroll; il corallo non compete con azioni secondarie.
- **Interazione inclusiva nel percorso principale.** Il cambio di stato non dipende solo dal drag-and-drop: il menu esplicito sulla card copre tastiera e utenti che non scoprono il gesto.
- **Fondamenta di affidabilità già presenti.** Loading skeleton, validazione campo per campo, dialog nativo, rollback ottimistico e conferma distruttiva sono una base seria.

## Carico cognitivo

Carico **moderato**, con 2 fallimenti su 8:

- **Single focus / progressive disclosure:** quando non esistono candidature, quattro colonne vuote mostrano quattro destinazioni invece di un unico primo passo.
- **Gerarchia nel tempo:** quando le candidature aumentano, tutte le card hanno peso simile e l’utente deve ricordare da sé quali richiedono attenzione.

I menu di stato mostrano quattro alternative nella maggior parte dei casi, al limite corretto della memoria di lavoro; nell’archivio l’aggiunta dell’eliminazione porta il punto decisionale a cinque azioni e merita una separazione più netta.

## Percorso emotivo

L’ingresso è calmo e competente, ma il percorso è emotivamente piatto: creare o far avanzare una candidatura non produce un momento di conferma; un errore interrompe il flusso senza una via d’uscita; l’esito negativo usa parole diverse e talvolta più dure del necessario. Il prodotto rassicura con l’estetica, ma non ancora con il comportamento.

## Problemi prioritari

### [P1] Il primo utilizzo è frammentato in quattro stati vuoti

**Perché conta:** una persona senza candidature vede la struttura del sistema prima di capire il beneficio e il primo passo. La mascotte, prevista proprio per onboarding e vuoti reali, non svolge il suo ruolo.

**Fix:** quando il totale è zero, sostituire temporaneamente la board con un unico empty state: robot esistente, frase breve, CTA “Aggiungi la prima candidatura” e una riga che anticipa che la scheda potrà essere spostata tra le fasi. Dopo il primo inserimento torna la board normale. Nei risultati di ricerca vuoti, aggiungere “Cancella ricerca”.

**Comando suggerito:** `$impeccable onboard`

### [P1] Gli aggiornamenti riescono in silenzio e gli errori non offrono recupero

**Perché conta:** dopo drag, menu o creazione l’utente deve dedurre che il salvataggio sia riuscito. Uno spostamento accidentale richiede ritrovare la card e ripetere l’azione; l’avviso di errore non offre retry o dismiss.

**Fix:** aggiungere un’unica regione `aria-live` con feedback compatto (“Spostata in Colloqui”) e un’azione “Annulla” per l’ultimo cambio di stato. Nell’errore, mantenere il rollback già presente e offrire “Riprova” o almeno “Chiudi”. Nessuna libreria di toast necessaria.

**Comando suggerito:** `$impeccable harden`

### [P2] Il linguaggio dell’esito negativo è incoerente e più giudicante del brand

**Perché conta:** “Rifiutata”, “Rifiutate”, “Non selezionata” e “Non selezionate” sembrano stati diversi e rompono la promessa di una voce non giudicante.

**Fix:** scegliere un solo termine. La scelta più coerente con il prodotto è **“Non selezionate”** per la colonna e **“Non selezionata”** per card, menu e form; mantenere il rosa come segnale semantico senza usare il colore come unico significato.

**Comando suggerito:** `$impeccable clarify`

### [P2] La board registra lo stato, ma non aiuta a stabilire la priorità

**Perché conta:** con poche candidature va bene; con 20–40 schede l’utente deve ricordare quali sono vecchie, quali hanno note importanti e quale contatto richiede un follow-up. Il prodotto rischia di diventare un archivio ordinato invece di un compagno di ricerca.

**Fix:** per questa iterazione basta un ordinamento prevedibile e dichiarato per data recente. Nella prossima iterazione di prodotto valutare un solo segnale aggiuntivo — “prossima azione” oppure “ultimo aggiornamento” — non entrambi finché non è provata la necessità.

**Comando suggerito:** `$impeccable shape`

## Red flag per persona

### Alex — utente esperto

Può creare, cercare e spostare rapidamente una candidatura, e il menu alternativo al drag è utile. Quando la board cresce, però, non trova ordinamento esplicito, scorciatoie o azioni batch. Non serve aggiungerle ora tutte: l’assenza di un ordine prevedibile è il primo collo di bottiglia reale.

### Sam — tastiera/screen reader

Dialog nativo, focus visibile, label testuali e menu di stato sono buoni. Il cambio di colonna non viene annunciato tramite live region; il drag non ha istruzioni accessibili; il conteggio colonna espone soltanto un numero senza il nome dello stato. Sam può completare il flusso via menu, ma non riceve conferma chiara dell’esito.

### Giulia — persona in cerca di lavoro sotto pressione

Giulia apre l’app per togliersi dalla testa scadenze e follow-up. La board le mostra dove sono le candidature, ma non cosa merita attenzione oggi. Al primo accesso riceve quattro messaggi vuoti invece di un incoraggiamento e un’unica azione. Dopo un rifiuto incontra un lessico più duro e incoerente proprio nel momento emotivamente più delicato.

## Osservazioni minori

- La card ripete lo stato già espresso dalla colonna; il chip resta utile nella lista di ricerca e nell’archivio, ma nella board può essere ridotto se serve spazio per un segnale più utile.
- Il menu dell’archivio dovrebbe separare visivamente “Elimina definitivamente” dalle azioni di ripristino più di quanto faccia una semplice linea.
- Il primo ingresso in “Offerte” è il posto giusto per un micro-momento positivo della mascotte; non serve mostrarla nella board piena.
- Statistiche e impostazioni non mancano a questa iterazione: sono evoluzioni confermate, ma introdurle ora allargherebbe il prodotto prima di chiudere il flusso principale.

## Domande da considerare

- La prossima iterazione deve far sentire JobTracker soprattutto un **archivio affidabile** o un **compagno che suggerisce il prossimo passo**?
- Se potessimo aggiungere un solo dato alla card, sarebbe più utile **prossima azione**, **ultimo aggiornamento** o nessun dato nuovo finché non abbiamo uso reale?
- Il momento “Offerta ricevuta” merita una piccola celebrazione, oppure la calma assoluta è parte della promessa?
