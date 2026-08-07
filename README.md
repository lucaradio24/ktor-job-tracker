# JobTracker

JobTracker organizza candidature, colloqui, offerte e uscite. Il repository
contiene un'API Ktor con MongoDB e un frontend Next.js autenticato con Auth0.

## Architettura

Il browser parla soltanto con Next.js. Le route server e il proxy same-origin
`/api/applications` ottengono l'access token Auth0 e chiamano Ktor; Ktor ricava
`ownerId` dal claim `sub` e filtra ogni query MongoDB per utente.

```text
Browser → Next.js/Auth0 → Ktor API → MongoDB
```

Lo storico degli stati è scritto dal server. Il frontend non può inviare o
riscrivere `statusHistory`.

## Requisiti

- JDK 21;
- MongoDB;
- tenant Auth0 con una API e una Regular Web Application;
- Node.js 24 e pnpm per il frontend.

## Configurazione backend

Copia `.env.example` in `.env` e sostituisci i placeholder. `.env` è ignorato
da Git e non deve essere versionato.

| Variabile | Obbligatoria | Uso |
| --- | --- | --- |
| `MONGODB_URI` | sì | Connessione MongoDB |
| `MONGODB_DATABASE` | no | Database, default `job_tracker` |
| `AUTH0_ISSUER` | sì | Issuer JWT completo di `https://` |
| `AUTH0_AUDIENCE` | sì | Audience dell'API Auth0 |
| `CORS_ALLOWED_ORIGINS` | no | Origini esatte separate da virgola; default locale |

In produzione limita `CORS_ALLOWED_ORIGINS` ai soli frontend previsti. Il flusso
normale usa il proxy Next e non espone l'URL Ktor al browser.

## Avvio locale

Avvia MongoDB, quindi dalla root:

```powershell
.\gradlew.bat run
```

L'API risponde su `http://localhost:8080`; `GET /health` verifica il processo e
`GET /mongo-health` verifica anche MongoDB. Per il frontend segui
[frontend/README.md](frontend/README.md).

## Verifica

```powershell
.\gradlew.bat test
.\gradlew.bat build
Set-Location frontend
node --test src/features/applications/model/applicationStats.test.ts src/features/preferences/preferences.test.ts
pnpm lint
pnpm build
```

Il deploy non è incluso: provider, domini, callback Auth0 e segreti vanno
configurati nell'ambiente scelto senza commetterli nel repository.
