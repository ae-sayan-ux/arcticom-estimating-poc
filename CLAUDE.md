# Arcticom Estimating Platform — Project Context

## What this is
A three-phase web-based estimating platform for The Arcticom Group, a commercial/industrial refrigeration and HVAC contractor operating across North America through multiple regional operating companies. This file transfers full design context from a Cowork session into Claude Code.

## The RFP in one paragraph
Arcticom currently uses 7 separate Excel estimating forms across operating companies. They want to digitize these into a unified web platform (Phase 1), centralize the data into an enterprise repository (Phase 2), and layer AI/ML bid intelligence on top (Phase 3). The RFP contact is Omar Rahman, VP of Pricing and RevOps (orahman@arcticomgroup.com). Proposal was due 3/27/2026.

---

## Key design decisions (do not relitigate these)

### The core tension we resolved
The form must feel like the Excel forms estimators already know — same section order, same line items, same column structure — but it is NOT a spreadsheet. No formula bar, no cell references, no =signs visible to the user. Totals calculate silently in the background. The estimator just types quantities.

Think: ProEst or Sage Estimating, not Excel in a browser, not Google Sheets.

### No setup screen
When an estimator clicks a form type on the dashboard, they land directly on the form with an empty project header — same as opening an Excel file. No modal, no wizard, no separate setup step. The project header (client, location, jurisdiction, construction type) IS the first section of the form.

### AI is a guest, not the host
AI signals appear inline — a small badge next to a flagged value, a nudge strip at the bottom — but never take over the form. Three AI touchpoints:
1. **Copper unit costs** — live commodity index, read-only, estimator can override
2. **Refrigerant waste %** — adjusted upward based on regulatory phase-down risk
3. **Labor productivity factor** — location + project type multiplier applied to gross hours

### Entry point
Dashboard → click form type card (one of 7) → blank form opens. This is "Start a new estimate." Separate section "Continue where you left off" shows recent drafts. These are two distinct sections on the dashboard, not mixed together.

### Tech stack
- **Framework**: React with shadcn/ui components
- **Design system**: shadcn — use Card, Table, TableRow, TableCell, Input, Select, Badge, Button, Separator, etc.
- **Styling**: Tailwind CSS (shadcn default)
- **Target**: Push to Figma canvas via Figma MCP plugin (already installed and authenticated)

---

## The 7 form types
| Code | Name | Complexity |
|------|------|-----------|
| CR-01 | Commercial Refrigeration Installation | Multi-tab |
| IR-02 | Industrial Refrigeration Systems | Complex assembly |
| HV-03 | HVAC Infrastructure | Multi-trade |
| SR-04 | System Retrofit & Replacement | Replacement scope |
| CS-05 | Cold Storage & Distribution | Distribution |
| ES-06 | Energy Services | Single-trade |
| SM-07 | Service & Maintenance | Simple inputs |

---

## Screens designed so far

### Screen 1 — Dashboard
**Status**: Designed, needs to be built as .jsx + pushed to Figma

Two clear sections:
- **"Start a new estimate"** — 7 form type cards in a grid. CR-01 card has a green border highlight. Each card shows: icon, form name, form code + complexity label.
- **"Continue where you left off"** — list of recent estimates with: type badge (colored 2-letter code), project name, form type, time since update, dollar value, status pill (Draft / In review / Submitted / Won).

Also includes:
- Left sidebar: logo, company switcher (multi-operating-company), nav items (Dashboard, My estimates, Data repository, AI insights, Reports, Users & roles, Settings), user chip at bottom
- Top bar: page title, search, notification bell (with dot), user icon
- KPI strip: Active bids, Pipeline value, Win rate (90d), Avg margin

Color language: teal/green (#1D9E75) for primary actions and active states. Purple (#534AB7) for AI elements. Amber for warnings. Red for risk flags.

### Screen 2 — CR-01 Form First Screen
**Status**: Designed, needs to be built as .jsx + pushed to Figma

Layout: two-column — form on the left (fills ~75% width), live summary panel on the right (~25%).

**Top chrome:**
- Breadcrumb: ← Dashboard / New estimate / Commercial Refrigeration Installation — CR-01
- Status pill: Draft
- Buttons: Save draft, Print, Submit for review

**Tabs (below top bar, above form):**
- Estimate (CR-01) [active], Equipment schedule, Labor breakdown, Bid summary

**Form left column:**

*Project information section* (first thing estimator sees, fields are empty on first open):
- Project name* | Client
- Site address* | Operating company (auto-filled, read-only)
- Estimator (auto-filled) | Bid due date
- Labor jurisdiction* (select → triggers silent AI load of prevailing wage) | Construction type (select → triggers productivity factor)
- AI confirmations appear below dropdowns as small tags once loaded

*Section 1 — Materials (table structure):*
Columns: Description | Unit | Qty | Unit cost | Waste | Total

Sub-groups within materials:
- Copper piping & fittings (line items: pipe sizes, fittings allowance)
- Refrigerant (R-404A with phase-down risk flag)
- [Section 2 — Equipment & racks] dimmed until Section 1 complete
- [Section 3 — Labor] dimmed, shows "Rates loaded once jurisdiction selected"

AI-sourced unit costs shown in purple with small "AI" label. Estimator can override.
+ Add line row at bottom of each sub-group.

**Right panel (always visible):**
- Estimate total (shows $— until data exists, fills progressively)
- Cost breakdown by bucket (Materials, Equipment, Labor, Subs, Overhead, Margin)
- AI context block: loads similar jobs + risk signals once address/jurisdiction entered

---

## What still needs to be built

1. **Three form variation mockups** — different visual approaches to the form body that all preserve the spreadsheet-like-but-not-a-spreadsheet feel. Discussed but not yet designed:
   - **Variation A**: Structured table, stripped of all spreadsheet mechanics (refinement of current)
   - **Variation B**: Section cards with inline tabular rows (more visual separation)
   - **Variation C**: Dense grouped list (maximum Excel visual similarity, minimum mechanics)

2. **Bid summary screen** (Step 6 / final tab) — AI bid intelligence, win probability, scenario modeling

3. **All screens as .jsx files** using shadcn/ui components

4. **Figma push** — all screens onto Figma canvas as editable frames via MCP plugin

---

## What NOT to do
- Do not add a formula bar or cell reference indicators
- Do not show formula strings in cells (=D8*E8 etc.)
- Do not add row numbers down the left side (this was built earlier and walked back)
- Do not use the frontend-design skill — it pushes toward bold consumer aesthetics, wrong for a B2B estimation tool
- Do not introduce a setup modal or wizard before the form — estimators land directly on the form
- Do not mix "Start new" and "Continue" estimates in the same list — they are separate labeled sections

---

## Figma setup
- Figma MCP plugin: installed and authenticated
- Use write-to-canvas to create frames
- Target: shadcn component library as the design system base
- All screens should be created as separate frames, clearly labeled
