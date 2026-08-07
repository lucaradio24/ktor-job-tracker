# Esercizio: portare JobTracker alla versione Night Route pre-deploy

## Prompt di pianificazione applicato

> Genera un piano d'azione guidato, progressivo e verificabile per implementare in JobTracker la direzione Night Route approvata: storico reale degli stati, topbar compatta, board a tre stadi con percorso contestuale, inspector desktop e dettaglio mobile, flussi create/edit, statistiche, impostazioni di tema/densità/movimento, toast e hardening pre-deploy. Usa lo stack esistente Ktor/Kotlin/MongoDB e Next.js 16/React 19/CSS Modules. Mantieni il dark Graphite + Porcelain come baseline, usa il robot solo negli stati contestuali e aggiungi movimento intenzionale rispettando `prefers-reduced-motion`. Riusa API, componenti e dipendenze presenti; non introdurre store globale, librerie di grafici, date picker o design system astratti. Ogni passo deve indicare risultato osservabile, concetto, file, azioni, verifica eseguibile e criterio di stop. Non inventare dati storici e non indebolire autenticazione, isolamento per `ownerId`, validazione o accessibilità.

Questo documento applica direttamente il prompt. I passi vanno eseguiti in ordine, uno per intervento. Non si passa al successivo finché il checkpoint corrente non è verde.

## Obiettivo

Alla fine l'utente potrà:

- vedere la pipeline `Candidature → Colloqui → Offerte` e tenere sotto controllo le uscite `Non selezionate` e `Ritirate`;
- selezionare una candidatura e leggere percorso, date disponibili, tempi e azioni rapide;
- creare e modificare una candidatura senza flussi duplicati;
- consultare statistiche calcolate esclusivamente dai dati reali;
- personalizzare tema, densità e movimento;
- usare l'app con mouse, tastiera e schermo mobile;
- completare test e build di produzione prima di scegliere il provider di deploy.

## Direzione approvata

### Struttura

- Topbar compatta; nessuna sidebar permanente.
- Board desktop a tre colonne attive: `Candidature`, `Colloqui`, `Offerte`.
- `Non selezionate` e `Ritirate` sono uscite consultabili, non colonne sequenziali.
- Inspector contestuale a destra su desktop.
- Dettaglio a tutta pagina con pulsante `Indietro` su mobile.

### Aspetto

- Baseline dark `Graphite + Porcelain`: fondi quasi neri neutri, testo porcellana, CTA primaria chiara.
- Nessun accento corallo.
- Colore usato soprattutto per stato, focus, errore e conferma.
- Manrope resta il font iniziale: è già integrato con `next/font` e permette di concentrare il lavoro su gerarchia, pesi, dimensioni e numeri tabulari. Un cambio di famiglia verrà valutato solo dopo il primo controllo visivo completo.
- Robot presente in empty state, errore, aiuto o successo; assente dalle card normali.

### Linee e movimento

- Una linea sottile da `1px` collega sempre e soltanto gli indicatori delle tre intestazioni di colonna.
- Quando una candidatura è selezionata, una seconda linea da `2px` evidenzia il tratto raggiunto da quella candidatura.
- Nessuna linea collega le singole card.
- La linea selezionata si anima una volta all'apertura o al cambio di stato; non pulsa e non scorre continuamente.
- Inspector, toast, menu e card usano transizioni brevi, normalmente `120–200ms`.
- Con movimento ridotto, il contenuto compare senza spostamenti né animazioni decorative.

## Mappa dell'architettura finale

```text
Browser autenticato
│
├─ /                         board + inspector
│  ├─ stato locale: applications[]
│  └─ stato locale: selectedApplicationId
│
├─ /statistics               statistiche pure sui dati caricati
├─ /settings                 preferenze in localStorage
├─ /applications/:id         modifica completa
│
└─ /api/applications/*       proxy Next.js autenticato
   └─ Ktor /applications/*
      ├─ DTO + validazione
      ├─ JobApplicationService
      └─ repository filtrato per id + ownerId
```

```text
JobApplication
├─ campi attuali
└─ statusHistory[]           server-owned, append-only dal client
   └─ status + changedAt
```

`nextAction` è rinviata finché non emerge un requisito d'uso reale.

## Prerequisiti e regole di lavoro

- Java 21, Node.js e `pnpm` devono essere disponibili.
- Backend configurato con MongoDB e Auth0 come oggi.
- Non fare reset della working tree: sono presenti artefatti di design non committati.
- Prima di ogni modifica Next.js leggere la guida installata pertinente sotto `frontend/node_modules/next/dist/docs/`, come richiesto da `frontend/AGENTS.md`.
- Usare HTML nativo quando disponibile: `<dialog>`, `<input type="date">`, `<input type="datetime-local">`, `aria-live` e CSS media query.
- Non aggiungere dipendenze. Sono sufficienti React, Next.js, CSS Modules, Lucide e `@dnd-kit/react` già presenti.
- Eseguire lint/build al termine di ogni passo frontend e test/build al termine di ogni passo backend.
- I comandi sono PowerShell e partono dalla root `G:\repos\JobTracker`, salvo indicazione diversa.

## Indice e stato

| Stato | Passo | Risultato osservabile | Dipende da |
|---|---|---|---|
| `[x]` | 1. Bloccare il contratto dati | Regole dello storico approvate | — |
| `[x]` | 2. Salvare lo storico | API persistente e compatibile con dati legacy | 1 |
| `[x]` | 3. Costruire Night Route, board e inspector | Nuova esperienza principale desktop/mobile | 2 |
| `[x]` | 4. Rifinire create/edit | Flussi coerenti e senza perdita accidentale | 3 |
| `[x]` | 5. Aggiungere statistiche | Pagina affidabile senza endpoint analytics | 2 |
| `[x]` | 6. Aggiungere impostazioni e temi | Preferenze locali senza flash iniziale | 3 |
| `[x]` | 7. Hardening pre-deploy | Build verificata, casi limite coperti | 2–6 |

---

## Passo 1 — Bloccare il contratto dati `[completato]`

### Concetto

Lo storico è append-only dal punto di vista del client: l'utente sceglie lo stato iniziale o chiede un cambio di stato, ma è il backend ad aggiungere la transizione con il proprio timestamp.

### Contratto approvato

```kotlin
@Serializable
data class StatusTransition(
    val status: ApplicationStatus,
    val changedAt: String,
)

val statusHistory: List<StatusTransition> = emptyList(),
```

### Decisioni confermate

- [x] Una nuova candidatura accetta tutti gli stati, con `APPLIED` come default nel form.
- [x] La creazione registra una prima transizione con timestamp server, usata come `createdAt` del record.
- [x] Il backend assegna il timestamp a ogni cambio di stato reale.
- [x] Le candidature esistenti non ricevono date inventate.
- [x] `appliedAt` resta una data locale `YYYY-MM-DD`.
- [x] `changedAt` usa ISO 8601 UTC.
- [x] `nextAction` è rinviata.
- [x] Numero e calendario dei singoli colloqui restano fuori finché non esiste un modello evento reale.

### Verifica

Il contratto non richiede migrazioni distruttive e nessuna statistica dipende da date inesistenti.

### Stop

Passo concluso. Non riaprire lo schema durante la costruzione della UI salvo un errore dimostrato dai test del Passo 2.

---

## Passo 2 — Salvare lo storico `[completato]`

### Risultato del passo

L'API accetta lo stato iniziale, registra la transizione di creazione e una sola transizione per ogni cambio reale, e continua a leggere i documenti MongoDB esistenti.

### 2.0 Leggere il flusso esistente

Prima di modificare, leggere per intero:

```text
src/main/kotlin/routes/ApplicationRoutes.kt
src/main/kotlin/service/JobApplicationService.kt
src/main/kotlin/repository/ApplicationRepository.kt
src/main/kotlin/repository/InMemoryApplicationRepository.kt
src/main/kotlin/repository/MongoApplicationRepository.kt
src/main/kotlin/validation/JobApplicationRequestValidator.kt
src/test/kotlin/ServerTest.kt
```

Cercare tutti i punti che costruiscono o aggiornano una candidatura:

```powershell
rg "JobApplication\(|CreateJobApplicationRequest|UpdateJobApplicationRequest|PatchJobApplicationRequest|\.patch\(|\.update\(" src frontend/src
```

### Verifica

Prima di scrivere, devono essere chiari i percorsi `POST`, `PUT` e `PATCH`, inclusi repository in-memory e MongoDB.

### 2.1 Aggiungere i tipi di dominio

Modificare `src/main/kotlin/model/JobApplication.kt` aggiungendo `StatusTransition` e `statusHistory` con valore predefinito.

I default sono obbligatori: MongoDB deve deserializzare i record creati prima della nuova versione.

### Verifica

```powershell
.\gradlew.bat test
```

Risultato: i test esistenti continuano a passare senza migrazione dati.

### 2.2 Separare input client e campi server-owned

Modificare:

```text
src/main/kotlin/dto/CreateJobApplicationRequest.kt
src/main/kotlin/dto/UpdateJobApplicationRequest.kt
src/main/kotlin/dto/PatchJobApplicationRequest.kt
src/main/kotlin/model/JobApplicationChanges.kt
src/main/kotlin/routes/ApplicationRoutes.kt
```

Regole:

1. mantenere `status` obbligatorio in `CreateJobApplicationRequest`;
2. in `POST`, creare la prima transizione con lo stato scelto e `Instant.now()`;
3. mantenere `status` nei DTO update/patch;
4. non accettare mai `statusHistory` nei DTO;
5. rinviare `nextAction` senza predisporre campi inutilizzati.

### Verifica

Un payload `POST` deve accettare uno qualsiasi degli stati definiti e restituire la transizione iniziale creata dal server.

### 2.4 Registrare una sola transizione reale

Modificare servizio e repository:

```text
src/main/kotlin/service/JobApplicationService.kt
src/main/kotlin/repository/ApplicationRepository.kt
src/main/kotlin/repository/InMemoryApplicationRepository.kt
src/main/kotlin/repository/MongoApplicationRepository.kt
```

Flusso richiesto:

```text
richiesta di cambio stato
├─ record non trovato con id + ownerId → 404
├─ nuovo stato uguale allo stato corrente → nessun evento
└─ stato diverso
   ├─ service crea StatusTransition(status, Instant.now().toString())
   └─ repository salva stato + evento nella stessa operazione
```

MongoDB deve usare `$set` e `$push` nello stesso `updateOne`. Non leggere, modificare e riscrivere l'intero array.

Il `PUT` deve preservare lo storico esistente e aggiungere una transizione solo se lo stato cambia. Tutti i filtri di lettura e update devono continuare a includere `ownerId`.

### Verifica

Test minimi:

1. la creazione aggiunge un evento iniziale con timestamp server;
2. `APPLIED → INTERVIEW` aggiunge un evento;
3. `INTERVIEW → INTERVIEW` non aggiunge eventi;
4. modifica del titolo non aggiunge eventi;
5. un altro `ownerId` riceve `404` e non modifica il record;
6. un record legacy con lista vuota accetta la prima transizione reale.

### 2.6 Allineare il contratto frontend

Prima leggere le guide Next installate:

```powershell
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md -Raw
```

Modificare:

```text
frontend/src/features/applications/model/jobApplication.ts
frontend/src/features/applications/api/jobApplicationApi.ts
frontend/src/features/applications/components/Forms/NewApplicationForm/NewApplicationForm.tsx
```

Tipi obiettivo:

```ts
export interface StatusTransition {
  status: ApplicationStatus;
  changedAt: string;
}
```

Sostituire gli `Omit<JobApplication, "id">` con payload espliciti. `CreateJobApplication` contiene `status`, ma non `id` o `statusHistory`. Il form di creazione mantiene il selettore di stato con `APPLIED` come default.

Definire una patch esplicita con i soli campi accettati; non usare `Partial<JobApplication>`.

### Verifica completa del Passo 2

```powershell
.\gradlew.bat test
.\gradlew.bat build
Set-Location frontend
pnpm lint
pnpm build
```

Checklist:

- [ ] POST conserva lo stato scelto e crea la prima transizione;
- [ ] PATCH reale aggiunge un timestamp server;
- [ ] PATCH identica non duplica lo storico;
- [ ] documenti legacy leggibili;
- [ ] isolamento `ownerId` coperto da test;
- [ ] frontend compila con payload espliciti.

### Stop

Fermarsi con API, test e build verdi. Non iniziare l'inspector finché il contratto restituito dal backend non è stabile.

---

## Passo 3 — Costruire Night Route, board e inspector `[completato]`

### Risultato del passo

La home mostra la nuova board Graphite + Porcelain. Selezionando una card si apre l'inspector con percorso datato, metriche e azioni rapide. Desktop e mobile usano gli stessi dati e la stessa logica.

### 3.0 Leggere le guide Next e la reference approvata

```powershell
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/11-css.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md -Raw
```

Confrontare il lavoro con:

```text
.impeccable/mocks/jobtracker-night-route-inspector.png
.impeccable/surfaces/frontend-src-app-workspace-page-tsx.md
```

### Verifica

Prima di modificare deve essere chiara la separazione: la pagina server carica i dati; `ApplicationsDashboard` mantiene interazioni e selezione sul client.

### 3.1 Impostare fondazioni visive e tipografia

Modificare:

```text
frontend/src/styles/tokens.css
frontend/src/styles/base.css
frontend/src/app/(workspace)/page.module.css
```

Interventi:

- sostituire l'accento corallo con una scala neutra Porcelain;
- mantenere colori stato distinti ma meno saturi;
- aggiungere token per overlay, selected, success e warning solo se usati;
- definire durate `fast`, `normal` e curve coerenti;
- usare una scala tipografica compatta con Manrope;
- usare `font-variant-numeric: tabular-nums` per date, conteggi e metriche;
- ridurre ombre e gradienti: bordi sottili e differenze di superficie fanno la gerarchia.

Non creare un package di design system. I token CSS esistenti sono il sistema condiviso.

### Verifica

Aprire home, loading, error e pagina edit. Nessun testo deve dipendere dal vecchio rosso/corallo per essere leggibile.

### 3.2 Completare la topbar

Modificare:

```text
frontend/src/components/layout/Topbar/Topbar.tsx
frontend/src/components/layout/Topbar/Topbar.module.css
```

La topbar contiene:

- brand compatto;
- link `Candidature`, `Statistiche`, `Impostazioni`;
- stato attivo derivato dalla route, non hard-coded;
- account esistente.

È sufficiente rendere `Topbar` un client component e usare `usePathname`; non creare un router o una configurazione di navigazione separata. `Sidebar` resta inutilizzata e potrà essere eliminata nel Passo 7 dopo la ricerca dei riferimenti.

Su mobile mantenere brand, azione principale/account e una navigazione compatta accessibile; non ripristinare una sidebar.

### Verifica

Ogni link raggiunge la route corretta e possiede `aria-current="page"` solo quando attivo.

### 3.3 Rendere la selezione una responsabilità della dashboard

Modificare `frontend/src/features/applications/components/ApplicationsDashboard/ApplicationsDashboard.tsx`.

Aggiungere solo:

```ts
const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

const selectedApplication =
  jobApplications.find(({ id }) => id === selectedApplicationId) ?? null;
```

Regole:

- click/Invio/Spazio sulla card selezionano;
- chiusura inspector imposta `null` e restituisce focus alla card;
- update riuscito sostituisce il record nell'array: inspector e board ricevono automaticamente il dato nuovo;
- eliminazione della candidatura selezionata chiude l'inspector;
- nessun Context o store globale.

### Verifica

La selezione sopravvive a ricerca e update solo se la card rimane nel risultato corrente; altrimenti l'inspector si chiude in modo prevedibile.

### 3.4 Ridurre la board ai tre stadi reali

Modificare:

```text
frontend/src/features/applications/components/ApplicationBoard/ApplicationBoard.tsx
frontend/src/features/applications/components/ApplicationBoard/ApplicationBoard.module.css
frontend/src/features/applications/components/ApplicationColumn/ApplicationColumn.tsx
frontend/src/features/applications/components/ApplicationColumn/ApplicationColumn.module.css
```

Azioni:

1. mantenere nelle colonne soltanto `APPLIED`, `INTERVIEW`, `OFFER`;
2. rinominare la copia in italiano approvato: `Candidature`, `Colloqui`, `Offerte`;
3. spostare `REJECTED` e `WITHDRAWN` nella vista uscite della dashboard;
4. mantenere drag-and-drop per i tre stadi attivi;
5. mantenere un menu esplicito come alternativa da tastiera;
6. non rendere draggable l'intera card quando l'azione nasce da un link, button o input.

Per le linee usare CSS, non canvas o SVG:

```text
linea base 1px     sempre tra i tre marker delle intestazioni
linea attiva 2px   larghezza derivata dallo stato selezionato
APPLIED            0%
INTERVIEW          50%
OFFER              100%
```

La board riceve lo stato selezionato come prop e imposta un attributo `data-selected-stage`. Le uscite non estendono la linea: il loro evento appare nel percorso dell'inspector.

### Verifica

- nessuna linea attraversa le card;
- senza selezione si vede solo la linea base;
- selezionando una card si illumina soltanto il tratto raggiunto;
- una card rifiutata o ritirata non inventa una quarta tappa.

### 3.5 Rendere la card selezionabile senza rompere le azioni

Modificare:

```text
frontend/src/features/applications/components/ApplicationCard/ApplicationCard.tsx
frontend/src/features/applications/components/ApplicationCard/ApplicationCard.module.css
frontend/src/features/applications/components/ApplicationsList/ApplicationsList.tsx
```

La card riceve `selected` e `onSelect`. L'articolo usa `tabIndex={0}`, `aria-selected` e gestione di Invio/Spazio. Click su link, menu o altre azioni non deve propagare alla selezione se produce un'azione differente.

La card mostra soltanto:

- azienda e ruolo;
- data candidatura e città;
- stato/azioni essenziali.

Non aggiungere statistiche nella card: appartengono all'inspector.

### Verifica

Mouse e tastiera selezionano la stessa candidatura. Il link annuncio e il menu stato continuano a funzionare senza aperture accidentali.

### 3.6 Costruire l'inspector

Creare:

```text
frontend/src/features/applications/components/ApplicationInspector/ApplicationInspector.tsx
frontend/src/features/applications/components/ApplicationInspector/ApplicationInspector.module.css
```

Modificare la dashboard per passare:

```text
application
onClose
onStatusChange
onEdit
```

Ordine dei contenuti:

1. azienda, ruolo, città e link annuncio;
2. metriche contestuali;
3. percorso datato;
4. azioni rapide;
5. `Altre azioni` con `Non selezionata` e `Ritira`.

Metriche:

- `Da quanto ti sei candidato`: differenza tra oggi e `appliedAt`;
- `Tempo nello stato`: differenza dall'ultima transizione conosciuta che coincide con lo stato corrente;
- per dati legacy senza timestamp mostrare `Data non disponibile`, mai `0 giorni`.

Percorso:

```text
Candidatura inviata        appliedAt
Transizioni note           statusHistory in ordine changedAt
Stato corrente legacy      data non disponibile, solo se non rappresentato
```

Non sintetizzare tappe intermedie. Se un record passa direttamente da `APPLIED` a `OFFER`, mostrare gli eventi realmente registrati.

Azioni rapide consigliate:

- da `APPLIED`: `Sposta in Colloqui`;
- da `INTERVIEW`: `Sposta in Offerte`;
- da `OFFER`: nessuna falsa tappa successiva;
- sempre: `Modifica dettagli`;
- sotto `Altre azioni`: `Segna come non selezionata`, `Ritira candidatura`.

### Verifica

Un cambio di stato aggiorna subito inspector e card. Un errore API mantiene i dati precedenti e mostra un messaggio comprensibile.

### 3.7 Adattare l'inspector al mobile

Usare lo stesso componente e gli stessi handler.

Comportamento sotto `48rem`:

- quando nessuna candidatura è selezionata, mostrare board/lista;
- quando è selezionata, mostrare il dettaglio a tutta larghezza e nascondere la board;
- pulsante `Indietro` chiude il dettaglio;
- nessun drawer stretto sopra il contenuto;
- azioni principali con target minimo `44px`.

Non creare una seconda route mobile e non duplicare il markup.

### Verifica

A 375px non esiste scroll orizzontale e il pulsante Indietro è il primo controllo.

### 3.8 Uniformare toast e micro-movimenti

Modificare:

```text
frontend/src/components/feedback/ToastViewport/ToastViewport.tsx
frontend/src/components/feedback/ToastViewport/ToastViewport.module.css
frontend/src/components/feedback/ToastViewport/ToastProvider.tsx
```

Stati visivi: successo, errore, informazione. Conservare una sola notifica visibile: per un tracker personale evita una coda complessa.

Il toast di cambio stato offre `Annulla`. L'annullamento è una nuova transizione inversa, non la cancellazione dello storico. La timeline deve quindi mostrare entrambi gli eventi.

Animazioni:

- toast: entrata breve e barra tempo;
- inspector: fade/slide massimo `200ms`;
- card: sollevamento massimo `1px` su hover;
- linea: reveal una sola volta;
- nessuna animazione infinita.

Il robot può apparire nel primo empty state della board e nei messaggi di errore/successo importanti usando l'asset esistente. Non usarlo nei toast ordinari.

### Verifica completa del Passo 3

```powershell
Set-Location frontend
pnpm lint
pnpm build
```

Checklist manuale desktop e mobile:

- [ ] tre sole colonne attive;
- [ ] uscite separate dalla pipeline;
- [ ] selezione mouse e tastiera;
- [ ] linea base e linea contestuale corrette;
- [ ] percorso senza date inventate;
- [ ] azioni rapide con rollback su errore;
- [ ] inspector mobile con Indietro;
- [ ] movimento ridotto rispettato;
- [ ] toast coerenti e leggibili.

### Stop

Fermarsi quando il flusso principale è completo e stabile. Non aggiungere statistiche dentro la dashboard.

---

## Passo 4 — Rifinire creazione e modifica `[completato]`

### Risultato del passo

Creazione e modifica usano la nuova gerarchia visiva, evitano campi ridondanti e proteggono da chiusure accidentali con modifiche non salvate.

### 4.0 Leggere le guide pertinenti

```powershell
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md -Raw
```

### 4.1 Semplificare la creazione

Modificare:

```text
frontend/src/features/applications/components/Dialogs/NewApplicationDialog/NewApplicationDialog.tsx
frontend/src/features/applications/components/Dialogs/NewApplicationDialog/NewApplicationDialog.module.css
frontend/src/features/applications/components/Forms/NewApplicationForm/NewApplicationForm.tsx
frontend/src/features/applications/components/Forms/NewApplicationForm/NewApplicationForm.module.css
```

Regole:

- selettore dello stato iniziale con `APPLIED` come default;
- campi essenziali prima: azienda, ruolo, data;
- città, link e note in una sezione secondaria visibile ma meno dominante;
- errori vicino al campo e riepilogo solo per errore generale;
- disabilitare submit durante la richiesta;
- al successo aggiungere il record restituito dal server, chiudere e mostrare toast;
- usare il focus trap nativo di `<dialog>` già presente.

Se il form è dirty e l'utente chiude con Escape, backdrop o pulsante, chiedere conferma tramite il `ConfirmDialog` esistente. Nessun hook generico per i form.

### Verifica

- Tab resta nel dialog;
- Escape chiude subito il form vuoto;
- Escape con dati inseriti chiede conferma;
- submit invalido porta il focus al primo campo errato;
- una nuova candidatura compare nello stato scelto.

### 4.2 Rendere il dialog una pagina mobile

Con CSS sotto `48rem`:

- dialog a tutto viewport;
- header sticky con Chiudi;
- azioni sticky in basso con safe-area;
- campi a una colonna;
- nessun modal annidato visivamente.

Riutilizzare lo stesso form: nessuna route `/new` finché non serve un URL condivisibile.

### Verifica

A 375px tutti i campi sono raggiungibili, la tastiera non nasconde definitivamente il submit e non compare scroll orizzontale.

### 4.3 Ripulire la modifica completa

Modificare:

```text
frontend/src/app/(workspace)/applications/[id]/page.tsx
frontend/src/features/applications/components/Forms/EditApplicationForm/EditApplicationForm.tsx
frontend/src/features/applications/components/Forms/EditApplicationForm/EditApplicationForm.module.css
```

La pagina modifica gestisce i dati descrittivi: azienda, ruolo, data candidatura, città, link e note. Rimuovere il cambio stato dal form completo: gli stati vengono gestiti da board e inspector, così ogni transizione usa lo stesso flusso.

Mantenere:

- barra modifiche non salvate;
- reset ai valori ricevuti;
- conferma eliminazione;
- `404` esistente;
- ritorno alla board dopo salvataggio/eliminazione.

Al salvataggio completo il backend deve preservare `status` e `statusHistory`; il payload non deve sovrascrivere campi server-owned.

### Verifica

Modificare solo il titolo non cambia stato o storico. Ricaricando la pagina si vedono i dati persistiti.

### 4.4 Allineare copy, errori e stati busy

Usare sempre:

- `Candidature`, `Colloqui`, `Offerte`, `Non selezionate`, `Ritirate`;
- verbi di azione nei pulsanti;
- `Salvataggio…`, `Eliminazione…`, `Operazione non riuscita` per gli stati asincroni;
- `aria-busy`, `aria-invalid`, `aria-describedby` già presenti.

### Verifica completa del Passo 4

```powershell
Set-Location frontend
pnpm lint
pnpm build
```

Checklist:

- [ ] create con stato selezionabile e default `APPLIED`;
- [ ] dirty close protetto;
- [ ] mobile full-page;
- [ ] edit senza cambio stato;
- [ ] update non perde lo storico;
- [ ] errori accessibili;
- [ ] delete sempre confermata.

### Stop

Fermarsi con create/edit coerenti. Non aggiungere un form builder o una libreria di validazione frontend.

---

## Passo 5 — Aggiungere statistiche reali `[completato]`

### Risultato del passo

La route `/statistics` mostra un quadro affidabile delle candidature senza nuovo endpoint backend e senza libreria di grafici.

### 5.0 Leggere la guida e fissare la semantica

```powershell
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md -Raw
```

Metriche iniziali:

1. candidature inviate negli ultimi 30 giorni, da `appliedAt`;
2. distribuzione corrente per stato;
3. candidature avanzate a colloquio o oltre, usando stato corrente o transizioni note;
4. offerte ricevute, usando stato corrente o transizioni note;
5. città più frequenti, escludendo valori vuoti;
6. copertura dello storico: candidature con almeno una transizione tracciata.

Le durate medie entrano solo sui record con timestamp noto. Mostrare il numero di record usati; non mischiare record legacy come se avessero durata zero.

### 5.1 Creare una funzione pura di aggregazione

Creare:

```text
frontend/src/features/applications/model/applicationStats.ts
frontend/src/features/applications/model/applicationStats.test.ts
```

La funzione riceve `JobApplication[]` e una data `now` passata dal chiamante, così il test è deterministico:

```ts
export function calculateApplicationStats(
  applications: JobApplication[],
  now: Date,
): ApplicationStats
```

Un solo passaggio `O(n)` è sufficiente. Usare `Set` per sapere se una candidatura ha raggiunto uno stato; nessuna memoizzazione finché il volume non la richiede.

Il test usa il runner nativo di Node 24:

```powershell
Set-Location frontend
node --test src/features/applications/model/applicationStats.test.ts
```

Casi minimi: dataset vuoto, record legacy, percorso completo, divisione per zero, città vuota.

### Verifica

Il test deve fallire se si contano due volte le stesse candidature o si tratta una data mancante come zero.

### 5.2 Costruire la pagina

Creare:

```text
frontend/src/app/(workspace)/statistics/page.tsx
frontend/src/app/(workspace)/statistics/statistics.module.css
frontend/src/features/applications/components/ApplicationStats/ApplicationStats.tsx
frontend/src/features/applications/components/ApplicationStats/ApplicationStats.module.css
```

La pagina server riusa `getApplications()`, calcola le statistiche e passa il risultato al componente di presentazione.

Ordine visivo:

1. titolo e periodo;
2. quattro metriche essenziali;
3. distribuzione pipeline con barre CSS;
4. città;
5. nota sulla copertura dati quando lo storico è parziale.

Per grafici semplici usare `<div>` con larghezza percentuale, testo e valore numerico. Non usare canvas e non aggiungere una chart library.

### 5.3 Gestire empty e dati parziali

Dataset vuoto:

- niente percentuali `NaN` o card a zero senza contesto;
- mostrare un empty state con robot e CTA `Aggiungi candidatura`.

Dati legacy:

- distribuzione corrente sempre disponibile;
- date di transizione mancanti segnalate;
- metriche temporali accompagnate da `calcolato su N candidature`;
- nessuna ricostruzione fittizia.

### Verifica completa del Passo 5

```powershell
Set-Location frontend
node --test src/features/applications/model/applicationStats.test.ts
pnpm lint
pnpm build
```

Checklist:

- [x] zero record;
- [x] solo record legacy;
- [x] record in tutti gli stati;
- [x] nessuna divisione per zero;
- [x] percentuali coerenti;
- [x] barre leggibili anche senza colore;
- [x] link Statistiche attivo nella topbar.

### Stop

Fermarsi alle metriche sopra. Funnel avanzati, confronti mensili ed endpoint MongoDB si aggiungono solo dopo uso reale e volumi misurati.

---

## Passo 6 — Aggiungere impostazioni e temi `[completato]`

### Risultato del passo

La route `/settings` permette di cambiare tema, densità e movimento. Le preferenze persistono localmente e vengono applicate prima del primo paint utile.

### 6.0 Leggere le guide pertinenti

```powershell
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md -Raw
Get-Content frontend/node_modules/next/dist/docs/01-app/01-getting-started/11-css.md -Raw
```

### 6.1 Definire il contratto locale minimo

Creare:

```text
frontend/src/features/preferences/preferences.ts
```

Contratto:

```ts
export type ThemePreference = "dark" | "light" | "system";
export type DensityPreference = "comfortable" | "compact";
export type MotionPreference = "system" | "reduced";
```

Usare tre chiavi `localStorage` stabili o un singolo oggetto JSON versionato in modo semplice. Non introdurre Context: il form applica attributi a `document.documentElement` e gli altri componenti reagiscono tramite CSS.

### Verifica

Valori sconosciuti o JSON corrotto devono ricadere sui default senza bloccare il render.

### 6.2 Evitare il flash di tema errato

Modificare `frontend/src/app/layout.tsx`.

Prima dell'idratazione, uno script statico breve deve:

1. leggere la preferenza;
2. risolvere `system` con `matchMedia('(prefers-color-scheme: light)')`;
3. impostare `data-theme`, `data-density` e `data-motion` su `<html>`;
4. ignorare errori di storage e usare dark/comfortable/system.

Lo script non contiene dati utente né input interpolato. Evitare un provider globale solo per impostare tre attributi.

### Verifica

Con cache disabilitata e reload non deve apparire un frame chiaro prima del dark o viceversa.

### 6.3 Aggiungere i token tema

Modificare:

```text
frontend/src/styles/tokens.css
frontend/src/styles/base.css
```

Regole:

- `:root`/`[data-theme="dark"]` contiene la baseline Graphite + Porcelain approvata;
- `[data-theme="light"]` usa fondo porcellana, superfici calde quasi bianche, testo grafite e gli stessi significati di stato;
- componenti consumano token semantici, mai colori hard-coded;
- `color-scheme` segue il tema per i controlli nativi;
- `[data-density="compact"]` riduce spazi e altezza card, non target touch sotto `44px`;
- `[data-motion="reduced"]` applica le stesse protezioni di `prefers-reduced-motion`.

Prima dell'implementazione finale del light fare un checkpoint visivo con home, inspector, form e toast affiancati. Il dark resta la baseline anche se il light richiede un giro successivo.

### 6.4 Costruire la pagina impostazioni

Creare:

```text
frontend/src/app/(workspace)/settings/page.tsx
frontend/src/app/(workspace)/settings/settings.module.css
frontend/src/features/preferences/PreferencesForm.tsx
frontend/src/features/preferences/PreferencesForm.module.css
```

Il form client contiene tre gruppi di radio button:

- Tema: `Scuro`, `Chiaro`, `Sistema`;
- Densità: `Comoda`, `Compatta`;
- Movimento: `Sistema`, `Ridotto`.

Ogni modifica viene applicata e salvata subito; mostrare un piccolo stato `Salvato` tramite testo o toast. Non serve un pulsante Salva.

### 6.5 Reagire ai cambi di sistema

Quando la preferenza è `system`, ascoltare `matchMedia(...).change` e aggiornare `data-theme`. Rimuovere il listener nel cleanup React. Se la preferenza è esplicita, non ascoltare cambi inutili.

### Verifica completa del Passo 6

```powershell
Set-Location frontend
pnpm lint
pnpm build
```

Checklist:

- [x] dark coerente con reference;
- [x] light leggibile e senza corallo;
- [x] system segue il sistema operativo;
- [x] preferenze persistono dopo reload;
- [x] nessun flash iniziale;
- [x] compact non riduce i touch target;
- [x] reduced disattiva movimento decorativo;
- [x] valori storage corrotti non rompono la pagina.

### Stop

Fermarsi alle preferenze locali. La sincronizzazione account/device richiede un requisito reale e un endpoint dedicato.

---

## Passo 7 — Hardening pre-deploy `[implementazione completata]`

### Risultato del passo

L'app supera test, build, controllo visivo e checklist dei flussi critici. Il codice è pronto per il deploy; scelta del provider e configurazione infrastrutturale restano una decisione separata.

### 7.0 Congelare lo scope

Da questo punto non aggiungere nuove feature. Correggere soltanto problemi che impediscono:

- uso del flusso principale;
- integrità dei dati;
- accessibilità di base;
- sicurezza e isolamento utenti;
- build di produzione;
- resa desktop/mobile approvata.

### 7.1 Eliminare codice non più raggiungibile

Prima cercare riferimenti:

```powershell
rg "Sidebar|DashboardHeader|ApplicationsList|jobtracker-logo" frontend/src
```

Eliminare soltanto componenti diventati realmente inutilizzati, per esempio la vecchia Sidebar se nessun file la importa. Non fare una riscrittura generale della struttura.

### Verifica

`pnpm lint` non segnala import morti e la navigazione continua a funzionare.

### 7.2 Coprire stati limite e recupero errori

Verificare e rifinire:

```text
frontend/src/app/(workspace)/loading.tsx
frontend/src/app/(workspace)/error.tsx
frontend/src/app/not-found.tsx
frontend/src/app/(workspace)/applications/[id]/loading.tsx
frontend/src/app/(workspace)/applications/[id]/not-found.tsx
frontend/src/app/api/applications/[[...path]]/route.ts
```

Casi richiesti:

- caricamento iniziale;
- nessuna candidatura;
- errore backend;
- rete assente/timeout;
- sessione scaduta;
- candidatura eliminata mentre l'inspector è aperto;
- rollback di update ottimistico;
- doppio click o doppio drag mentre una patch è pendente.

Non aggiungere service worker o modalità offline: mostrare errore e possibilità di riprovare è sufficiente.

### 7.3 Verificare accessibilità

Controllo tastiera completo:

```text
topbar → nuova candidatura → ricerca → filtri → card → inspector → azioni
```

Checklist:

- un solo `h1` per pagina;
- gerarchia heading senza salti inutili;
- focus sempre visibile;
- focus restituito alla card dopo chiusura inspector;
- dialog con nome accessibile;
- `aria-live` non interrompe lettura normale;
- drag-and-drop ha sempre alternativa via menu;
- colori non sono l'unico indicatore di stato;
- target touch almeno `44×44px`;
- contrasto testo normale almeno `4.5:1`;
- nessuna animazione necessaria per capire il risultato.

### 7.4 Verificare responsive e resa visiva

Fare un solo passaggio visivo raggruppato su:

```text
375×812    mobile
768×1024   tablet
1440×900   desktop
```

Pagine/stati:

- board vuota e popolata;
- inspector con e senza storico;
- inspector con azione scaduta;
- create, edit, statistiche, impostazioni;
- toast successo/errore;
- dark e light;
- movimento ridotto.

Annotare tutti i difetti, correggerli in un solo batch e fare un solo controllo finale. Evitare cicli indefiniti di micro-polish.

### 7.5 Verificare sicurezza e configurazione

Backend:

- tutte le query per record includono `id + ownerId`;
- issuer e audience Auth0 sono configurati da ambiente;
- CORS accetta solo le origini necessarie in produzione;
- MongoDB non usa credenziali hard-coded;
- errori interni non espongono stack trace al client.

Frontend:

- rinominare `NEXT_PUBLIC_API_URL` in `API_URL` se viene usata solo sul server/proxy;
- documentare variabili richieste senza committare segreti;
- URL esterni usano `rel="noreferrer"`;
- timeout e risposta `401` del proxy sono gestiti.

Aggiornare:

```text
README.md
frontend/README.md
```

Documentare avvio locale, variabili ambiente, comandi test/build e flusso architetturale reale. Non copiare valori da `.env` o `.env.local`.

### 7.6 Eseguire la suite finale

Dalla root:

```powershell
.\gradlew.bat test
.\gradlew.bat build
Set-Location frontend
node --test src/features/applications/model/applicationStats.test.ts src/features/preferences/preferences.test.ts
pnpm lint
pnpm build
```

Se uno dei comandi fallisce, correggere la causa e rieseguire l'intera suite una volta.

### 7.7 Smoke test manuale end-to-end

Usare due utenti di test distinti quando possibile.

1. accedere come utente A;
2. creare una candidatura nello stato scelto e verificare la transizione iniziale;
3. selezionarla con tastiera;
4. spostarla in `Colloqui` e poi `Offerte`;
5. verificare date e linea contestuale;
6. usare `Annulla` dal toast e verificare che compaia una transizione inversa;
7. modificare titolo/note e verificare che lo storico non cambi;
8. segnare una candidatura `Non selezionata` e un'altra `Ritirata`;
9. controllare statistiche e copertura dati;
10. cambiare tema, densità e movimento, poi ricaricare;
11. accedere come utente B e verificare che i dati di A non siano visibili;
12. simulare backend non raggiungibile e sessione scaduta;
13. ripetere create, selezione e modifica a larghezza mobile.

### Definition of Done

- [x] tutti i comandi automatici verdi;
- [ ] nessun errore in console nei flussi principali;
- [x] nessun dato demo nella build;
- [x] nessun segreto versionato;
- [x] isolamento utenti verificato;
- [x] dark baseline fedele alla reference;
- [x] light, compact e reduced persistenti;
- [x] board, inspector, form, statistiche e impostazioni responsive;
- [ ] storico sopravvive al reload;
- [x] README aggiornati;
- [ ] provider di deploy scelto e variabili necessarie elencate.

Le voci rimaste aperte richiedono una sessione Auth0 reale, due utenti di test
o la scelta del provider; non introducono altro codice applicativo.

### Stop

Con la Definition of Done completa, l'implementazione discussa in chat è conclusa. Il deploy effettivo parte in un task separato dopo la scelta del provider e non deve riaprire il design.

---

## Verifica finale riassuntiva

```powershell
.\gradlew.bat test
.\gradlew.bat build
Set-Location frontend
node --test src/features/applications/model/applicationStats.test.ts src/features/preferences/preferences.test.ts
pnpm lint
pnpm build
```

Il risultato finale è una JobTracker Night Route completa, coerente, verificata e pronta a ricevere la configurazione del provider di deploy.

## Migliorie rimandate intenzionalmente

- sincronizzazione preferenze tra dispositivi: quando esiste un requisito multi-device;
- prossima azione: quando esiste un requisito d'uso reale;
- endpoint analytics MongoDB: quando il calcolo frontend diventa misurabilmente lento;
- calendario, notifiche e colloqui multipli: dopo un modello eventi dedicato;
- deep-link dell'inspector: quando servono condivisione URL o cronologia browser;
- nuova famiglia font: solo se il controllo visivo dimostra un limite reale di Manrope;
- coda di toast: quando operazioni concorrenti la rendono necessaria;
- service worker/offline mode: quando l'uso offline diventa un requisito prodotto.
