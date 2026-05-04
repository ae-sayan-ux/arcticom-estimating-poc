/**
 * Realistic static mock content for Equipment schedule & Labor breakdown (CR-01).
 * Local state so inputs feel editable without wiring to estimate totals.
 */

import { useMemo, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sparkles, Plus, ChevronDown, ChevronRight } from "lucide-react"

const EQUIP_GROUPS = [
  {
    key: "compressors",
    title: "Compressors & condensing",
    rows: [
      { id: 1, tag: "C-01", description: "Semi-hermetic compressor rack — 4 × 25 HP", model: "Vilter VSR 100", qty: "1", unit: "LS", unitPrice: "186400", lead: "18 wks" },
      { id: 2, tag: "C-02", description: "Air-cooled condenser — 95 TR", model: "Evapco LRC-A-095", qty: "2", unit: "EA", unitPrice: "42800", lead: "12 wks" },
      { id: 3, tag: "C-03", description: "Receiver & high-pressure controls package", model: "OEM bundle", qty: "1", unit: "LS", unitPrice: "14200", lead: "8 wks" },
    ],
  },
  {
    key: "evaps",
    title: "Evaporators, cases & distribution",
    rows: [
      { id: 4, tag: "E-01", description: "Low-temp walk-in evaporator — dual fan", model: "Heatcraft Bohn BLQ", qty: "6", unit: "EA", unitPrice: "6840", lead: "6 wks" },
      { id: 5, tag: "E-02", description: "Medium-temp display line — 120 LF", model: "Hussmann R2", qty: "1", unit: "LF", unitPrice: "890", lead: "14 wks" },
      { id: 6, tag: "E-03", description: "Hot gas defrost valve station (per circuit)", model: "Sporlan MKC-2", qty: "8", unit: "EA", unitPrice: "1120", lead: "4 wks" },
    ],
  },
]

const LABOR_ROWS_INITIAL = [
  { id: 1, trade: "Pipefitter — Refrigeration (journeyman)", classCode: "UA-502", crew: "3", grossHrs: "1240", factor: "0.92", rate: "68.40", aiRate: true },
  { id: 2, trade: "Refrigeration mechanic", classCode: "SM-110", crew: "2", grossHrs: "880", factor: "0.92", rate: "62.10", aiRate: true },
  { id: 3, trade: "Electrician (journeyman)", classCode: "IBEW-01", crew: "1", grossHrs: "320", factor: "1.00", rate: "71.25", aiRate: true },
  { id: 4, trade: "General foreman / superintendent", classCode: "GF-01", crew: "1", grossHrs: "480", factor: "1.00", rate: "84.00", aiRate: false },
  { id: 5, trade: "Apprentice / helper (mixed)", classCode: "AP-20", crew: "2", grossHrs: "640", factor: "0.95", rate: "38.50", aiRate: false },
]

function parseNum(s) {
  const n = parseFloat(String(s).replace(/,/g, ""))
  return Number.isFinite(n) ? n : 0
}

function fmtMoney(n) {
  if (!n) return "—"
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function extEquipment(qty, unit, unitPrice) {
  const q = parseNum(qty)
  const p = parseNum(unitPrice)
  if (unit === "LS") return p * Math.max(q, 1)
  return q * p
}

function extLabor(crew, gross, factor, rate) {
  return parseNum(crew) * parseNum(gross) * parseNum(factor) * parseNum(rate)
}

function cloneEquipment() {
  return EQUIP_GROUPS.map((g) => ({
    ...g,
    rows: g.rows.map((r) => ({ ...r })),
  }))
}

/** Match Section 1 materials: borderless inputs, row hover, focus ring (FormVariation B SectionCard). */
const IN_CELL =
  "h-7 text-xs border-transparent bg-transparent group-hover:bg-white hover:border-slate-200 focus:border-[#1D9E75] px-2"
const IN_CELL_CENTER = `${IN_CELL} text-center`
const IN_CELL_RIGHT = `${IN_CELL} text-right tabular-nums`
const IN_CELL_MONO = `${IN_CELL} font-mono text-[11px]`

/** Variation B: one spreadsheet row per line — Tag | Description | Model | Qty | Unit | Unit price | Extended | Lead */
const GRID_B_EQUIP =
  "grid grid-cols-[56px_minmax(0,1.8fr)_minmax(0,1.15fr)_52px_44px_88px_88px_72px] gap-0"

/** Variation B labor: Trade | Class | Crew | Gross hrs | Factor | Net hrs | $/hr | Extended */
const GRID_B_LABOR =
  "grid grid-cols-[minmax(0,2fr)_64px_48px_56px_48px_56px_72px_88px] gap-0"

/** --- Variation A: structured tables (match Section 1 materials) --- */

function EquipmentTableA({ groups, onChange }) {
  return (
    <div className="space-y-6 w-full">
      {groups.map((g) => (
        <section key={g.key}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{g.title}</h3>
            <Badge variant="outline" className="text-[10px] font-normal border-slate-200 text-slate-500">
              Long-lead flagged in bid summary when &gt; 12 wks
            </Badge>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Tag", "Description", "Model", "Qty", "Unit", "Unit price", "Extended", "Lead time"].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "text-left text-[11px] font-medium text-slate-500 px-3 py-2",
                      ["Qty", "Unit price", "Extended", "Lead time"].includes(h) && "text-right"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {g.rows.map((row, i) => {
                const ext = extEquipment(row.qty, row.unit, row.unitPrice)
                return (
                  <tr key={row.id} className={cn("group border-b border-slate-100 hover:bg-blue-50/30 transition-colors", i % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                    <td className="px-2 py-1.5 w-[7%]">
                      <Input value={row.tag} onChange={(e) => onChange(g.key, row.id, "tag", e.target.value)} className={`${IN_CELL_MONO} w-full`} />
                    </td>
                    <td className="px-2 py-1.5 w-[28%]">
                      <Input value={row.description} onChange={(e) => onChange(g.key, row.id, "description", e.target.value)} className={`${IN_CELL} w-full`} />
                    </td>
                    <td className="px-2 py-1.5 w-[20%]">
                      <Input value={row.model} onChange={(e) => onChange(g.key, row.id, "model", e.target.value)} className={`${IN_CELL} w-full text-slate-600`} />
                    </td>
                    <td className="px-2 py-1.5 w-[8%]">
                      <Input value={row.qty} onChange={(e) => onChange(g.key, row.id, "qty", e.target.value)} className={`${IN_CELL_RIGHT} w-full`} />
                    </td>
                    <td className="px-2 py-1.5 w-[7%]">
                      <Input value={row.unit} onChange={(e) => onChange(g.key, row.id, "unit", e.target.value)} className={`${IN_CELL_CENTER} w-full`} />
                    </td>
                    <td className="px-2 py-1.5 w-[12%]">
                      <Input value={row.unitPrice} onChange={(e) => onChange(g.key, row.id, "unitPrice", e.target.value)} className={`${IN_CELL_RIGHT} w-full`} />
                    </td>
                    <td className="px-3 py-1.5 text-right text-xs font-medium text-slate-700 tabular-nums w-[12%]">{fmtMoney(ext)}</td>
                    <td className="px-2 py-1.5 w-[10%]">
                      <Input value={row.lead} onChange={(e) => onChange(g.key, row.id, "lead", e.target.value)} className={`${IN_CELL} w-full`} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button type="button" className="mt-1.5 flex items-center gap-1.5 text-xs text-[#1D9E75] hover:text-[#178a65] px-3 py-1.5 rounded hover:bg-[#1D9E75]/5">
            <Plus className="w-3.5 h-3.5" />
            Add line
          </button>
        </section>
      ))}
    </div>
  )
}

function LaborTableA({ rows, onChange }) {
  const total = useMemo(
    () => rows.reduce((s, r) => s + extLabor(r.crew, r.grossHrs, r.factor, r.rate), 0),
    [rows]
  )

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
        <Sparkles className="w-3.5 h-3.5 text-[#534AB7]" />
        <span>
          Productivity factor follows <strong className="font-medium text-slate-700">Construction type</strong> on the Estimate tab. Rates reflect{" "}
          <strong className="font-medium text-slate-700">Labor jurisdiction</strong> when selected.
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {["Trade / role", "Class", "Crew", "Gross hrs", "Factor", "Net hrs", "$/hr", "Extended"].map((h) => (
              <th key={h} className={cn("text-left text-[11px] font-medium text-slate-500 px-3 py-2", ["Crew", "Gross hrs", "Factor", "Net hrs", "$/hr", "Extended"].includes(h) && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const net = parseNum(row.crew) * parseNum(row.grossHrs) * parseNum(row.factor)
            const ext = extLabor(row.crew, row.grossHrs, row.factor, row.rate)
            return (
              <tr key={row.id} className={cn("group border-b border-slate-100", i % 2 === 0 ? "bg-white" : "bg-slate-50/40")}>
                <td className="px-2 py-1.5 w-[30%]">
                  <Input value={row.trade} onChange={(e) => onChange(row.id, "trade", e.target.value)} className={`${IN_CELL} w-full`} />
                </td>
                <td className="px-2 py-1.5 w-[12%]">
                  <Input value={row.classCode} onChange={(e) => onChange(row.id, "classCode", e.target.value)} className={`${IN_CELL_MONO} w-full`} />
                </td>
                <td className="px-2 py-1.5 w-[8%]">
                  <Input value={row.crew} onChange={(e) => onChange(row.id, "crew", e.target.value)} className={`${IN_CELL_RIGHT} w-full`} />
                </td>
                <td className="px-2 py-1.5 w-[10%]">
                  <Input value={row.grossHrs} onChange={(e) => onChange(row.id, "grossHrs", e.target.value)} className={`${IN_CELL_RIGHT} w-full`} />
                </td>
                <td className="px-2 py-1.5 w-[8%]">
                  <Input value={row.factor} onChange={(e) => onChange(row.id, "factor", e.target.value)} className={`${IN_CELL_RIGHT} w-full`} />
                </td>
                <td className="px-3 py-1.5 text-right text-xs font-medium text-slate-600 tabular-nums w-[10%]">{net ? net.toFixed(0) : "—"}</td>
                <td className="px-2 py-1.5 w-[10%]">
                  <div className="relative">
                    <Input
                      value={row.rate}
                      onChange={(e) => onChange(row.id, "rate", e.target.value)}
                      className={cn(`${IN_CELL_RIGHT} w-full pr-6`, row.aiRate && "text-[#534AB7]")}
                    />
                    {row.aiRate && (
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-bold text-[#534AB7] bg-[#534AB7]/10 px-0.5 rounded">AI</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-1.5 text-right text-xs font-semibold text-slate-800 tabular-nums w-[12%]">{fmtMoney(ext)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex justify-end border-t border-slate-200 pt-3">
        <div className="text-right">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide">Labor subtotal (direct)</p>
          <p className="text-lg font-bold text-slate-800 tabular-nums">{fmtMoney(total)}</p>
        </div>
      </div>
      <button type="button" className="flex items-center gap-1.5 text-xs text-[#1D9E75] hover:text-[#178a65] px-3 py-1.5 rounded hover:bg-[#1D9E75]/5">
        <Plus className="w-3.5 h-3.5" />
        Add trade line
      </button>
    </div>
  )
}

/** --- Variation B: cards per group --- */

function EquipmentCardsB({ groups, onChange }) {
  const headers = ["Tag", "Description", "Model", "Qty", "Unit", "Unit cost", "Total", "Lead time"]
  return (
    <div className="space-y-4 w-full">
      {groups.map((g) => (
        <Card key={g.key} className="border-slate-200 shadow-sm">
          <CardHeader className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
            <CardTitle className="text-xs font-semibold text-slate-700">{g.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className={cn(GRID_B_EQUIP, "border-b border-slate-100 bg-white")}>
              {headers.map((h) => (
                <div
                  key={h}
                  className={cn(
                    "text-[11px] font-medium text-slate-400 px-3 py-2",
                    ["Qty", "Unit cost", "Total", "Lead time"].includes(h) && "text-right"
                  )}
                >
                  {h}
                </div>
              ))}
            </div>
            {g.rows.map((row, i) => {
              const ext = extEquipment(row.qty, row.unit, row.unitPrice)
              return (
                <div
                  key={row.id}
                  className={cn(
                    GRID_B_EQUIP,
                    "border-b border-slate-50 hover:bg-[#1D9E75]/4 transition-colors group",
                    i % 2 === 1 && "bg-slate-50/30"
                  )}
                >
                  <div className="px-2 py-1.5">
                    <Input value={row.tag} onChange={(e) => onChange(g.key, row.id, "tag", e.target.value)} className={IN_CELL_MONO} />
                  </div>
                  <div className="px-2 py-1.5 min-w-0">
                    <Input value={row.description} onChange={(e) => onChange(g.key, row.id, "description", e.target.value)} className={IN_CELL} />
                  </div>
                  <div className="px-2 py-1.5 min-w-0">
                    <Input value={row.model} onChange={(e) => onChange(g.key, row.id, "model", e.target.value)} className={cn(IN_CELL, "text-slate-600")} />
                  </div>
                  <div className="px-2 py-1.5">
                    <Input value={row.qty} onChange={(e) => onChange(g.key, row.id, "qty", e.target.value)} className={IN_CELL_RIGHT} placeholder="0" />
                  </div>
                  <div className="px-2 py-1.5">
                    <Input value={row.unit} onChange={(e) => onChange(g.key, row.id, "unit", e.target.value)} className={IN_CELL_CENTER} />
                  </div>
                  <div className="px-2 py-1.5">
                    <Input value={row.unitPrice} onChange={(e) => onChange(g.key, row.id, "unitPrice", e.target.value)} className={IN_CELL_RIGHT} />
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-end">
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">{fmtMoney(ext)}</span>
                  </div>
                  <div className="px-2 py-1.5">
                    <Input value={row.lead} onChange={(e) => onChange(g.key, row.id, "lead", e.target.value)} className={IN_CELL} />
                  </div>
                </div>
              )
            })}
          </CardContent>
          <CardFooter className="py-2 px-4 border-t border-slate-100 bg-white rounded-b-lg">
            <button type="button" className="flex items-center gap-1.5 text-xs text-[#1D9E75] hover:text-[#178a65] py-1 px-2 rounded hover:bg-[#1D9E75]/5 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add line
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function LaborCardsB({ rows, onChange }) {
  const total = useMemo(() => rows.reduce((s, r) => s + extLabor(r.crew, r.grossHrs, r.factor, r.rate), 0), [rows])
  return (
    <div className="space-y-4 w-full">
      <Card className="border-[#534AB7]/20 bg-[#534AB7]/5">
        <CardContent className="p-4 flex gap-2 text-xs text-[#534AB7]">
          <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Gross hours from takeoff; net hours = gross × crew × productivity factor. AI-sourced rates follow jurisdiction from the Estimate tab.</p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <CardTitle className="text-xs font-semibold text-slate-700">Direct field labor</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className={cn(GRID_B_LABOR, "border-b border-slate-100 bg-white")}>
            {["Trade / role", "Class", "Crew", "Gross hrs", "Factor", "Net hrs", "$/hr", "Total"].map((h) => (
              <div
                key={h}
                className={cn(
                  "text-[11px] font-medium text-slate-400 px-3 py-2",
                  ["Crew", "Gross hrs", "Factor", "Net hrs", "$/hr", "Total"].includes(h) && "text-right"
                )}
              >
                {h}
              </div>
            ))}
          </div>
          {rows.map((row, i) => {
            const ext = extLabor(row.crew, row.grossHrs, row.factor, row.rate)
            const net = parseNum(row.crew) * parseNum(row.grossHrs) * parseNum(row.factor)
            return (
              <div
                key={row.id}
                className={cn(
                  GRID_B_LABOR,
                  "border-b border-slate-50 hover:bg-[#1D9E75]/4 transition-colors group items-center px-0",
                  i % 2 === 1 && "bg-slate-50/30"
                )}
              >
                <div className="px-2 py-1.5 min-w-0">
                  <Input value={row.trade} onChange={(e) => onChange(row.id, "trade", e.target.value)} className={IN_CELL} />
                </div>
                <div className="px-2 py-1.5">
                  <Input value={row.classCode} onChange={(e) => onChange(row.id, "classCode", e.target.value)} className={IN_CELL_MONO} />
                </div>
                <div className="px-2 py-1.5">
                  <Input value={row.crew} onChange={(e) => onChange(row.id, "crew", e.target.value)} className={IN_CELL_RIGHT} />
                </div>
                <div className="px-2 py-1.5">
                  <Input value={row.grossHrs} onChange={(e) => onChange(row.id, "grossHrs", e.target.value)} className={IN_CELL_RIGHT} />
                </div>
                <div className="px-2 py-1.5">
                  <Input value={row.factor} onChange={(e) => onChange(row.id, "factor", e.target.value)} className={IN_CELL_RIGHT} />
                </div>
                <div className="px-3 py-1.5 text-right text-xs font-medium text-slate-600 tabular-nums">{net ? net.toFixed(0) : "—"}</div>
                <div className="px-2 py-1.5 relative">
                  <Input value={row.rate} onChange={(e) => onChange(row.id, "rate", e.target.value)} className={cn(IN_CELL_RIGHT, "pr-6", row.aiRate && "text-[#534AB7]")} />
                  {row.aiRate && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#534AB7] bg-[#534AB7]/10 px-1 rounded leading-none py-0.5">
                      AI
                    </span>
                  )}
                </div>
                <div className="px-3 py-1.5 flex justify-end">
                  <span className="text-xs font-semibold text-slate-700 tabular-nums">{fmtMoney(ext)}</span>
                </div>
              </div>
            )
          })}
        </CardContent>
        <CardFooter className="flex justify-between items-center py-3 px-4 border-t bg-slate-50/50">
          <button type="button" className="text-xs text-[#1D9E75] flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add trade
          </button>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">Subtotal</p>
            <p className="text-base font-bold text-slate-800 tabular-nums">{fmtMoney(total)}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

/** --- Variation C: dense grouped rows --- */

const COLS_EQ = "grid-cols-[52px_minmax(0,1.6fr)_minmax(0,1fr)_44px_40px_72px_80px_72px]"
const COLS_LB = "grid-cols-[minmax(0,2fr)_56px_40px_48px_40px_52px_56px_72px_80px]"

function GroupHeadC({ label, collapsed, onToggle, accent }) {
  return (
    <div className={cn(COLS_EQ, "grid border-l-4 bg-slate-100 cursor-pointer items-center", accent)} onClick={onToggle}>
      <div className="col-span-8 flex items-center gap-1 px-2 py-1">
        {collapsed ? <ChevronRight className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
        <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">{label}</span>
      </div>
    </div>
  )
}

function EquipmentDenseC({ groups, onChange }) {
  const [open, setOpen] = useState(() => Object.fromEntries(groups.map((g) => [g.key, true])))
  return (
    <div className="border border-slate-200 rounded-sm overflow-hidden w-full">
      <div className={`${COLS_EQ} grid bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 px-2 py-1.5`}>
        <span>Tag</span>
        <span>Description</span>
        <span>Model</span>
        <span className="text-right">Qty</span>
        <span className="text-center">U</span>
        <span className="text-right">$/u</span>
        <span className="text-right">Ext</span>
        <span className="text-right">Lead</span>
      </div>
      {groups.map((g) => (
        <div key={g.key}>
          <GroupHeadC label={g.title} collapsed={!open[g.key]} onToggle={() => setOpen((o) => ({ ...o, [g.key]: !o[g.key] }))} accent="border-sky-500" />
          {!open[g.key]
            ? null
            : g.rows.map((row, i) => {
                const ext = extEquipment(row.qty, row.unit, row.unitPrice)
                return (
                  <div
                    key={row.id}
                    className={cn(
                      COLS_EQ,
                      "grid border-b border-slate-100 text-[12px] items-center px-1 py-0.5 hover:bg-[#1D9E75]/3 group transition-colors",
                      i % 2 === 1 && "bg-slate-50/50"
                    )}
                  >
                    <input className="h-6 px-1 text-[12px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm font-mono" value={row.tag} onChange={(e) => onChange(g.key, row.id, "tag", e.target.value)} />
                    <input className="h-6 px-1 text-[12px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm" value={row.description} onChange={(e) => onChange(g.key, row.id, "description", e.target.value)} />
                    <input className="h-6 px-1 text-[12px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-slate-600" value={row.model} onChange={(e) => onChange(g.key, row.id, "model", e.target.value)} />
                    <input className="h-6 px-1 text-[12px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right" value={row.qty} onChange={(e) => onChange(g.key, row.id, "qty", e.target.value)} />
                    <input className="h-6 px-1 text-[12px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-center" value={row.unit} onChange={(e) => onChange(g.key, row.id, "unit", e.target.value)} />
                    <input className="h-6 px-1 text-[12px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right tabular-nums" value={row.unitPrice} onChange={(e) => onChange(g.key, row.id, "unitPrice", e.target.value)} />
                    <span className="text-right pr-1 font-medium tabular-nums">{fmtMoney(ext)}</span>
                    <input className="h-6 px-1 text-[11px] border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right" value={row.lead} onChange={(e) => onChange(g.key, row.id, "lead", e.target.value)} />
                  </div>
                )
              })}
        </div>
      ))}
      <div className="px-2 py-1.5 text-[11px] text-[#1D9E75] flex items-center gap-1 cursor-pointer hover:bg-[#1D9E75]/5">
        <Plus className="w-3 h-3" /> Add equipment line
      </div>
    </div>
  )
}

function LaborDenseC({ rows, onChange }) {
  const total = useMemo(() => rows.reduce((s, r) => s + extLabor(r.crew, r.grossHrs, r.factor, r.rate), 0), [rows])
  return (
    <div className="border border-slate-200 rounded-sm overflow-hidden w-full">
      <div className="px-2 py-1.5 bg-[#534AB7]/8 border-b border-[#534AB7]/15 text-[11px] text-[#534AB7] flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" />
        Prevailing wage / productivity from Estimate tab — mock rates shown below.
      </div>
      <div className={cn(COLS_LB, "grid bg-slate-800 text-[11px] font-semibold text-white px-2 py-1")}>
        <span>Trade</span>
        <span>Class</span>
        <span className="text-right">Cr</span>
        <span className="text-right">Gr</span>
        <span className="text-right">Fx</span>
        <span className="text-right">Net</span>
        <span className="text-right">$/hr</span>
        <span className="text-right">Ext</span>
      </div>
      {rows.map((row, i) => {
        const ext = extLabor(row.crew, row.grossHrs, row.factor, row.rate)
        const net = parseNum(row.crew) * parseNum(row.grossHrs) * parseNum(row.factor)
        return (
          <div
            key={row.id}
            className={cn(
              COLS_LB,
              "grid border-b border-slate-100 items-center px-1 py-0.5 text-[12px] hover:bg-[#1D9E75]/3 group transition-colors",
              i % 2 === 1 && "bg-slate-50/60"
            )}
          >
            <input className="h-6 px-1 border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm" value={row.trade} onChange={(e) => onChange(row.id, "trade", e.target.value)} />
            <input className="h-6 px-1 border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm font-mono text-[11px]" value={row.classCode} onChange={(e) => onChange(row.id, "classCode", e.target.value)} />
            <input className="h-6 px-1 border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right" value={row.crew} onChange={(e) => onChange(row.id, "crew", e.target.value)} />
            <input className="h-6 px-1 border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right tabular-nums" value={row.grossHrs} onChange={(e) => onChange(row.id, "grossHrs", e.target.value)} />
            <input className="h-6 px-1 border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right" value={row.factor} onChange={(e) => onChange(row.id, "factor", e.target.value)} />
            <span className="text-right pr-1 text-[12px] font-medium text-slate-600 tabular-nums">{net ? net.toFixed(0) : "—"}</span>
            <div className="relative">
              <input
                className={cn("w-full h-6 px-1 pr-5 border border-transparent hover:border-slate-300 focus:border-[#1D9E75] rounded-sm text-right tabular-nums", row.aiRate && "text-[#534AB7]")}
                value={row.rate}
                onChange={(e) => onChange(row.id, "rate", e.target.value)}
              />
              {row.aiRate && <span className="absolute right-0.5 top-1/2 -translate-y-1/2 text-[7px] font-bold text-[#534AB7]">AI</span>}
            </div>
            <span className="text-right font-semibold tabular-nums pr-1">{fmtMoney(ext)}</span>
          </div>
        )
      })}
      <div className={`${COLS_LB} grid bg-slate-100 border-t-2 border-slate-300 font-bold text-[12px] px-1 py-1 items-center`}>
        <span className="col-span-7 pl-1 text-slate-700">Labor direct total</span>
        <span className="text-right tabular-nums pr-1 text-slate-900">{fmtMoney(total)}</span>
      </div>
    </div>
  )
}

/** --- Public exports --- */

export function EquipmentScheduleMock({ layout }) {
  const [groups, setGroups] = useState(cloneEquipment)

  const onChange = (groupKey, rowId, field, value) => {
    setGroups((gs) =>
      gs.map((g) =>
        g.key !== groupKey
          ? g
          : {
              ...g,
              rows: g.rows.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
            }
      )
    )
  }

  const body =
    layout === "cards" ? (
      <EquipmentCardsB groups={groups} onChange={onChange} />
    ) : layout === "dense" ? (
      <EquipmentDenseC groups={groups} onChange={onChange} />
    ) : (
      <EquipmentTableA groups={groups} onChange={onChange} />
    )

  return (
    <div className={cn("w-full min-w-0", layout === "dense" ? "px-4 py-5 sm:px-6" : "px-4 py-6 sm:px-6 lg:px-8")}>
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800">Equipment schedule</h2>
        <p className="text-xs text-slate-500 mt-1">Line-item equipment and long-lead tags for CR-01 commercial refrigeration. Values are demo data.</p>
      </div>
      {body}
    </div>
  )
}

export function LaborBreakdownMock({ layout }) {
  const [rows, setRows] = useState(() => LABOR_ROWS_INITIAL.map((r) => ({ ...r })))

  const onChange = (id, field, value) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const inner =
    layout === "cards" ? (
      <LaborCardsB rows={rows} onChange={onChange} />
    ) : layout === "dense" ? (
      <LaborDenseC rows={rows} onChange={onChange} />
    ) : (
      <LaborTableA rows={rows} onChange={onChange} />
    )

  return (
    <div className={cn("w-full min-w-0", layout === "dense" ? "px-4 py-5 sm:px-6" : "px-4 py-6 sm:px-6 lg:px-8")}>
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-800">Labor breakdown</h2>
        <p className="text-xs text-slate-500 mt-1">Trade crews, gross vs adjusted hours, and loaded rates. Demo content — not tied to bid total yet.</p>
      </div>
      {inner}
    </div>
  )
}
