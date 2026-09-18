# NSFDC Scheme Sarthi

**SIH 2026 · PS 26092 — AI-Driven Scheme Matching for Marginalized Entrepreneurs**
Ministry of Social Justice & Empowerment (MoSJE) · Theme: Smart Automation · Category: Software

A working prototype that solves the three stated problems in one flow:

1. **Which scheme fits me?** → a transparent rule engine ranks NSFDC schemes with an explainable fit score.
2. **What will it cost me per month?** → a real reducing-balance EMI engine with moratorium handling.
3. **Where do I apply?** → a geo-spatial Channel-Partner router that avoids stressed / high-NPA partners.

> **Prototype for SIH** — scheme data and partner data shown for demonstration; to be validated
> against live NSFDC/SCA data upon integration. Partner health / NPA / overdue values are
> **illustrative mock data**; real partner names/types come from the official NSFDC
> channel-partner lists.

---

## Quick start

```bash
cd prototype
npm install
npm run dev      # http://localhost:5173
```

Other commands:

```bash
npm test         # 25 unit tests (engine, EMI maths, geo routing)
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

**3-minute demo path:** Find My Scheme → *Check eligibility* → *Project EMI* → Partner Locator
(switch state to **West Bengal** to see the health-aware reroute) → Track Application → *demo ID*.

---

## Architecture

```
prototype/src
├── modules/                     feature slices — each owns its logic, types and UI
│   ├── recommender/             rule engine + scheme data
│   │   ├── schemes.ts           NSFDC scheme slabs (verbatim, with source URLs)
│   │   ├── engine.ts            explainable weighted decision tree
│   │   ├── engine.test.ts       10 tests
│   │   └── RecommenderPage.tsx
│   ├── emi/                     amortisation engine
│   │   ├── emi.ts               reducing-balance EMI, 2 moratorium models
│   │   ├── emi.test.ts          9 tests
│   │   ├── AmortChart.tsx       hand-rolled SVG chart (no chart dependency)
│   │   └── EmiPage.tsx
│   ├── locator/                 geo-spatial routing
│   │   ├── partners.ts          partner dataset (real names + mock health)
│   │   ├── geo.ts               haversine + health-aware ranking
│   │   ├── geo.test.ts          6 tests
│   │   ├── MapView.tsx          vanilla Leaflet wrapper (OSM tiles, no API key)
│   │   └── LocatorPage.tsx
│   └── tracking/TrackingPage.tsx
├── shared/                      cross-module building blocks
│   ├── components/              Header, Footer, Disclaimer, GovtCrest
│   └── utils/format.ts          Indian currency/number formatting
├── i18n/                        English + Hindi dictionary (extensible)
│   ├── index.tsx                `t(key, params)` with `{param}` interpolation
│   └── message.ts               IMessage — domain logic emits keys, not English
└── App.tsx                      tab shell & cross-module hand-off
```

> **Bilingual by construction:** the recommender and router return `{ key, params }`
> messages instead of English strings, so the *same* reasoning trail renders in
> English or Hindi. The engine never knows which language is active. A regression
> test asserts no message key ever contains English prose.

### Why these choices

| Decision | Rationale |
|---|---|
| **React + Vite + TS SPA** | No backend exists; all logic is deterministic and local. A Vite SPA builds and demos fastest and runs offline after build. |
| **No server-state library** (no TanStack/Zustand/Redux) | There is no server state. UI state is `useState` + one i18n context. Adding a query layer would be pure ceremony. |
| **Vanilla Leaflet, not react-leaflet** | One dependency fewer, no React-version compatibility risk, and a single imperative `useEffect` is enough. |
| **Hand-rolled SVG chart** | Avoids a chart library; renders identically offline — a genuine consideration for the rural/low-bandwidth target user. |
| **Vitest** | Natural test runner for a Vite project; gives the engine and money maths a real regression net. |

### Logic layer (the part that matters)

**Recommendation engine** (`modules/recommender/engine.ts`) — a weighted, fully explainable
decision tree, not a black box. Every result carries `reasons[]` and `blockers[]`.

```
fitScore = 100 × ( 0.32·costFit + 0.30·rateFit + 0.18·moratoriumFit + 0.20·purposeFit )
```

Hard gates first (SC community, ₹5L income ceiling, cost > 0), then per-scheme band,
LTV (90%) and loan-ceiling checks. The interface is deliberately narrow so the engine can
later be swapped for a trained classifier over the same feature vector.

**EMI engine** (`modules/emi/emi.ts`) — standard reducing-balance amortisation with an explicit
choice of moratorium model:

- **interest-only** — borrower pays simple monthly interest; principal stays flat.
- **deferred** — nothing is paid; accrued interest is capitalised into the principal.

`tenureMonths` includes the moratorium, matching the official wording
(“repayable in 7 years including a 6-month moratorium”).

**Router** (`modules/locator/geo.ts`) — haversine distance + fund-health + scheme-authorisation:

```
routeScore = 100 × ( 0.50·proximity + 0.35·health + 0.15·schemeMatch )
```

This is the core differentiator: a healthy partner 10 km away is a better routing than a
high-NPA partner at 0 km, because the latter is the more likely cause of disbursement delay.
The **Before vs After** panel on the locator shows the naive nearest match next to the
health-aware recommendation.

---

## Data provenance

| Data | Status |
|---|---|
| Scheme slabs, rates, moratoriums, eligibility, income ceiling | **Real** — verbatim from <https://nsfdc.nic.in/scheme> and `/eligibility-requirements` |
| Partner names, types, cities (SCA/PSB/RRB/NBFC-MFI/SFB/Co-op) | **Real** — parsed from the 8 official PDFs at <https://nsfdc.nic.in/our-channel-partners> |
| Partner fund-health, NPA band, overdue %, branch counts | **Mock / illustrative** |
| District-branch partners and coordinates | **Mock / illustrative** (city-centroid geocoding) |

Full research trail: `../research-notes.md`. Raw partner PDFs: `../research/raw/`.

---

## Roadmap to production

1. Replace static scheme config with an NSFDC/SCA data feed (or a data-sharing MOU).
2. Ingest partner fund-utilisation / NPA data to replace the mock health score.
3. Wire the apply/track screens to the PM-SURAJ portal APIs.
4. Swap the rule engine for a classifier once labelled routing outcomes exist.
5. Add voice/IVR and CSC kiosk modes for low-literacy users.
