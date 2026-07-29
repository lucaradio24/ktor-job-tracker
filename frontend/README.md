# Frontend Job Tracker

Questa cartella contiene l'interfaccia web del progetto. Serve a vedere e
organizzare le candidature di lavoro in una dashboard semplice.

## Cosa permette di fare

- mostrare le candidature divise per stato;
- cercare per azienda o ruolo;
- passare dalla vista a colonne alla vista a lista;
- inserire una nuova candidatura tramite un modulo.

## Tecnologie

- Next.js con App Router;
- React e TypeScript;
- CSS Modules per gli stili dei componenti;
- Lucide React per le icone.

## Avvio locale

Prima avvia il backend Ktor, poi entra nella cartella `frontend`:

```bash
pnpm install
pnpm dev
```

L'applicazione sarà disponibile su
[http://localhost:3000](http://localhost:3000).

Il file `.env.local` deve indicare l'indirizzo del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Struttura

```text
src/
├── app/                         pagina e layout principale
├── components/layout/          componenti generali, come la sidebar
├── features/applications/
│   ├── api/                     chiamate al backend
│   ├── components/              dashboard, colonne, card e modulo
│   └── model/                   tipi TypeScript
└── styles/                      colori e stili globali
```

La pagina principale compone sidebar, intestazione e dashboard. La dashboard
carica i dati con `GET /applications`; il modulo salva una candidatura con
`POST /applications`. Le card vengono poi raggruppate in base allo stato.

## Stili

I colori e le misure condivise sono in `src/styles/tokens.css`. Ogni componente
ha il proprio file `.module.css`, così struttura e stile restano vicini e facili
da trovare.

## Comandi utili

```bash
pnpm dev    # avvia lo sviluppo
pnpm lint   # controlla il codice
pnpm build  # crea la versione di produzione
```
