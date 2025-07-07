# SothebysRealty.fi Rebuild – Technical Documentation

**Version:** 2025‑07‑07   **Author:** Dev Team

---

## 1. Cursor‑regler (arbetsflöde & kodstandard)

| Nr       | Regel                                | Praktisk tillämpning                                                                                                                                   |
| -------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **C‑1**  | **Branch‑struktur**                  | `main` ← production, **skyddad**; `develop` ← staging; `feature/<kort-beskrivning>` för allt nytt; `hotfix/<issue>` vid akuta buggar.                  |
| **C‑2**  | **Konventionella commits**           | Följ *Conventional Commits*: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:` … Cursor genererar förslag, men utvecklare ansvarar för korrekt semantik. |
| **C‑3**  | **Pull requests & kodgranskning**    | Minst **1 godkännande** innan merge. Cursor‑AI kan föreslå patchar, men människa reviewers ansvarar för kvalitet & säkerhet.                           |
| **C‑4**  | **AI‑prompter**                      | ① *Explain file* innan större ändring; ② *Generate tests* direkt efter ny util; ③ *Bulk‑refactor* endast på feature‑branch och bakom PR.               |
| **C‑5**  | **Formattering & lint**              | Kör `pnpm lint:fix` lokalt eller via Cursor *Run Command*. ESLint + Prettier är “fail CI if dirty”.                                                    |
| **C‑6**  | **Secrets‑hantering**                | Aldrig i kod eller Cursor‑prompter. Använd GitHub Secrets + Vercel env.                                                                                |
| **C‑7**  | **Test‑driven refaktor (TCR light)** | Cursor‑förslagna refaktorer merges **endast** om Jest + Playwright pipelines passerar.                                                                 |
| **C‑8**  | **Pair‑programming**                 | Vid komplex logik (Linear sync) kör “Live Share” i Cursor; AI får hela kontexten men reviewer är med.                                                  |
| **C‑9**  | **Devcontainer**                     | All utveckling sker i `.devcontainer`; Cursor’s Docker gör AI‑index stabilt och identiskt mellan team‑medlemmar.                                       |
| **C‑10** | **CI/CD‑koppling**                   | Cursor pushes triggar GitHub Actions: ① type‑check, ② lint, ③ test, ④ Vercel Preview. Misslyckas något → ingen auto‑deploy.                            |

---

## 2. Teknisk PRD (Product Requirements Document)

### 2.1 Problem & mål

* Nuvarande WordPress‑lösning är långsam (>4 s LCP) och svår att underhålla.
* Kund vill byta till Linear som data‑källa och ge mäklare ett enkelt CMS‑gränssnitt.
* **Mål:** <1,8 s LCP mobil, Core Web Vitals >90, noll hårdkod för redaktörer.

### 2.2 Målgrupper

* **Mäklare (admin/editor)** – ordnar listor, byter texter/färger, skapar sidor.
* **Slutkund (köpare)** – söker objekt, bläddrar snabbt mellan bilder.

### 2.3 Success metrics

| KPI                      | Target             |
| ------------------------ | ------------------ |
| Largest Contentful Paint | ≤ 1,8 s (Mobil 4G) |
| Core Web Vitals Score    | ≥ 90/100           |
| CMS‑ändring → live       | ≤ 60 s             |
| Syncfel Linear → site    | < 0,1 % av anrop   |

### 2.4 Scope

| Ingår                            | Ingår ej                     |
| -------------------------------- | ---------------------------- |
| Listing‑grid, detail, sök+filter | Klassificerad annons‑modul   |
| Sanity Studio v3 (headless)      | WordPress‑kompat. teman      |
| Drag‑&‑släpp featured list       | Bokning/kalender‑integration |

### 2.5 Funktionskrav (FR)

| ID       | Beskrivning                                                                            | Prioritet |
| -------- | -------------------------------------------------------------------------------------- | --------- |
| **FR‑1** | Systemet ska hämta objektdata via Linear GraphQL API var 5\:e minut eller via webhook. | P0        |
| **FR‑2** | Mäklare ska kunna ordna “Featured Listings” med drag‑&‑släpp i CMS.                    | P0        |
| **FR‑3** | CMS ska erbjuda color‑pickers för primär/sekundär/fond/text‑färg.                      | P1        |
| **FR‑4** | Redaktör ska kunna skapa sidor med block‑baserad builder.                              | P0        |
| **FR‑5** | Besökare ska kunna filtrera objekt på prisintervall, ort och typ.                      | P0        |
| **FR‑6** | Sidan ska generera JSON‑LD (`Residence`, `Offer`, `RealEstateAgent`).                  | P1        |

### 2.6 Icke‑funktionella krav (NFR)

| ID        | Beskrivning                                                      |
| --------- | ---------------------------------------------------------------- |
| **NFR‑1** | Prestanda: TTFB ≤ 150 ms med Vercel Edge.                        |
| **NFR‑2** | Tillgänglighet (WCAG 2.2 AA).                                    |
| **NFR‑3** | Infrastruktur ska kosta < €60/mån i drift.                       |
| **NFR‑4** | 99,9 % upp­tider (över 30 d rullande).                           |
| **NFR‑5** | GDPR: inga personuppgifter lagras utanför EU (Sanity EU‑region). |

### 2.7 Systemarkitektur (hög nivå)

```
Linear API  ──▶  Edge Sync Fn (Node/TS) ──▶  Redis (Upstash)
        ▲                              │
        │ Webhook   (Change ID)        │
        ▼                              ▼
   Next.js 14 (ISR) ──── Sanity Studio (CMS)
```

### 2.8 Risker & mitigation

| Risk                           | Mitigation                                                 |
| ------------------------------ | ---------------------------------------------------------- |
| Linear rate limit              | Redis‑cache fallback, exponential back‑off.                |
| Redaktör publicerar “fel” färg | Version‑historik + preset‑palett.                          |
| DNS‑switch misslyckas          | Blue‑green subdomän `new.` + ompekning efter verifikation. |

### 2.9 Acceptanskriterier

* Alla FR / NFR uppfyllda i staging.
* Lighthouse mobil ≥ 90.
* Sanity Studio‑workshop godkänd av minst två mäklare.

---

## 3. Teknisk detaljerad implementeringsplan

### 3.1 Repo & dev‑miljö (mån fm)

* `pnpm init`, workspaces: `apps/web` (Next 14), `apps/studio` (Sanity v3), `packages/linear-client`.
* `.devcontainer` Node 20 + pnpm.
* Cursor AI‑index init (`⌘⇧P → Cursor: Init Index`).

### 3.2 Linear integration (mån em)

1. Installera `@linear/sdk` i `packages/linear-client`.
2. Funktion `fetchListings(first=50)` → DTO ⟶ Redis (Upstash REST API). TTL 300 s.
3. API‑route `/api/listings` i Next: läser cache, annars Linear.
4. Webhook `/api/linear-webhook` verifierar signatur → `revalidateTag(listing‑<id>)`.

### 3.3 CMS‑setup (tis fm)

* `npx sanity@latest init` – dataset “prod”, region “eu”.
* Skapa scheman:

  * `listingOverride` (orderable array)
  * `page` (slug, content\[])
  * `globalSettings` (colors)
* Plugin: `@sanity/orderable-document-list` för `listingOverride`.
* Custom action `linearSyncAction` (🔄) för manuell sync.

### 3.4 Frontend sidor (tis em – ons)

| Route            | Beskrivning                                   | Teknik                                   |
| ---------------- | --------------------------------------------- | ---------------------------------------- |
| `/`              | Startsida med `FeaturedSlider`, `listingGrid` | `generateStaticParams`, ISR 900 s        |
| `/objekt/[slug]` | Objekt‑detalj + galleri                       | Dynamic ISR 900 s; `next/image` + Swiper |
| `/sok`           | Sök + filter                                  | Server actions; URL‑synkad state         |
| `[[...slug]]`    | CMS‑sidor                                     | Dynamic ISR by slug                      |

### 3.5 SEO & a11y (tor fm)

* `generateMetadata` per route (title, description, og\:image).
* JSON‑LD: `@type: Residence` på details, `RealEstateAgent` global.
* Axe‑CLI fixar kontrast & landmarks.

### 3.6 Prestanda & test (tor em)

* Lighthouse‑CI script (`pnpm lhci autorun`).
* Playwright smoke‑test (list → detail → mailto). Autogenerera med Cursor prompt.
* Tune images: AVIF/WebP, sizes prop.

### 3.7 Deployment & cutover (fre)

1. Merge `develop` → `main`; Vercel prod‑build.
2. Verifiera preview (`https://sothebys-fi.vercel.app`).
3. Cloudflare: uppdatera A‑record till Vercel (blue‑green subdomän fallback).
4. Sanity webhook set to prod URL.

### 3.8 Post‑launch

* Sentry (prod DSN) + Slack alert.
* Vercel Analytics widget (Core Web Vitals dashboard).
* Hypercare 48 h: on‑call rota i Slack #hypercare.

---

### 4. Bilagor

* **A. Env‑variabler** (`.env.example`)

```
LINEAR_API_KEY=
LINEAR_WEBHOOK_SECRET=
SANITY_DATASET=prod
SANITY_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SITE_URL=https://sothebysrealty.fi
```

* **B. Redirect CSV‑exempel** (`from,to,status`)
* **C. Playwright testplan**

---

> **Status:** Dokument utkast klart 2025‑07‑07 kl XX\:XX.
> **Nästa steg:** Review av tech‑lead & godkännande av kund.
