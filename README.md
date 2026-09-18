# Research Notes — PS 26092: AI-Driven Scheme Matching for Marginalized Entrepreneurs

> Phase 1 deliverable. Sources verified live on 2026-09-18. Anything not directly sourced is explicitly marked **[MOCK]** or **[TO-VALIDATE]**.

---

## 0. Skill check (Step 0)

| Phase | Skills inspected | Used | Note |
|---|---|---|---|
| Phase 1 Research | `deep-research`, `efficient-web-research`, `tavily-web`, `exa-search` | Direct `webfetch`/`curl` instead | Primary sources were known govt URLs; direct fetch was faster and gave verbatim scheme slabs. No skill was needed. |
| Phase 2 Prototype | `impeccable`, `frontend-design`, `frontend-slides`, `frontend-architecture`, `3d-web-experience`, `diagram-generator` | Will use `impeccable` (UI audit) + hand-built React | Kept build lean — no scaffolding skill needed for a small Vite/React app. |
| Phase 3 PPT | `pptx-deck-creation`, `pptx-official`, `diagram-generator`, `mermaid-expert`, `frontend-slides` | Plan: `pptx-deck-creation` for structure, hand-authored SVG for diagrams | The user wants paste-ready markdown + SVG, so `pptx-official` (binary generation) is not required. |

**No skill matched the whole task.** Phase-specific picks are declared in each phase summary.

---

## 1. The real-world scheme behind PS 26092

**Confirmed:** the problem statement maps 1:1 to the **National Scheduled Castes Finance and Development Corporation (NSFDC)** under the Ministry of Social Justice & Empowerment (MoSJE).

Proof points from the PS vs. the official NSFDC scheme page:

| PS says | NSFDC official page says |
|---|---|
| Micro Finance Scheme ≤ ₹1.4 lakh | "Micro Credit Finance for units costing up to ₹1.40 lakh" |
| Term Loan ≤ ₹50 lakh | "units costing more than ₹1.40 lakh and up to ₹50.00 lakh" |
| Interest range 6.5%–15% | Beneficiary rates: 6.5% (MFS/ELS), 8% (Term Loan), 13%/15% (UNY), 15% (Aajeevika) |
| Moratorium 3–12 months | 3 months (MFS/Aajeevika/UNY), 6 months (Term Loan), 12 months (Term Loan – plantation/construction) |
| Income ≤ ₹5 lakh | "annual family income … must not exceed ₹5.00 lakh" |
| 100+ Channel Partners (SCA/PSB/RRB/NBFC-MFI) | NSFDC publishes 8 partner categories (SCA, PSB, RRB, NBFC-MFI, Co-op Bank, Co-op Society, SFB, Others/SIDBI) |

**Important structural insight (affects the calculator):** NSFDC does **not** give loans directly. It lends to Channel Partners (SCAs/CAs) at a low rate (2.5%–5%), and the Channel Partner on-lends to the beneficiary at the higher rate (6.5%–15%). So the "interest rate" the citizen sees is the **beneficiary rate**, and the "subsidy" is effectively the **interest-rate spread retained by the Channel Partner** — not a capital subsidy. The PS's "up to 90% of project cost" is the **loan-to-cost cap**, the citizen funds the remaining ≥10%.

Source: <https://nsfdc.nic.in/scheme>

---

## 2. Confirmed scheme slabs (these drive the recommender + EMI engine)

All figures verbatim from <https://nsfdc.nic.in/scheme>. Beneficiary = the SC citizen.

| # | Scheme | Project cost band | Max loan | Beneficiary rate | NSFDC→CA rate | Moratorium | Repayment |
|---|---|---|---|---|---|---|---|
| 1 | **Micro Finance Scheme (MFS)** | ≤ ₹1.40 L | 90% of cost, max **₹1.25 L** | **6.5%** | 2.5% | 3 months | Quarterly, ≤ 3 years |
| 2 | **Term Loan** | > ₹1.40 L to ₹50 L | 90% of cost, > ₹1.25 L to **₹45 L** | **8.0%** | 4% | 6 months (12 for plantation/construction) | Quarterly, ≤ 7 years |
| 3 | **Aajeevika Micro-Finance Yojana** | ≤ ₹1.40 L (via NBFC-MFIs) | 90%, max ₹1.25 L | **15.0%** | 5% | 3 months | Quarterly, ≤ 3 years |
| 4 | **Udyam Nidhi Yojana (UNY)** | ≤ ₹5.00 L | 90%, max **₹4.50 L** | **13%** (Co-op Bank/Society) / **15%** (SFB) | 5% | 3 months | Quarterly/half-yearly, ≤ 5 years |
| 5 | **Educational Loan Scheme (ELS)** | ≤ ₹40 L or 90% of course fee (whichever less) | **₹40 L** | **6.5%** | 2.5% | Course period + 1 yr (or ≤ 6 months if repayment started) | ≤ 12 yrs (not started) / ≤ 10 yrs (started) |

**Eligibility (verbatim, <https://nsfdc.nic.in/eligibility-requirements>):**
- Must belong to **Scheduled Caste** community.
- Eligible entities: Individuals, Partnership Firms, Co-operative Societies (all members SC).
- **Annual family income ≤ ₹5.00 lakh** (rural + urban, effective 7 Jan 2026).
- Skill Development Training Programmes: **no income criterion**.
- Applications are routed **only** through SCAs/CAs. NSFDC does not entertain direct applicant contact. Eligibility verification is the **SCA's** responsibility.

**Application channels (<https://nsfdc.nic.in/how-to-apply-2>):**
- **Online:** PM-SURAJ portal — mobile OTP registration, standardised form, document upload, Application ID tracking.
- **Offline:** nearest SCA/CA district or head office — caste certificate, income proof, KYC.
- Portal: <https://pmsuraj.dosje.gov.in/>

### Recognised courses for ELS (for the education-status input)
24 categories incl. Engineering, Architecture, Medical, Biotechnology, Pharmacy, Dental, Physiotherapy, Pathology, Nursing, IT (BCA/MCA), Management (BBA/MBA), Hotel Management, Law, Education (B.Ed), Physiotherapy, Journalism, Geriatric Care, Midwifery, Lab Technician, CA, ICWA, CS, Actuarial Science, AMIE; plus M.Phil/PhD.

---

## 3. Channel Partners — official NSFDC lists

Source for all lists: <https://nsfdc.nic.in/our-channel-partners> (8 downloadable PDFs, downloaded and parsed).

### 3.1 State Channelising Agencies (SCAs) — 38 total
Every State/UT has a designated SC finance corporation. Sample (full list in `research/raw/scas.txt`):

| State | SCA | HQ |
|---|---|---|
| Uttar Pradesh | **UPSCFDC** – UP Scheduled Castes Finance & Dev. Corpn. Ltd. | Lucknow |
| Uttar Pradesh | UP Sahkari Gram Vikas Bank Ltd. | Lucknow |
| Maharashtra | **MPBCDC** – Mahatma Phule BCs Dev. Corpn.; **SLASDC** (Annabhau Sathe); **LIDCOM** (leather/charmakar) | Mumbai |
| Madhya Pradesh | **MPSCFDC** – MP State Coop. SC Finance & Dev. Corpn. | Bhopal |
| Bihar | **BSSCCDC** – Bihar State SCs Co-op Dev. Corpn. | Patna |
| Karnataka | **DBRADC** – Dr B. R. Ambedkar Development Corpn. Ltd. | Bengaluru |
| Rajasthan | **RSCDC** – Rajasthan SCs & STs Fin. & Dev. Co-op Corpn. | Jaipur |
| Tamil Nadu | **TAHDCO** – Tamil Nadu Adi Dravidar Housing & Dev. Corpn. | Chennai |
| Andhra Pradesh | **APSCCFC**; **APSFC** | Amaravati / Vijayawada |
| Gujarat | **GSCDC**; **DAAVN** (Dr. Ambedkar Antyodaya Vikas Nigam) | Gandhinagar |
| West Bengal | **WBSCSTOBCDFC** | Kolkata |
| Delhi | **DSFDC** | Rohini, Delhi |
| Kerala | **KSDC**; **KSWDC** (Kerala State Women's Dev. Corpn.) | Thrissur |
| Punjab | **PSCLDFC** | Chandigarh |
| Haryana | **HSCDC** | Chandigarh |

### 3.2 Public Sector Banks (PSBs) — 11
Indian Overseas Bank, Bank of Baroda, Canara Bank, Punjab National Bank, Punjab & Sind Bank, Union Bank of India, Indian Bank, Bank of Maharashtra, Bank of India, Central Bank of India, UCO Bank.

### 3.3 Regional Rural Banks (RRBs) — 26
Bihar Gramin Bank, Maharashtra Gramin Bank, Jharkhand Gramin Bank, Haryana Gramin Bank, Gujarat Gramin Bank, Telangana Grameena Bank, Rajasthan Gramin Bank, UP Gramin Bank, Kerala Grameena Bank, Uttarakhand Gramin Bank, Tripura Gramin Bank, Karnataka Grameena Bank, Assam Gramin Bank, AP Grameena Bank, Punjab Gramin Bank, Tamil Nadu Grama Bank, MP Gramin Bank, HP Gramin Bank, Puducherry Grama Bank, WB Gramin Bank, Chhattisgarh Gramin Bank, Manipur Rural Bank, Meghalaya Rural Bank, J&K Grameen Bank, Odisha Grameen Bank, Mizoram Rural Bank.

### 3.4 NBFC-MFIs — 7
Anik Financial Services, Grameen Development & Finance, ASA International Microfinance, Midland Microfin, Satin Creditcare Network, Pahal Financial Services, Vector Finance.

### 3.5 Other partner categories
- **Small Finance Banks (2):** AU Small Finance Bank, Ujjivan Small Finance Bank.
- **Co-operative Banks (2):** Shri Mahila Sewa Sahakari Bank (Ahmedabad), Konoklata Mahila Urban Coop Bank (Assam).
- **Co-operative Societies (2):** Streenidhi (Telangana), Streenidhi AP.
- **Other Agencies (3):** NEDFi (Assam), JHARCRAFT (Jharkhand), SIDBI (Lucknow).

**Total published channel partners ≈ 91 across 8 categories** (38+11+26+7+2+2+2+3). The PS's "100+" is consistent once district branches of SCAs are counted.

### 3.6 Adjacent corporations (same Channel Finance System pattern)
- **NBCFDC** — Backward Classes: <https://nbcfdc.gov.in/nbcfdc/web/> (loan flyer: `/loan-flyer`)
- **NSKFDC** — Safai Karamcharis / manual scavengers: <https://nskfdc.nic.in/> (loan schemes: `/en/content/schemes-programmes/loan-schemes`)
- **NHFDC** — Divyangjan (referenced in brief).
All three share the same eligibility/EMI logic pattern, which is why the engine can be reused for them (Slide 5 scalability claim).

---

## 4. Official govt documentation style (what the real forms/flows look like)

- **Application form** captures: caste certificate, income proof (family income), KYC, project/unit details, cost estimate, activity type, training status.
- **Disbursement flow:** Applicant → SCA/CA branch → eligibility & income verification → sanction → NSFDC refinance → disbursement to beneficiary (often in tranches).
- **NPA / fund-utilization relevance:** NSFDC allocates funds to SCAs on a **"Guideline for Allocation of Funds"** basis (<https://nsfdc.nic.in/allocation-of-funds>), and tracks SCA performance. Partners with high overdue/NPA lose priority for fresh allocation — this is the basis for the **partner "fund-utilization health" filter**. **[TO-VALIDATE]** the precise allocation formula is in the linked policy doc; not fetched in detail.
- **RBI Priority Sector Lending:** these loans sit within PSL (weaker sections). Reference: RBI Master Directions on PSL — <https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12014> (URL live).
- **Strong tailwind:** NSFDC has an open GeM tender (2026) for an *"Integrated Data Repository and AI/ML Enabled Smart Data Analytical Dashboard cum Decision Support System"* (<https://nsfdc.nic.in/storage/uploads-file/media/GeM-Bidding-Dashboard.pdf>). This validates the AI/DSS direction and is a natural integration point for our solution.

---

## 5. UI/UX conventions to follow (source-attributed)

| # | Convention | Source observed |
|---|---|---|
| 1 | **Bilingual EN/HI toggle** as a persistent header control | myScheme, NSFDC, PM-SURAJ, india.gov.in |
| 2 | **Navy/blue + saffron/orange + white** palette, tricolor accents; emblem top-left (we use a **generic crest, not the protected State Emblem**) | india.gov.in, PM-SURAJ, myScheme |
| 3 | **Accessibility toolbar**: font-size +/-, high contrast, highlight links, invert, screen-reader link | NSFDC, GIGW reference site |
| 4 | **GIGW 3.0 + WCAG AA** compliance: semantic markup, accessible forms, alt text | <https://guidelines.india.gov.in/> |
| 5 | **Multi-step eligibility wizard → scheme cards** with match/eligibility tags | myScheme.gov.in pattern |
| 6 | **Trust indicators**: toll-free helpline, "content owned by Ministry" footer, last-updated date | NSFDC footer (Toll Free **1800110396**), PM-SURAJ |
| 7 | **Mobile-OTP login** for applicant flows | PM-SURAJ |
| 8 | **Persona-based entry points** (entrepreneur / student / media / researcher) | NSFDC "user personas" |
| 9 | **Digital India / MoSJE branding** in header/footer, "Powered by Digital India Corporation" | myScheme, PM-SURAJ |
| 10 | **Information architecture:** Home → Eligibility Check → Scheme List → Apply (PM-SURAJ) → Track Application → Partner Locator | composite of the above |

**Closest real analog:** **Jan Samarth Portal** (<https://www.jansamarth.in/>) — GoI's actual loan-scheme matching + partner routing portal. **Closest recommendation analog:** **myScheme** (<https://www.myscheme.gov.in/>). Both are JS-heavy SPAs; content could not be scraped, so only their visible structure/branding conventions were used. Neither does **partner health/NPA-aware routing** — that is our differentiator.

---

## 6. What past SIH winners did (patterns to replicate)

Derived from the official SIH idea-presentation format and publicly reported SIH 2023–2025 winners/format. Sources: <https://www.sih.gov.in/> and the official template <https://www.sih.gov.in/letters/SIH2025-IDEA-Presentation-Format.pptx> (downloaded & parsed).

Official SIH rules confirmed from the template:
- **Maximum 6 slides including title.**
- **Mandatory sections**: Title / Proposed Solution / Technical Approach / Feasibility & Viability / Impact & Benefits / Research & References.
- Must use the provided template; **no paragraphs — points / diagrams / infographics / pictures only**.
- Submit as **PDF**.

Winning-project patterns to replicate:
1. **A genuinely working engine, demoed live** — rule-based or ML, not a static mockup. (Official judging puts **Technical Approach** highest.)
2. **A real or realistic, clearly-labelled dataset** — synthetic data is acceptable if credible and labelled.
3. **A map/geo layer** — spatial routing consistently impresses and is explicitly requested here.
4. **Multilingual + low-bandwidth design** — reach for rural/low-income users.
5. **A crisp before/after impact metric** — quantified, not vague.
6. **Architecture depth over visual polish** — diagrams and data flow carry the score.

> **[TO-VALIDATE]** Specific named SIH 2023/24/25 software winners for financial-inclusion themes were not confirmed from primary sources. The patterns above are inferred from the official format + general reported practice. Do **not** cite named winners on Slide 6 unless independently verified.

---

## 7. Gaps in public data → proposed mock dataset (clearly labelled)

| Gap | Why it matters | Proposal |
|---|---|---|
| **No public per-partner fund-utilization / NPA / live fund-availability API** | Core of "avoid high-NPA/overdue partners" | **[MOCK]** synthetic `fundHealth` score (0–100), `npaBand` (Low/Med/High), `overduePct`, refreshed quarterly. Demo-labelled. |
| **No public lat/long per partner branch** | Needed to plot on Leaflet map | **[MOCK/DERIVED]** geocode partner HQ cities + add synthetic district branches; coords approximate city centroids. |
| **SCA list has addresses but not branch-level coverage** | "nearest eligible partner" | **[MOCK]** assign 2–4 synthetic district branches per major-state SCA. |
| **No capital "subsidy %" published** | PS mentions subsidy | Clarify: the model is an **interest-rate spread** (NSFDC rate vs beneficiary rate), not a capital subsidy. Show it as "effective concession vs. market rate". |
| **Partner × scheme eligibility matrix not published** | Routing must respect which schemes a partner handles | **[MOCK]** mapping: SCAs handle all 5; NBFC-MFIs → Aajeevika; SFBs/Co-op → UNY; PSBs/RRBs → Term + ELS + MFS. Labelled as illustrative. |
| **data.gov.in SC-welfare datasets** | Real beneficiary stats | **[TO-VALIDATE]** data.gov.in is live; specific SC-welfare datasets not enumerated. Reference the portal, not a specific dataset, unless verified. |

All mock data will ship behind a visible banner:
> *"Prototype for SIH — scheme data and partner data shown for demonstration; to be validated against live NSFDC/SCA data upon integration."*

---

## 8. Verified reference list (for Slide 6 — all URLs returned HTTP 200/302 on 2026-09-18)

1. NSFDC – Loan/Credit Schemes — <https://nsfdc.nic.in/scheme>
2. NSFDC – Eligibility Requirements — <https://nsfdc.nic.in/eligibility-requirements>
3. NSFDC – Channel Partners — <https://nsfdc.nic.in/our-channel-partners>
4. NSFDC – How to Apply — <https://nsfdc.nic.in/how-to-apply-2>
5. PM-SURAJ Portal (DoSJE) — <https://pmsuraj.dosje.gov.in/>
6. myScheme (MeitY / Digital India) — <https://www.myscheme.gov.in/>
7. Jan Samarth Portal — <https://www.jansamarth.in/>
8. GIGW 3.0 (Guidelines for Indian Government Websites) — <https://guidelines.india.gov.in/>
9. SIH Official — <https://www.sih.gov.in/>
10. SIH Idea Presentation Format (6-slide template) — <https://www.sih.gov.in/letters/SIH2025-IDEA-Presentation-Format.pptx>
11. Open Government Data Platform India — <https://data.gov.in/>
12. RBI Master Directions (Priority Sector Lending) — <https://www.rbi.org.in/Scripts/BS_ViewMasCirculardetails.aspx?id=12014>
13. NBCFDC — <https://nbcfdc.gov.in/nbcfdc/web/>
14. NSKFDC — <https://nskfdc.nic.in/>
15. NSFDC GeM tender: AI/ML Data Repository & DSS — <https://nsfdc.nic.in/storage/uploads-file/media/GeM-Bidding-Dashboard.pdf>
