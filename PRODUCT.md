# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Persone in cerca di lavoro che vogliono tenere ordinato il proprio percorso di candidatura, dalla prima registrazione fino a colloqui, offerte, mancata selezione o ritiro.

## Product Purpose

JobTracker raccoglie le candidature in uno spazio privato e semplice, così l’utente può capire rapidamente a che punto si trova ogni opportunità, ricostruirne il percorso e aggiornare lo stato senza dipendere da note o fogli separati. Il successo significa avere una visione affidabile e aggiornata della ricerca di lavoro.

## Positioning

Una workspace personale focalizzata sul percorso reale della ricerca di lavoro: tre tappe attive (`APPLIED`, `INTERVIEW`, `OFFER`), esiti separati (`REJECTED`, `WITHDRAWN`) e dettaglio contestuale della singola candidatura.

## Operating Context

L’utente accede con il proprio account, registra azienda, ruolo, data, stato, città, annuncio e note, cerca per azienda o ruolo, aggiorna lo stato dalla board o dall’inspector e consulta statistiche derivate dalle proprie candidature. Le preferenze di interfaccia vengono salvate sul dispositivo.

## Capabilities and Constraints

- Funzioni attuali: autenticazione; creazione, consultazione, modifica ed eliminazione delle candidature; ricerca; board a tre tappe attive; vista separata degli esiti; cambio di stato tramite drag-and-drop, menu o inspector; statistiche; impostazioni locali.
- In creazione lo stato è selezionabile tra tutti e cinque i valori, con `APPLIED` come default. Non è obbligatorio che una nuova candidatura nasca in `APPLIED`.
- Il server possiede `statusHistory`: registra la prima transizione al momento della creazione con timestamp server e aggiunge una transizione soltanto quando lo stato cambia davvero.
- Inspector e statistiche tollerano record legacy senza cronologia; una durata sconosciuta non viene rappresentata come zero.
- Le statistiche sono calcolate dalle candidature già disponibili: ultimi 30 giorni, distribuzione corrente, accesso a colloqui, offerte, città principali, durata media campionata e copertura dello storico.
- Tema scuro, chiaro o di sistema; densità comoda o compatta; movimento di sistema o ridotto. Queste preferenze sono locali al dispositivo e non modificano i dati delle candidature.
- Ogni utente può accedere soltanto alle proprie candidature.
- L’interfaccia è in italiano.
- Lo stack esistente è Next.js/React sul frontend e Ktor/Kotlin con MongoDB sul backend; Auth0 gestisce l’autenticazione.
- `nextAction` è intenzionalmente rinviato e non fa parte del modello o dell’interfaccia corrente.

## Brand Commitments

- Nome: JobTracker / Job Tracker.
- Direzione visiva: “Night Route”, palette Graphite + Porcelain e segnali di stato attenuati.
- Shell compatta con topbar; nessuna sidebar persistente.
- Identità esistente da preservare: logo e illustrazioni del robot presenti in `frontend/public/`.
- Il robot è contestuale: stati vuoti, orientamento ed errori, non decorazione ripetuta nella dashboard piena.
- Voce italiana, diretta, rassicurante e orientata a rimettere ordine nella ricerca di lavoro.

## Evidence on Hand

- Implementazione funzionante nel repository dei flussi CRUD, della board responsive, dell’inspector, dello storico di stato server-owned, delle statistiche, delle preferenze locali e dell’autenticazione.
- Test automatici coprono la cronologia di stato backend e il calcolo delle statistiche frontend, inclusi record legacy e divisioni per zero.
- Asset proprietari disponibili in `frontend/public/jobtracker-logo.png` e nei file `frontend/public/robot-*.png`.
- Non sono presenti testimonianze, clienti, benchmark o dati reali sulle prestazioni del prodotto; i lavori futuri non devono inventarli.

## Product Principles

- Rendere immediatamente leggibile ciò che è attivo, separandolo dagli esiti.
- Ridurre il lavoro necessario per registrare e aggiornare una candidatura.
- Conservare una cronologia attendibile senza chiedere all’utente di gestirne i timestamp.
- Usare i dati disponibili senza inventare precisione per i record legacy.
- Mantenere private e separate le informazioni di ogni utente.
- Personalizzare l’interfaccia senza introdurre configurazione lato server non necessaria.
- Comunicare in italiano con chiarezza e senza giudicare l’esito delle candidature.
