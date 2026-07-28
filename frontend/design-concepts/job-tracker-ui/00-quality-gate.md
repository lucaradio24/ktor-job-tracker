# Job Tracker UI concepts — quality gate

Questa verifica va eseguita su ogni mockup prima di considerarlo finale.

## Prompt di verifica

> Agisci come un design lead e accessibility reviewer. Valuta questo mockup desktop di Job Tracker come se dovesse passare da concept a implementazione. Non premiare la sola estetica: controlla utilità, chiarezza e coerenza del prodotto.
>
> Assegna da 0 a 2 punti a ciascun criterio:
>
> 1. **Aderenza al prodotto** — è chiaramente un job application tracker, non una dashboard generica.
> 2. **Completezza del flusso** — la schermata rende evidente cosa può capire e fare l’utente.
> 3. **Gerarchia** — titolo, azione primaria, stato e contenuto principale si leggono nell’ordine corretto.
> 4. **Leggibilità** — testo italiano credibile, dimensioni pratiche, niente microtesto decorativo.
> 5. **Accessibilità visiva** — contrasto plausibilmente WCAG AA; gli stati usano almeno due segnali tra colore, testo, forma o icona.
> 6. **Griglia e spaziatura** — allineamenti coerenti, densità intenzionale, nessuna collisione o elemento tagliato.
> 7. **Fedeltà allo stile** — lo stile richiesto è riconoscibile senza trasformare il prodotto in concept art.
> 8. **Coerenza di sistema** — navigazione, componenti, raggi, bordi, palette e azioni possono essere riusati negli altri flussi.
> 9. **Accuratezza del testo** — “Job Tracker”, navigazione, titoli e CTA sono scritti correttamente e una sola volta dove previsto.
> 10. **Qualità del render** — nessun watermark, logo estraneo, device frame, prospettiva 3D, artefatto, testo fuso o UI fuori canvas.
>
> La soglia è **17/20**, senza 0 nei criteri 3, 4, 5 o 9. Se il mockup non passa, indica una sola correzione mirata ad alto impatto e rigenera cambiando esclusivamente quell’aspetto. Se passa, descrivi in una frase perché è implementabile.

## Vincoli non negoziabili

- Desktop web app, vista frontale completa, target 16:9. Un output nativo 3:2 è accettabile soltanto se preserva la stessa griglia desktop senza tagli o pannelli fuori canvas.
- Interfaccia italiana; niente lorem ipsum.
- Sidebar coerente con: “Panoramica”, “Candidature”, “Colloqui”, “Impostazioni”.
- CTA principale: “Nuova candidatura”.
- Nessun logo aziendale o marchio terzo; sono ammessi nomi testuali di aziende d’esempio.
- Nessun dato importante comunicato soltanto tramite colore.
- Grafici con etichette dirette, separatori o simboli; niente testo appoggiato su aree cromatiche a basso contrasto.
- L’estetica pixel deve restare una UI produttiva: bordi e icone pixel, ma corpo testo leggibile.

## Fondamenti verificati

- WCAG 2.2: contrasto minimo 4.5:1 per testo normale, 3:1 per testo grande e componenti grafici; focus visibile e target minimi.
- Atlassian Design: separare colori adiacenti nei grafici, evitare testo sopra colori chart e non usare il colore come unico segnale.
- Carbon Design System: palette categoriali ordinate per distinguibilità e indicatori di stato basati su almeno due segnali visivi.
- Linear e GitHub Projects: viste board/lista, filtri e raggruppamenti salvabili per adattare la stessa pipeline a bisogni diversi.
