# Frontend JobTracker

Interfaccia Next.js 16 per gestire la pipeline, aprire l'inspector, creare e
modificare candidature, consultare statistiche e scegliere tema, densità e
movimento. Il layout segue la direzione Graphite + Porcelain.

## Configurazione

Richiede Node.js 24 e pnpm. Copia `.env.example` in `.env.local`, poi sostituisci
i placeholder senza versionare il file.

| Variabile | Uso |
| --- | --- |
| `API_URL` | URL Ktor server-only, per esempio `http://localhost:8080` |
| `AUTH0_DOMAIN` | Dominio tenant Auth0 |
| `AUTH0_CLIENT_ID` | Client ID della Regular Web Application |
| `AUTH0_CLIENT_SECRET` | Client secret Auth0 |
| `AUTH0_SECRET` | Segreto esadecimale per cookie/sessione |
| `APP_BASE_URL` | URL pubblico Next, in locale `http://localhost:3000` |
| `AUTH0_AUDIENCE` | Audience della stessa API configurata in Ktor |

`API_URL` non è pubblica: browser e componenti client usano il proxy
same-origin `/api/applications`. Per lo sviluppo configura in Auth0 almeno la
callback `http://localhost:3000/auth/callback` e l'origine/logout locale.

## Avvio locale

Con backend e MongoDB già attivi:

```powershell
pnpm install
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000). Le preferenze UI vengono
salvate solo sul dispositivo in `jobtracker.preferences.v1`.

## Flusso dati

Le pagine server leggono Ktor con un token Auth0. Le mutazioni client passano
dal proxy Next, applicano un aggiornamento ottimistico e fanno rollback in caso
di errore. Ktor è l'unica fonte dello storico stati; le statistiche sono
aggregate localmente dai record già caricati, senza endpoint analytics.

```text
src/app/                      route, layout, proxy API e stati limite
src/components/               topbar e feedback condivisi
src/features/applications/    API, modello, board, inspector e form
src/features/preferences/     preferenze locali e pagina impostazioni
src/styles/                   token semantici e base globale
```

## Verifica

```powershell
node --test src/features/applications/model/applicationStats.test.ts src/features/preferences/preferences.test.ts
pnpm lint
pnpm build
```

La build non contiene credenziali o dati demo. Configura segreti e URL nel
provider scelto al momento del deploy.
