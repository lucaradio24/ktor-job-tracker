---
version: 1
slug: "frontend-src-app-workspace-page-tsx"
primary_target: "frontend/src/app/(workspace)/page.tsx"
related_targets: ["frontend/src/app/(workspace)/applications/[id]/page.tsx"]
---

# Workspace candidature

- **Scope and mode:** full application-management flow in Operate mode: populated board, create, selected-application inspector, detail/edit, outcomes, empty states and feedback.
- **Approved direction:** `.impeccable/mocks/jobtracker-night-route-inspector.png`, refined to Graphite + Porcelain. Near-black neutral surfaces replace the blue cast; the primary action is porcelain rather than coral. Status colors and motion carry liveliness.
- **Desktop:** compact topbar, three active pipeline columns (`Candidature`, `Colloqui`, `Offerte`) and a contextual inspector for the selected application. `Non selezionate` and `Ritirate` are exits from any active stage, not sequential columns.
- **Route behavior:** a 1px line connects active stage headers at rest. Only the selected application receives a 2px contextual path toward its current or proposed destination. Never connect every card or animate the route continuously.
- **Approved inspector:** show application identity, dated journey, time since application, time in current state and quick actions. Primary quick action advances state; note and announcement-link actions remain secondary. Rejection and withdrawal stay under `Altre azioni`. `nextAction` is deferred until a real usage requirement emerges.
- **Data boundary:** dated stage history, time in stage and interview counts require persisted transition/event history; never infer them from current status. Demonstration values are not product claims.
- **Mobile:** horizontal status filters and a vertical card list; selection opens a dedicated full-page detail with a native back action. No drag-only, hover-only or tiny targets.
- **Mascot:** use repository robot only in contextual help, empty/error/success states or a quiet inspector prompt; never repeat it in normal cards.
- **Do not literalize:** generated companies, dates and counts are layout material. Implementation uses real application and authentication data. Statistics remain limited to fields supported by model until history exists.
