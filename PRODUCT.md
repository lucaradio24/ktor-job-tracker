# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Persone in cerca di lavoro che vogliono tenere ordinato il proprio percorso di candidatura, dalla prima candidatura fino a colloqui, offerte o rifiuti.

## Product Purpose

JobTracker raccoglie le candidature in uno spazio privato e semplice, così l'utente può capire rapidamente a che punto si trova ogni opportunità e aggiornare il proprio percorso senza ricostruirlo da note o fogli separati. Il successo significa avere una visione affidabile e aggiornata della ricerca di lavoro.

## Positioning

Una board personale focalizzata sul flusso reale della ricerca di lavoro: ogni candidatura è una scheda che si sposta direttamente tra le fasi tramite drag-and-drop.

## Operating Context

L'utente accede con il proprio account, registra azienda, ruolo, data, città, annuncio e note, cerca per azienda o ruolo e aggiorna lo stato della candidatura mentre procede nella selezione.

## Capabilities and Constraints

- Funzioni attuali: autenticazione, creazione, consultazione, modifica ed eliminazione delle candidature; ricerca; board per candidature, colloqui, offerte e rifiuti; cambio di stato tramite drag-and-drop.
- Ogni utente può accedere soltanto alle proprie candidature.
- L'interfaccia è in italiano.
- Lo stack esistente è Next.js/React sul frontend e Ktor/Kotlin con MongoDB sul backend; Auth0 gestisce l'autenticazione.
- Evoluzioni future confermate, ma non ancora disponibili: statistiche sulla ricerca di lavoro e impostazioni modificabili dall'utente.

## Brand Commitments

- Nome: JobTracker / Job Tracker.
- Identità esistente da preservare: logo e illustrazioni del robot presenti in `frontend/public/`.
- Voce italiana, diretta, rassicurante e orientata a rimettere ordine nella ricerca di lavoro.

## Evidence on Hand

- Implementazione funzionante della dashboard, dei flussi CRUD, del drag-and-drop e dell'autenticazione nel repository.
- Asset proprietari disponibili in `frontend/public/jobtracker-logo.png` e nei file `frontend/public/robot-*.png`.
- Non sono presenti testimonianze, clienti, benchmark o dati reali sulle prestazioni del prodotto; i lavori futuri non devono inventarli.

## Product Principles

- Rendere immediatamente leggibile lo stato della ricerca di lavoro.
- Ridurre il lavoro necessario per registrare e aggiornare una candidatura.
- Mantenere private e separate le informazioni di ogni utente.
- Far evolvere statistiche e impostazioni senza complicare il flusso principale.
- Comunicare in italiano con chiarezza e senza giudicare l'esito delle candidature.
