/**
 * Form Variation B — Section Cards + template versioning + bid summary completeness
 */

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BidSummaryTabContent } from "@/components/estimate/BidSummaryTabContent"
import { EquipmentScheduleMock, LaborBreakdownMock } from "@/components/estimate/Cr01EquipmentLaborMocks"
import { TemplateVersionStrip } from "@/components/estimate/TemplateVersionStrip"
import { CR01_TAB } from "@/lib/cr01Completeness"
import { calcLineTotal, CR01_MAIN_TABS, useCr01EstimateForm } from "@/hooks/useCr01EstimateForm"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  Printer,
  Save,
  Send,
  Plus,
  AlertTriangle,
  Sparkles,
  Lock,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

function formatCurrency(val) {
  if (!val || parseFloat(val) === 0) return "—"
  return "$" + parseFloat(val).toLocaleString("en-US", { minimumFractionDigits: 2 })
}

function fieldWrapClass(pulseId, anchorId) {
  return cn(
    "rounded-md transition-shadow",
    pulseId === anchorId && "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-50"
  )
}

function SectionCard({ title, rows, onRowChange, onAddRow, showRiskFlag }) {
  const [collapsed, setCollapsed] = useState(false)

  const subtotal = rows.reduce((sum, r) => {
    const t = calcLineTotal(r.qty, r.unitCost, r.waste)
    return sum + (t ? parseFloat(t) : 0)
  }, 0)

  return (
    <Card className="border-slate-200 shadow-sm mb-4">
      <CardHeader className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-slate-600 transition-colors">
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <CardTitle className="text-xs font-semibold text-slate-700">{title}</CardTitle>
            {showRiskFlag && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                <AlertTriangle className="w-2.5 h-2.5" />
                Phase-down risk
              </span>
            )}
          </div>
          {subtotal > 0 && (
            <span className="text-xs font-semibold text-slate-700 tabular-nums">{formatCurrency(subtotal.toFixed(2))}</span>
          )}
        </div>
      </CardHeader>

      {!collapsed && (
        <>
          <CardContent className="p-0">
            <div className="grid grid-cols-[minmax(0,2fr)_60px_80px_100px_60px_90px] gap-0 border-b border-slate-100 bg-white">
              {["Description", "Unit", "Qty", "Unit cost", "Waste %", "Total"].map((h, i) => (
                <div key={h} className={`text-[11px] font-medium text-slate-400 px-3 py-2 ${i >= 2 ? "text-right" : ""}`}>
                  {h}
                </div>
              ))}
            </div>

            {rows.map((row, i) => {
              const total = calcLineTotal(row.qty, row.unitCost, row.waste)
              return (
                <div
                  key={row.id}
                  className={`grid grid-cols-[minmax(0,2fr)_60px_80px_100px_60px_90px] gap-0 border-b border-slate-50 hover:bg-[#1D9E75]/4 transition-colors group ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  <div className="px-2 py-1.5">
                    <Input
                      value={row.description}
                      onChange={(e) => onRowChange(row.id, "description", e.target.value)}
                      className="h-7 text-xs border-transparent bg-transparent group-hover:bg-white hover:border-slate-200 focus:border-[#1D9E75] px-2"
                    />
                  </div>
                  <div className="px-2 py-1.5">
                    <Input
                      value={row.unit}
                      onChange={(e) => onRowChange(row.id, "unit", e.target.value)}
                      className="h-7 text-xs border-transparent bg-transparent group-hover:bg-white hover:border-slate-200 focus:border-[#1D9E75] px-2 text-center"
                    />
                  </div>
                  <div className="px-2 py-1.5">
                    <Input
                      value={row.qty}
                      onChange={(e) => onRowChange(row.id, "qty", e.target.value)}
                      placeholder="0"
                      className="h-7 text-xs border-transparent bg-transparent group-hover:bg-white hover:border-slate-200 focus:border-[#1D9E75] px-2 text-right"
                    />
                  </div>
                  <div className="px-2 py-1.5 relative">
                    <Input
                      value={row.unitCost}
                      onChange={(e) => onRowChange(row.id, "unitCost", e.target.value)}
                      className={cn(
                        "h-7 text-xs border-transparent bg-transparent group-hover:bg-white hover:border-slate-200 focus:border-[#1D9E75] px-2 text-right",
                        row.isAI ? "text-[#534AB7] pr-7" : ""
                      )}
                    />
                    {row.isAI && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-[#534AB7] bg-[#534AB7]/10 px-1 rounded leading-none py-0.5">
                        AI
                      </span>
                    )}
                  </div>
                  <div className="px-2 py-1.5 relative">
                    <Input
                      value={row.waste}
                      onChange={(e) => onRowChange(row.id, "waste", e.target.value)}
                      className="h-7 text-xs border-transparent bg-transparent group-hover:bg-white hover:border-slate-200 focus:border-[#1D9E75] px-2 text-right"
                    />
                    {row.riskFlag && <Sparkles className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#534AB7]" />}
                  </div>
                  <div className="px-3 py-1.5 flex items-center justify-end">
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">{total ? formatCurrency(total) : "—"}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>

          <CardFooter className="px-4 py-2 border-t border-slate-100 bg-white rounded-b-lg flex items-center justify-between">
            <button type="button" onClick={onAddRow} className="flex items-center gap-1.5 text-xs text-[#1D9E75] hover:text-[#178a65] py-1 px-2 rounded hover:bg-[#1D9E75]/5 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add line
            </button>
            {subtotal > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-semibold text-slate-700 tabular-nums">{formatCurrency(subtotal.toFixed(2))}</span>
              </div>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default function FormVariationB() {
  const f = useCr01EstimateForm()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-sm">
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <ChevronLeft className="w-3.5 h-3.5" />
              <Link to="/" className="hover:text-slate-700">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Commercial Refrigeration Installation — CR-01</span>
            </div>
            <TemplateVersionStrip pinnedVersion={f.pinnedVersion} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Draft</span>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save draft
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
            <Button size="sm" className="h-7 text-xs gap-1.5 bg-[#1D9E75] hover:bg-[#178a65] text-white">
              <Send className="w-3.5 h-3.5" /> Submit for review
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={f.activeTab} onValueChange={f.setActiveTab} className="flex w-full min-w-0 flex-col min-h-[calc(100vh-88px)]">
        <div className="bg-white border-b border-slate-200 px-6">
          <TabsList className="h-auto bg-transparent p-0 gap-0 w-full justify-start rounded-none">
            {CR01_MAIN_TABS.map(({ label, value }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent text-xs px-4 py-3 font-medium"
              >
                {label}
                {value === CR01_TAB.SUMMARY && f.issues.length > 0 && (
                  <Badge className="ml-1.5 h-4 min-w-4 px-1 text-[9px] bg-amber-500 hover:bg-amber-500 text-white border-0">
                    {f.issues.length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={CR01_TAB.ESTIMATE} className="mt-0 w-full min-w-0 flex-1 p-0">
          <div className="flex">
            <div className="flex-1 px-6 py-5 min-w-0">
              <Card className="border-slate-200 shadow-sm mb-5">
                <CardHeader className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <CardTitle className="text-xs font-semibold text-slate-700">Project information</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div id="field-project-name" className={fieldWrapClass(f.pulseId, "field-project-name")}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Project name <span className="text-red-400">*</span>
                      </label>
                      <Input value={f.projectName} onChange={(e) => f.setProjectName(e.target.value)} placeholder="e.g. Denver Cold Storage Expansion" className="h-8 text-xs" />
                    </div>
                    <div id="field-client" className={fieldWrapClass(f.pulseId, "field-client")}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Client <span className="text-red-400">*</span>
                      </label>
                      <Input value={f.client} onChange={(e) => f.setClient(e.target.value)} placeholder="Client name" className="h-8 text-xs" />
                    </div>
                    <div id="field-site-address" className={fieldWrapClass(f.pulseId, "field-site-address")}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Site address <span className="text-red-400">*</span>
                      </label>
                      <Input value={f.siteAddress} onChange={(e) => f.setSiteAddress(e.target.value)} placeholder="Street, city, state" className="h-8 text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Operating company</label>
                      <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-slate-200 bg-slate-50">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500">Arctic Pacific — West</span>
                        <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                      </div>
                    </div>
                    <div id="field-jurisdiction" className={fieldWrapClass(f.pulseId, "field-jurisdiction")}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Labor jurisdiction <span className="text-red-400">*</span>
                      </label>
                      <Select value={f.jurisdiction || undefined} onValueChange={f.setJurisdiction}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select jurisdiction..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ca-la">CA — Los Angeles County</SelectItem>
                          <SelectItem value="co-denver">CO — Denver Metro</SelectItem>
                          <SelectItem value="wa-seattle">WA — Seattle/King County</SelectItem>
                          <SelectItem value="il-cook">IL — Cook County</SelectItem>
                        </SelectContent>
                      </Select>
                      {f.jurisdictionLoaded && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#534AB7] bg-[#534AB7]/8 px-2 py-0.5 rounded">
                          <Sparkles className="w-2.5 h-2.5" />
                          Prevailing wage loaded — $68.40/hr
                        </span>
                      )}
                    </div>
                    <div id="field-construction-type" className={fieldWrapClass(f.pulseId, "field-construction-type")}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Construction type <span className="text-red-400">*</span>
                      </label>
                      <Select value={f.constructionType || undefined} onValueChange={f.setConstructionType}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New construction</SelectItem>
                          <SelectItem value="retrofit">Retrofit / renovation</SelectItem>
                          <SelectItem value="expansion">Expansion</SelectItem>
                          <SelectItem value="replacement">Equipment replacement</SelectItem>
                        </SelectContent>
                      </Select>
                      {f.constructionType && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#534AB7] bg-[#534AB7]/8 px-2 py-0.5 rounded">
                          <Sparkles className="w-2.5 h-2.5" />
                          Productivity factor: 0.92×
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Estimator</label>
                      <div className="flex items-center gap-2 h-8 px-3 rounded-md border border-slate-200 bg-slate-50">
                        <span className="text-xs text-slate-500">Jamie Morales</span>
                        <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                      </div>
                    </div>
                    <div id="field-bid-due-date" className={fieldWrapClass(f.pulseId, "field-bid-due-date")}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Bid due date <span className="text-red-400">*</span>
                      </label>
                      <Input type="date" value={f.bidDueDate} onChange={(e) => f.setBidDueDate(e.target.value)} className="h-8 text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div id="section-materials" className={cn("mb-3 scroll-mt-24", fieldWrapClass(f.pulseId, "section-materials"))}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Section 1 — Materials</h2>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#1D9E75]/10 text-[#1D9E75] font-medium">Active</span>
                  </div>
                  {f.grandTotal > 0 && (
                    <span className="text-xs font-semibold text-slate-600 tabular-nums">{formatCurrency(f.grandTotal.toFixed(2))}</span>
                  )}
                </div>

                <SectionCard title="Copper piping & fittings" rows={f.copperRows} onRowChange={f.handleCopperChange} onAddRow={f.addCopperRow} />
                <SectionCard
                  title="Refrigerant"
                  rows={f.refrigerantRows}
                  onRowChange={f.handleRefrigerantChange}
                  onAddRow={f.addRefrigerantRow}
                  showRiskFlag={true}
                />
              </div>

              {[
                { label: "Section 2 — Equipment & racks", msg: "Available after Section 1 is complete" },
                { label: "Section 3 — Labor", msg: "Rates loaded once jurisdiction selected" },
              ].map((s) => (
                <Card key={s.label} className="border-dashed border-slate-200 mb-3 opacity-50">
                  <CardContent className="px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">{s.label}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {s.msg}
                    </span>
                  </CardContent>
                </Card>
              ))}

              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#534AB7]/5 border border-[#534AB7]/20 rounded-md text-xs text-[#534AB7] mt-4">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Waste % for R-404A adjusted to 12% based on EPA HFC phase-down risk signals.</span>
                <button type="button" className="ml-auto underline text-[11px] flex-shrink-0">
                  Review
                </button>
              </div>
            </div>

            <aside className="w-64 flex-shrink-0 border-l border-slate-200 bg-white px-4 py-5 sticky top-0 h-[calc(100vh-88px)] overflow-y-auto self-start">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Estimate total</p>
              <p className="text-3xl font-bold text-slate-800 mb-1 tabular-nums">
                {f.grandTotal > 0 ? formatCurrency(f.grandTotal.toFixed(2)) : "$—"}
              </p>
              <p className="text-[11px] text-slate-400 mb-5">Materials section only</p>
              <Separator className="mb-4" />
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Cost breakdown</p>
              {[
                { label: "Materials", value: f.grandTotal, color: "bg-[#1D9E75]" },
                { label: "Equipment", value: 0, color: "bg-sky-500" },
                { label: "Labor", value: 0, color: "bg-violet-500" },
                { label: "Subs", value: 0, color: "bg-orange-400" },
                { label: "Overhead", value: 0, color: "bg-slate-300" },
                { label: "Margin", value: 0, color: "bg-amber-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="mb-2.5">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">{label}</span>
                    <span className="text-slate-700 font-medium tabular-nums">{value > 0 ? formatCurrency(value.toFixed(2)) : "—"}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", color)} style={{ width: value > 0 ? "100%" : "0%" }} />
                  </div>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="rounded-md bg-[#534AB7]/5 border border-[#534AB7]/15 p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#534AB7]" />
                  <span className="text-[11px] font-semibold text-[#534AB7]">AI context</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">Enter site address and jurisdiction to load similar past jobs and risk signals.</p>
              </div>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value={CR01_TAB.EQUIPMENT} className="mt-0 w-full min-w-0 flex-1 bg-slate-50/50">
          <EquipmentScheduleMock layout="cards" />
        </TabsContent>

        <TabsContent value={CR01_TAB.LABOR} className="mt-0 w-full min-w-0 flex-1 bg-slate-50/50">
          <LaborBreakdownMock layout="cards" />
        </TabsContent>

        <TabsContent value={CR01_TAB.SUMMARY} className="mt-0 w-full min-w-0 flex-1 bg-slate-50/80">
          <BidSummaryTabContent issues={f.issues} summaryRows={f.summaryRows} onGoToField={f.goToField} templateVersion={f.pinnedVersion} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
