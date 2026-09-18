# SIH 2026 — Idea Presentation Content
**Problem Statement 26092 · AI-Driven Scheme Matching for Marginalized Entrepreneurs**
Theme: Smart Automation · Category: Software · Organisation: Ministry of Social Justice and Empowerment (MoSJE)

> **How to use this file.** Paste the text as-is into the official `SIH2025-IDEA-Presentation-Format.pptx`
> (6 slides max, including title). SIH requires **points / diagrams / infographics only — no paragraphs**
> — and the final upload must be a **PDF**. Do not change the mandatory section headers. Asset files are
> referenced in `[ ... ]` and live in `ppt-assets/`.

## Asset inventory

| Asset | File | Use on |
|---|---|---|
| System architecture diagram | `ppt-assets/diagrams/architecture.svg` (+ `.mmd` source) | Slide 3 |
| Data flow diagram | `ppt-assets/diagrams/dataflow.svg` (+ `.mmd` source) | Slide 3 |
| Landing hero | `ppt-assets/screenshots/01-landing.png` | Slide 1 / 2 |
| Recommender result | `ppt-assets/screenshots/02-recommender-result.png` | Slide 2 / 5 |
| EMI chart + schedule | `ppt-assets/screenshots/03-emi-chart.png` | Slide 3 / 5 |
| Partner locator + health routing | `ppt-assets/screenshots/04-partner-locator.png` | Slide 3 / 5 |
| Hindi (bilingual) view | `ppt-assets/screenshots/05-hindi-locator.png` | Slide 5 |
| Application tracking | `ppt-assets/screenshots/06-track-application.png` | Slide 5 |
| Mobile view | `ppt-assets/screenshots/07-mobile.png` | Slide 4 / 5 |

---

## SLIDE 1 — TITLE PAGE

### On-slide content (verbatim / paste)

```
SMART INDIA HACKATHON 2026

Problem Statement ID — 26092
Problem Statement Title — AI-Driven Scheme Matching for Marginalized Entrepreneurs
Theme — Smart Automation
PS Category — Software

Team ID — [FILL: Team ID]
Team Name (Registered on portal) — [FILL: Team Name]
College / Institution Name — [FILL: College/Institution]

Team Leader — [FILL: Name]
Team Member 2 — [FILL: Name]
Team Member 3 — [FILL: Name]
Team Member 4 — [FILL: Name]
Team Member 5 — [FILL: Name]
Team Member 6 — [FILL: Name]
```

### Visual treatment
- **Header band** in navy `#0b2a5b` across the top ~28% of the slide; a **4 px saffron `#f47920` rule** under it.
- Place the **generic spoke-wheel crest** (from `GovtCrest.tsx`, not the State Emblem) at top-left of the band; "Ministry of Social Justice & Empowerment · NSFDC" in small caps beside it.
- White title card below the band with the PS ID + title in bold navy; theme/category as two saffron-outlined pills.
- Bottom-right: a **rounded screenshot thumbnail** — `01-landing.png`, cropped to the hero only.
- Footer strip: "Prototype for SIH · to be validated against live NSFDC/SCA data" + the NSFDC helpline `1800 110 396`.
- Palette: navy `#0b2a5b`, saffron `#f47920`, white, paper-grey `#f4f6fb`. No protected emblems, no third-party logos.

### Speaker note
"Citizens eligible for concessional SC loans don't know which scheme fits them or which office to approach — our platform answers both in one flow, in their own language."

---

## SLIDE 2 — PROPOSED SOLUTION

### Headline
**One portal that matches the scheme, projects the EMI, and routes the citizen to the right office.**

### On-slide bullets
- **Unified 3-in-1 platform** — Smart Scheme Recommender + Financial (EMI) Calculator + Geo-Spatial Partner Locator, in a single bilingual flow.
- **Explainable recommender** — rule-based weighted engine maps `{purpose, cost, income, education}` → ranked NSFDC schemes with a **0–100 fit score** and a plain-language *why*.
- **Real repayment math** — reducing-balance amortisation across **6.5%–15%** with **3–12 month moratoriums** (interest-only or capitalised), year-wise schedule + chart.
- **Health-aware routing** — ranks the nearest **authorised** Channel Partner (SCA / PSB / RRB / NBFC-MFI / SFB / Co-op) and avoids stressed, high-NPA partners.
- **Built for the citizen** — English + हिन्दी, mobile-first, GIGW-style accessibility toolbar, works after a single build (low-bandwidth friendly).
- **Scales beyond SC** — same engine extends to NBCFDC / NSKFDC / NHFDC with only a registry swap.

### Pain point → solution (3 mapping bullets)
- **Misrouted applications** → the rule engine applies the SC-only and ₹5 lakh income gates *before* showing any scheme, then band-matches project cost to the correct slab.
- **"Cannot find the right nearby Channel Partner"** → the geo router filters by scheme authorisation **and** fund health, so the citizen is sent to an eligible, healthy office — not just the closest one.
- **Unawareness of the EMI burden** → the calculator shows the exact monthly EMI, total interest and total repayment *before* applying, reducing drop-off and defaults.

### Unique Value Proposition
> **Unlike generic scheme portals (myScheme, Jan Samarth), we route on *partner fund health*, not just scheme eligibility — and every recommendation is explainable, bilingual and low-bandwidth.** A healthy partner 10 km away is a better routing than a high-NPA partner next door.

### Visual
- Right side: `02-recommender-result.png` (the MFS card with **75 fit score**, ₹72,000 loan, ₹8,000 own contribution) inside a rounded "browser" frame.
- Left: 6 bullets in two columns. A small **3-node icon strip** across the bottom: *(1) Recommender → (2) EMI → (3) Partner Locator*.
- Bottom ribbon: one-line UVP in a saffron-outlined box.

### Speaker note
"myScheme tells you which scheme. Jan Samarth lets you apply. Neither tells you that the nearest office is stressed and will delay your file. That's the gap we close."

---

## SLIDE 3 — TECHNICAL APPROACH  *(highest-weighted — richest slide)*

### Headline
**Explainable, deterministic decision engine + real amortisation + health-aware geo-routing — no black box.**

### On-slide bullets — Tech stack
- **Frontend:** React 18 + Vite + TypeScript (component-module architecture); plain CSS design tokens; GOV-style theme; EN/हिन्दी i18n.
- **Logic layer:** pure TypeScript modules — recommender engine, EMI engine, geo router (framework-free, unit-tested).
- **Testing:** Vitest — **24 unit tests** across engine, EMI maths and routing.
- **Mapping:** Leaflet + OpenStreetMap tiles — **no paid API key**.
- **Charts:** hand-rolled SVG — zero chart dependency, renders offline.
- **Data:** static TypeScript registries today → swappable for NSFDC/SCA feeds.
- **Deploy:** static build (`npm run build`) → any government cloud / NIC hosting; single command to run (`npm run dev`).

### On-slide bullets — Methodology
- **Step 1 — Hard eligibility gates:** SC community · annual family income ≤ ₹5 lakh · cost > 0.
- **Step 2 — Scheme band match:** cost ↔ NSFDC slab (MFS ≤ ₹1.4 L · Term Loan ₹1.4–50 L · Aajeevika · Udyam Nidhi ≤ ₹5 L · Education Loan ≤ ₹40 L).
- **Step 3 — Weighted fit scoring (explainable):**
  `fit = 0.32·costFit + 0.30·rateFit + 0.18·moratoriumFit + 0.20·purposeFit` → 0–100, with `reasons[]` and `blockers[]`.
- **Step 4 — EMI amortisation:** reducing-balance EMI; moratorium **interest-only** or **capitalised**; tenure includes moratorium; year-wise schedule + total interest.
- **Step 5 — Health-aware routing:** `score = 0.50·proximity + 0.35·fundHealth + 0.15·schemeAuth`; filters high-NPA partners.
- **Swap-ready:** the engine's inputs/outputs are a fixed interface — replaceable by an ML classifier over the same feature vector without touching the UI.

### Data flow (one line)
`Input (user profile) → Process (gates → band match → scoring → amortisation → routing) → Output (ranked scheme + EMI + nearest healthy partner) → Action (apply / visit / track)`

### Visual (this slide carries two diagrams)
- **Top 60%:** `ppt-assets/diagrams/architecture.svg` — the 4-layer architecture (Presentation → Application/Decision → Data → future Integration).
- **Bottom 40%:** `ppt-assets/diagrams/dataflow.svg` — the Input→Process→Output→Action pipeline with the feedback loop.
- **Inset (small, right):** `03-emi-chart.png` cropped to the chart + a tiny `04-partner-locator.png` map thumbnail, to prove the described modules are *actually built*.
- Keep the formula boxes (Step 3 & Step 5 weights) as an on-slide infographic — judges weight this slide highest.

### Speaker note
"Technical Approach is weight-heavy, so to be explicit: this is not a mockup. Twenty-four unit tests cover the recommender, the amortisation maths and the routing, and every recommendation prints the exact reasons it was ranked where it was."

---

## SLIDE 4 — FEASIBILITY AND VIABILITY

### Headline
**Working prototype today; phased data integration tomorrow — no dependency on unavailable APIs to demo value.**

### On-slide bullets — What is already built (prototype)
- End-to-end working flow: eligibility → recommendation (with explanation) → EMI projection → partner routing → application tracking.
- Real NSFDC scheme slabs, rates and moratoriums wired into the engine; real channel-partner names/types.
- Bilingual (EN/हिन्दी), mobile-responsive, GIGW-style accessibility controls.

### On-slide bullets — What needs integration
- Live **NSFDC / SCA** scheme & allocation feed (or a data-sharing MOU with DoSJE).
- **PM-SURAJ** APIs for actual application submission and status.
- Per-partner **fund-utilisation / NPA / overdue** data to replace the mock health score.

### On-slide bullets — Risks & mitigation
| Risk | Mitigation |
|---|---|
| Partner NPA / fund-health data is not publicly exposed | **Phase 1:** static, quarterly-refreshed partner data; **Phase 2:** SCA data feed |
| NSFDC/SCA APIs may not exist or be restricted | Data-sharing MOU with DoSJE; start with a periodic bulk feed, not live APIs |
| Multilingual content accuracy | Government-reviewed translation memory; professional review of all scheme text |
| Low digital literacy of target users | **Voice / IVR fallback**, human-assisted **kiosk mode at CSCs**, and a 3-input simplified flow |

### Visual
- Left: **"Built vs To-integrate"** two-column infographic with green/amber ticks (green = shipped, amber = integration).
- Right: a **phased roadmap arrow** — *Phase 1 static data → Phase 2 MOU + periodic feed → Phase 3 live APIs + ML*.
- Bottom strip: `07-mobile.png` (mobile view) + CSC/kiosk icon to signal reach beyond smartphones.

### Speaker note
"We deliberately designed so value is delivered with static data on day one; the live feeds upgrade the score, they don't gate the launch."

---

## SLIDE 5 — IMPACT AND BENEFITS

### Headline
**Fewer misrouted files, faster disbursement, and fund flow redirected to healthy Channel Partners.**

### On-slide bullets — Measurable benefits
- **Reduced application misrouting** — eligibility gates run *before* the citizen travels, cutting rejections due to wrong scheme/office.
- **Faster time-to-disbursement** — routing away from high-NPA/stressed partners removes a known cause of file delay.
- **Greater scheme awareness & uptake** — 5 NSFDC schemes become discoverable in one bilingual flow instead of scattered PDFs.
- **Lower default risk** — citizens see the full EMI and total interest *before* borrowing, improving financial literacy.
- **Better fund utilisation** — healthy partners get the flow; stressed partners are visible to the administering body.

### On-slide bullets — Scalability
- The recommender, EMI engine and router are **registry-driven** — adding a scheme or partner is a data change, not a code change.
- Same engine extends to **NBCFDC, NSKFDC and NHFDC** (identical channel-finance pattern) → one platform for all marginalised-group finance corporations.
- Leaflet + OpenStreetMap scales nationwide with no per-request map cost.

### On-slide bullets — Sustainability
- Government can own and maintain the rule engine **without ML infrastructure** — it is transparent, auditable TypeScript.
- Near-zero marginal cost to add schemes, partners, states or languages.
- Static-build deployment fits existing NIC / government-cloud hosting.

### Visual (this slide carries the prototype evidence)
- **Top band:** a 3-up screenshot strip — `02-recommender-result.png` · `03-emi-chart.png` · `04-partner-locator.png` (labelled *Recommender · EMI · Health-aware routing*).
- **Middle:** before/after impact infographic — *"Nearest partner: health 49/100, NPA High"* → **"Routed partner: health 74/100, NPA Low"** (taken directly from the locator's Before vs After panel).
- **Bottom:** `05-hindi-locator.png` + `06-track-application.png` as smaller insets, proving bilingual + tracking.
- Three small stat chips: **5 schemes · ~91 channel partners · 24 passing unit tests**.

### Speaker note
"The before/after panel is the clearest proof: at the same location, the naive nearest partner is high-NPA, and our router sends the citizen 10 km to a healthy one."

---

## SLIDE 6 — RESEARCH AND REFERENCES

### Headline
**Built on official NSFDC scheme data and GoI platform design standards.**

### On-slide content (references — verified live on 2026-09-18)

```
1. NSFDC — Loan / Credit Schemes          https://nsfdc.nic.in/scheme
2. NSFDC — Eligibility Requirements       https://nsfdc.nic.in/eligibility-requirements
3. NSFDC — Channel Partners (8 lists)     https://nsfdc.nic.in/our-channel-partners
4. NSFDC — How to Apply (PM-SURAJ)        https://nsfdc.nic.in/how-to-apply-2
5. PM-SURAJ Portal, DoSJE                 https://pmsuraj.dosje.gov.in/
6. myScheme (MeitY / Digital India)       https://www.myscheme.gov.in/
7. Jan Samarth Portal (GoI)               https://www.jansamarth.in/
8. GIGW 3.0 — Govt Web Guidelines         https://guidelines.india.gov.in/
9. Smart India Hackathon — official       https://www.sih.gov.in/
10. SIH Idea Presentation Format          https://www.sih.gov.in/letters/SIH2025-IDEA-Presentation-Format.pptx
11. Open Government Data Platform India   https://data.gov.in/
12. RBI — Master Directions (Priority Sector Lending)
       https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12014
13. NBCFDC (scalability target)           https://nbcfdc.gov.in/nbcfdc/web/
14. NSKFDC (scalability target)           https://nskfdc.nic.in/
```

### Also cited in the solution design
- NSFDC GeM tender — *"Integrated Data Repository and AI/ML Enabled Smart Data Analytical Dashboard cum Decision Support System"* (`nsfdc.nic.in` → announcements) — validates the AI/DSS direction and is a natural integration point.
- Channel-partner dataset: parsed from NSFDC's **8 official partner PDFs** (38 SCAs · 11 PSBs · 26 RRBs · 7 NBFC-MFIs · 2 SFBs · 2 co-op banks · 2 co-op societies · 3 other agencies).

### Visual
- Two-column reference list (above) in small mono font.
- A **"data provenance"** legend box: **green = real/official** (scheme slabs, partner names) · **amber = illustrative mock** (fund-health, NPA, branch coords) — reinforcing the honesty the judges look for.
- Bottom note: *All scheme figures sourced verbatim from NSFDC's official scheme page; mock fields are clearly labelled in the product.*

### Speaker note
"Every rate, limit and moratorium on this deck is from NSFDC's own page — nothing is invented. The only mock values are the per-partner fund-health figures, which NSFDC does not publish, and we label them as mock in the product itself."

---

## Assembly checklist before upload
- [ ] Paste into the **official** `SIH2025-IDEA-Presentation-Format.pptx` without changing the mandatory section headers.
- [ ] Keep to **6 slides** (title included). Delete the instructions slide.
- [ ] No paragraphs — points, diagrams, infographics and screenshots only.
- [ ] Replace every `[FILL: ...]` placeholder on Slide 1.
- [ ] Embed `architecture.svg` + `dataflow.svg` (also available as `.mmd` source if you prefer to re-render).
- [ ] Export to **PDF** and upload only the PDF.
