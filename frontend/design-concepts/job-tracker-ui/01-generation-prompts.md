# Job Tracker UI concepts — prompt set

I prompt finali sono composti da: **base comune + stile + flusso**.

## Base comune

```text
Use case: ui-mockup
Asset type: high-fidelity desktop web app screen for Job Tracker
Primary request: design a shippable Italian job-application tracking interface, grounded in the existing Job Tracker product
Composition/framing: full front-facing 16:9 desktop viewport at 1440px-class width; persistent left sidebar; no browser chrome; no device frame; no perspective
Navigation text (verbatim): "Job Tracker", "Panoramica", "Candidature", "Colloqui", "Impostazioni"
Product behavior: clear page title, one obvious primary action, practical filters and secondary actions, meaningful realistic sample data
Typography: large readable page title; body and labels must remain legible; no decorative microtext
Accessibility: plausible WCAG AA contrast; status must use color plus text, icon, shape, or pattern; strong focus-ready controls; generous click targets
Consistency: reusable navigation, buttons, cards, inputs, badges, spacing and semantic status palette across all four flows
Constraints: accurate Italian text; no lorem ipsum; no third-party logos; no watermark; no marketing website; no concept-art lighting; no 3D UI; no glass effects that reduce contrast; no clipped panels; no duplicated navigation
```

## Stile A — Obsidian Focus

```text
Style/medium: polished dark productivity SaaS UI; calm, precise and premium; inspired by the speed and restraint of modern developer tools without copying a specific product
Color palette: graphite #0A0B0F, layered panels #111318 and #181B22, warm off-white text, coral #FF735C primary action, amber #F4B942 brand detail, restrained violet and mint for statuses
Visual language: subtle 1px borders, 10–12px radii, shallow shadows, generous negative space, crisp line icons, clean Manrope-like sans serif
Avoid: pure black expanses, neon overload, heavy gradients, excessive cards, glow around every element
```

## Stile B — Dev Console

```text
Style/medium: developer-first operator console; compact but readable; keyboard-oriented; terminal-inspired without becoming a literal terminal
Color palette: near-black #070A0D, grid lines #1D2830, cool gray panels, electric cyan #56D7E8, terminal green #79E08F, amber warnings, coral only for destructive or rejected states
Visual language: monospace display labels paired with a highly readable sans serif body; square 4–6px radii; thin technical dividers; command palette affordance; small shortcut hints; structured split panes
Avoid: code rain, fake source code, hacker clichés, tiny unreadable labels, oversaturated neon, glowing text
```

## Stile C — Pixel Office

```text
Style/medium: polished retro pixel productivity UI; friendly 16-bit office-computer character while remaining a credible modern web app
Color palette: midnight #151324, panels #211E35, warm cream #F6E7CF, coral #F07167, gold #F2C14E, mint #8BD3A5, lavender #A995FF
Visual language: crisp 2px pixel borders, stepped corners, tiny 8-bit sun brand sprite, blocky status icons, bitmap-style headings paired with a readable pixel-compatible body font, no antialias blur
Avoid: game scene, characters or avatars as decoration, CRT distortion over content, scanlines across text, novelty at the expense of hierarchy
```

## Flusso 1 — Panoramica

```text
Page: overview dashboard
Active navigation: "Panoramica"
Title (verbatim): "Panoramica"
Subtitle (verbatim): "La tua ricerca, a colpo d'occhio."
Primary action (verbatim): "Nuova candidatura"
Content: KPI cards "24 Candidature", "5 Colloqui", "2 Offerte", "21% Tasso di risposta"; an eight-week activity chart titled "Attività candidature"; a compact pipeline distribution with direct labels "Inviate", "Colloqui", "Offerte", "Rifiutate"; panel "Prossimi colloqui" with two dated items; panel "Da seguire" with overdue follow-ups
Sample data: "Kineton · Frontend Developer", "Webidoo Engineering · Software Engineer", "Doubleloop · Software Developer"
Hierarchy: KPIs first, trend and upcoming actions second, details third; no more than two chart types
```

## Flusso 2 — Candidature

```text
Page: job applications pipeline
Active navigation: "Candidature"
Eyebrow (verbatim): "CANDIDATURE"
Title (verbatim): "Le tue opportunità, in ordine."
Subtitle (verbatim): "Tieni sotto controllo ogni fase della tua ricerca."
Primary action (verbatim): "Nuova candidatura"
Controls: search input "Cerca azienda o ruolo"; filter "Filtri"; view switch "Board" and "Lista"
Content: four practical kanban columns with text counts: "Candidature 8", "Colloqui 5", "Offerte 2", "Rifiutate 9"; compact cards with company, role, date, location, status symbol and next-action cue
Sample cards: "Kineton — Frontend Developer — Remote", "Webidoo Engineering — Software Engineer — Remote", "Doubleloop — Software Developer — Milano", "Nova Labs — Product Engineer — Torino"
Hierarchy: controls stay secondary to title and CTA; columns are easy to scan; cards are compact but not cramped
```

## Flusso 3 — Colloqui

```text
Page: interview planning workspace
Active navigation: "Colloqui"
Title (verbatim): "Colloqui"
Subtitle (verbatim): "Preparati bene, al momento giusto."
Primary action (verbatim): "Aggiungi colloquio"
Content: week strip "27 lug — 2 ago"; agenda timeline with three interview cards; highlighted next interview "Kineton · Frontend Developer", "30 lug · 10:30", "Videochiamata"; preparation panel titled "Prepara il prossimo colloquio" with checklist "Ricerca azienda", "Domande da fare", "Prova tecnica", "Note"; small progress label "2 di 4 completate"; panel "Promemoria" and secondary action "Apri scheda candidatura"
Sample interviews: Kineton, Webidoo Engineering, Nova Labs
Hierarchy: next interview is unmistakable; calendar, preparation state and actions are visible without opening a modal
```

## Flusso 4 — Impostazioni

```text
Page: settings
Active navigation: "Impostazioni"
Title (verbatim): "Impostazioni"
Subtitle (verbatim): "Personalizza il tuo spazio di lavoro."
Content structure: inner settings navigation with "Profilo", "Preferenze", "Notifiche", "Aspetto", "Dati e privacy"; main section "Preferenze" with language "Italiano", date format "GG/MM/AAAA", default view "Board"; notification toggles "Promemoria colloqui", "Follow-up candidature", "Riepilogo settimanale"; appearance selector with three small theme choices; data area with secondary action "Esporta dati" and restrained danger action "Elimina account"
Primary save action (verbatim): "Salva modifiche"
Hierarchy: form labels remain close to controls; destructive action is separated from routine settings; selected states are clear beyond color alone
```

