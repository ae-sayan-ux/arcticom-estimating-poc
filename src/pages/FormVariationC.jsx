/**
 * Form Variation C — Dense grouped list + template versioning + bid summary completeness
 */

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
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
  ChevronRight,
} from "lucide-react"

function fmt(val) {
  if (!val || parseFloat(val) === 0) return "—"
  return "$" + parseFloat(val).toLocaleString("en-US", { minimumFractionDigits: 2 })
}

function DenseInput({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full h-6 px-1.5 text-[12px] bg-transparent border border-transparent hover:border-slate-300 focus:border-[#1D9E75] focus:outline-none rounded-sm tabular-nums",
        className
      )}
    />
  )
}

const COLS = "grid-cols-[minmax(0,2.5fr)_50px_70px_90px_60px_90px_32px]"

function fieldWrapClass(pulseId, anchorId) {
  return cn(
    "rounded-md transition-shadow",
    pulseId === anchorId && "ring-2 ring-amber-400 ring-offset-1 ring-offset-white"
  )
}

function GroupHeader({ label, subtotal, collapsed, onToggle, accent }) {
  return (
    <div
      className={`${COLS} grid border-l-4 ${accent} bg-slate-100 cursor-pointer hover:bg-slate-200/70 transition-colors`}
      onClick={onToggle}
      onKeyDown={(e) => e.key === "Enter" && onToggle()}
      role="button"
      tabIndex={0}
    >
      <div className="col-span-5 flex items-center gap-1.5 px-2 py-1">
        <span className="text-slate-400">{collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</span>
        <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">{label}</span>
      </div>
      <div className="px-2 py-1 text-right">
        <span className="text-[11px] font-semibold text-slate-700 tabular-nums">{subtotal > 0 ? fmt(subtotal.toFixed(2)) : ""}</span>
      </div>
      <div />
    </div>
  )
}

export default function FormVariationC() {
  const f = useCr01EstimateForm()
  const [copperCollapsed, setCopperCollapsed] = useState(false)
  const [refrigerantCollapsed, setRefrigerantCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans text-sm">
      <div className="bg-white border-b border-slate-200 px-5 py-2.5">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
              <ChevronLeft className="w-3 h-3" />
              <Link to="/" className="hover:text-slate-600">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">CR-01 — Commercial Refrigeration Installation</span>
            </div>
            <TemplateVersionStrip pinnedVersion={f.pinnedVersion} />
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">Draft</span>
            <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1 px-2">
              <Save className="w-3 h-3" /> Save
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[11px] gap-1 px-2">
              <Printer className="w-3 h-3" /> Print
            </Button>
            <Button size="sm" className="h-6 text-[11px] gap-1 px-2 bg-[#1D9E75] hover:bg-[#178a65] text-white">
              <Send className="w-3 h-3" /> Submit for review
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={f.activeTab} onValueChange={f.setActiveTab} className="flex w-full min-w-0 flex-col min-h-[calc(100vh-72px)]">
        <div className="bg-white border-b border-slate-200 px-5">
          <TabsList className="h-auto bg-transparent p-0 gap-0 w-full justify-start rounded-none">
            {CR01_MAIN_TABS.map(({ label, value }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1D9E75] data-[state=active]:text-[#1D9E75] data-[state=active]:bg-transparent text-[11px] px-3 py-2.5 font-medium"
              >
                {label}
                {value === CR01_TAB.SUMMARY && f.issues.length > 0 && (
                  <Badge className="ml-1 h-3.5 min-w-3.5 px-0.5 text-[8px] bg-amber-500 hover:bg-amber-500 text-white border-0">
                    {f.issues.length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={CR01_TAB.ESTIMATE} className="mt-0 w-full min-w-0 flex-1 p-0">
          <div className="flex">
            <div className="flex-1 min-w-0 overflow-x-auto">
              <div className="border-b border-slate-200 bg-slate-50/40 px-5 py-3">
                <div className="grid grid-cols-4 gap-x-6 gap-y-2 mb-2">
                  <div id="field-project-name" className={cn("flex items-center gap-2", fieldWrapClass(f.pulseId, "field-project-name"))}>
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-28 flex-shrink-0">
                      Project name <span className="text-red-400">*</span>
                    </label>
                    <DenseInput value={f.projectName} onChange={f.setProjectName} placeholder="—" />
                  </div>
                  <div id="field-client" className={cn("flex items-center gap-2", fieldWrapClass(f.pulseId, "field-client"))}>
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-16 flex-shrink-0">
                      Client <span className="text-red-400">*</span>
                    </label>
                    <DenseInput value={f.client} onChange={f.setClient} placeholder="—" />
                  </div>
                  <div id="field-site-address" className={cn("flex items-center gap-2", fieldWrapClass(f.pulseId, "field-site-address"))}>
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-20 flex-shrink-0">
                      Site address <span className="text-red-400">*</span>
                    </label>
                    <DenseInput value={f.siteAddress} onChange={f.setSiteAddress} placeholder="—" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-20 flex-shrink-0">Operating co.</label>
                    <div className="flex items-center gap-1 flex-1">
                      <span className="text-[12px] text-slate-500">Arctic Pacific — West</span>
                      <Lock className="w-3 h-3 text-slate-300" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                  <div id="field-jurisdiction" className={cn("flex items-center gap-2", fieldWrapClass(f.pulseId, "field-jurisdiction"))}>
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-28 flex-shrink-0">
                      Jurisdiction <span className="text-red-400">*</span>
                    </label>
                    <div className="flex-1">
                      <Select value={f.jurisdiction || undefined} onValueChange={f.setJurisdiction}>
                        <SelectTrigger className="h-6 text-[11px] border-0 border-b border-slate-300 rounded-none bg-transparent focus:border-[#1D9E75] px-1.5">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ca-la">CA — Los Angeles</SelectItem>
                          <SelectItem value="co-denver">CO — Denver Metro</SelectItem>
                          <SelectItem value="wa-seattle">WA — Seattle</SelectItem>
                          <SelectItem value="il-cook">IL — Cook County</SelectItem>
                        </SelectContent>
                      </Select>
                      {f.jurisdictionLoaded && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-[#534AB7] mt-0.5">
                          <Sparkles className="w-2 h-2" />
                          Prevailing wage: $68.40/hr
                        </span>
                      )}
                    </div>
                  </div>
                  <div id="field-construction-type" className={cn("flex items-center gap-2", fieldWrapClass(f.pulseId, "field-construction-type"))}>
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-16 flex-shrink-0">
                      Const. type <span className="text-red-400">*</span>
                    </label>
                    <div className="flex-1">
                      <Select value={f.constructionType || undefined} onValueChange={f.setConstructionType}>
                        <SelectTrigger className="h-6 text-[11px] border-0 border-b border-slate-300 rounded-none bg-transparent focus:border-[#1D9E75] px-1.5">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New construction</SelectItem>
                          <SelectItem value="retrofit">Retrofit</SelectItem>
                          <SelectItem value="expansion">Expansion</SelectItem>
                        </SelectContent>
                      </Select>
                      {f.constructionType && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-[#534AB7] mt-0.5">
                          <Sparkles className="w-2 h-2" />
                          Factor: 0.92×
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-20 flex-shrink-0">Estimator</label>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-slate-500">Jamie Morales</span>
                      <Lock className="w-3 h-3 text-slate-300" />
                    </div>
                  </div>
                  <div id="field-bid-due-date" className={cn("flex items-center gap-2", fieldWrapClass(f.pulseId, "field-bid-due-date"))}>
                    <label className="text-[11px] text-slate-500 whitespace-nowrap w-20 flex-shrink-0">
                      Bid due <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={f.bidDueDate}
                      onChange={(e) => f.setBidDueDate(e.target.value)}
                      className="flex-1 h-6 px-1.5 text-[12px] border-b border-slate-300 bg-transparent focus:border-[#1D9E75] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div id="section-materials" className={cn("scroll-mt-20", fieldWrapClass(f.pulseId, "section-materials"))}>
                <div className="flex items-center justify-between px-5 py-1.5 bg-slate-800 border-b border-slate-700">
                  <span className="text-[11px] font-semibold text-white uppercase tracking-wider">Section 1 — Materials</span>
                  <span className="text-[11px] font-semibold text-white tabular-nums">{f.grandTotal > 0 ? fmt(f.grandTotal.toFixed(2)) : ""}</span>
                </div>

                <div className={`${COLS} grid border-b border-slate-200 bg-slate-50 sticky top-0 z-10`}>
                  <div className="text-[11px] font-semibold text-slate-500 px-3 py-1.5">Description</div>
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1.5 text-center">Unit</div>
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1.5 text-right">Qty</div>
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1.5 text-right">Unit cost</div>
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1.5 text-right">Waste %</div>
                  <div className="text-[11px] font-semibold text-slate-500 px-2 py-1.5 text-right">Total</div>
                  <div />
                </div>

                <GroupHeader
                  label="Copper piping & fittings"
                  subtotal={f.allCopperTotal}
                  collapsed={copperCollapsed}
                  onToggle={() => setCopperCollapsed(!copperCollapsed)}
                  accent="border-[#1D9E75]"
                />

                {!copperCollapsed && (
                  <>
                    {f.copperRows.map((row, i) => {
                      const total = calcLineTotal(row.qty, row.unitCost, row.waste)
                      return (
                        <div
                          key={row.id}
                          className={`${COLS} grid border-b border-slate-100 hover:bg-[#1D9E75]/3 group transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          <div className="px-3 py-0.5 flex items-center">
                            <DenseInput value={row.description} onChange={(v) => f.handleCopperChange(row.id, "description", v)} />
                          </div>
                          <div className="px-1 py-0.5 flex items-center">
                            <DenseInput value={row.unit} onChange={(v) => f.handleCopperChange(row.id, "unit", v)} className="text-center" />
                          </div>
                          <div className="px-1 py-0.5 flex items-center">
                            <DenseInput value={row.qty} onChange={(v) => f.handleCopperChange(row.id, "qty", v)} placeholder="0" className="text-right" />
                          </div>
                          <div className="px-1 py-0.5 flex items-center relative">
                            <DenseInput
                              value={row.unitCost}
                              onChange={(v) => f.handleCopperChange(row.id, "unitCost", v)}
                              className={cn("text-right", row.isAI && "text-[#534AB7] pr-5")}
                            />
                            {row.isAI && (
                              <span className="absolute right-2 text-[8px] font-bold text-[#534AB7] bg-[#534AB7]/10 px-0.5 rounded leading-none py-0.5">AI</span>
                            )}
                          </div>
                          <div className="px-1 py-0.5 flex items-center">
                            <DenseInput value={row.waste} onChange={(v) => f.handleCopperChange(row.id, "waste", v)} className="text-right" />
                          </div>
                          <div className="px-2 py-0.5 flex items-center justify-end">
                            <span className="text-[12px] font-medium text-slate-700 tabular-nums">{total ? fmt(total) : "—"}</span>
                          </div>
                          <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                f.removeCopperRow(row.id)
                              }}
                              className="text-slate-300 hover:text-red-400 text-[11px] leading-none px-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    <div className={`${COLS} grid border-b border-slate-100 bg-white hover:bg-[#1D9E75]/3 cursor-pointer`} onClick={f.addCopperRow}>
                      <div className="px-3 py-0.5 flex items-center gap-1.5 text-[11px] text-[#1D9E75]">
                        <Plus className="w-3 h-3" />
                        Add line
                      </div>
                      <div className="col-span-6" />
                    </div>
                  </>
                )}

                <GroupHeader
                  label="Refrigerant"
                  subtotal={f.allRefrigerantTotal}
                  collapsed={refrigerantCollapsed}
                  onToggle={() => setRefrigerantCollapsed(!refrigerantCollapsed)}
                  accent="border-amber-400"
                />

                {!refrigerantCollapsed && (
                  <>
                    {f.refrigerantRows.map((row) => {
                      const total = calcLineTotal(row.qty, row.unitCost, row.waste)
                      return (
                        <div key={row.id} className={`${COLS} grid border-b border-slate-100 hover:bg-amber-50/20 group transition-colors`}>
                          <div className="px-3 py-0.5 flex items-center gap-1.5">
                            <DenseInput value={row.description} onChange={(v) => f.handleRefrigerantChange(row.id, "description", v)} />
                            {row.riskFlag && (
                              <span className="flex-shrink-0 flex items-center gap-0.5 text-[9px] font-semibold text-amber-700 bg-amber-100 px-1 py-0.5 rounded whitespace-nowrap">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Phase-down
                              </span>
                            )}
                          </div>
                          <div className="px-1 py-0.5 flex items-center">
                            <DenseInput value={row.unit} onChange={(v) => f.handleRefrigerantChange(row.id, "unit", v)} className="text-center" />
                          </div>
                          <div className="px-1 py-0.5 flex items-center">
                            <DenseInput value={row.qty} onChange={(v) => f.handleRefrigerantChange(row.id, "qty", v)} placeholder="0" className="text-right" />
                          </div>
                          <div className="px-1 py-0.5 flex items-center relative">
                            <DenseInput
                              value={row.unitCost}
                              onChange={(v) => f.handleRefrigerantChange(row.id, "unitCost", v)}
                              className={cn("text-right", row.isAI && "text-[#534AB7] pr-5")}
                            />
                            {row.isAI && (
                              <span className="absolute right-2 text-[8px] font-bold text-[#534AB7] bg-[#534AB7]/10 px-0.5 rounded leading-none py-0.5">AI</span>
                            )}
                          </div>
                          <div className="px-1 py-0.5 flex items-center relative">
                            <DenseInput value={row.waste} onChange={(v) => f.handleRefrigerantChange(row.id, "waste", v)} className="text-right pr-4" />
                            {row.riskFlag && <Sparkles className="absolute right-1.5 w-2.5 h-2.5 text-[#534AB7]" />}
                          </div>
                          <div className="px-2 py-0.5 flex items-center justify-end">
                            <span className="text-[12px] font-medium text-slate-700 tabular-nums">{total ? fmt(total) : "—"}</span>
                          </div>
                          <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                f.removeRefrigerantRow(row.id)
                              }}
                              className="text-slate-300 hover:text-red-400 text-[11px] leading-none px-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    <div className={`${COLS} grid border-b border-slate-100 bg-white hover:bg-amber-50/20 cursor-pointer`} onClick={f.addRefrigerantRow}>
                      <div className="px-3 py-0.5 flex items-center gap-1.5 text-[11px] text-[#1D9E75]">
                        <Plus className="w-3 h-3" />
                        Add line
                      </div>
                      <div className="col-span-6" />
                    </div>
                  </>
                )}

                {[
                  { label: "Section 2 — Equipment & racks", msg: "Complete Section 1 to unlock", color: "border-slate-300" },
                  { label: "Section 3 — Labor", msg: "Select jurisdiction to unlock", color: "border-slate-300" },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center justify-between px-3 py-1.5 border-l-4 ${s.color} bg-slate-50 border-b border-slate-100 opacity-50`}>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Lock className="w-3 h-3" />
                      {s.msg}
                    </span>
                  </div>
                ))}

                <div className={`${COLS} grid border-t-2 border-slate-300 bg-slate-100`}>
                  <div className="col-span-4 px-3 py-1.5 text-[12px] font-bold text-slate-700">Section 1 total</div>
                  <div />
                  <div className="px-2 py-1.5 text-right text-[12px] font-bold text-slate-800 tabular-nums">
                    {f.grandTotal > 0 ? fmt(f.grandTotal.toFixed(2)) : "—"}
                  </div>
                  <div />
                </div>
              </div>

              <div className="flex items-center gap-2 mx-5 my-3 px-3 py-2 bg-[#534AB7]/5 border border-[#534AB7]/20 rounded text-[11px] text-[#534AB7]">
                <Sparkles className="w-3 h-3 flex-shrink-0" />
                <span>R-404A waste % adjusted to 12% — EPA HFC phase-down risk.</span>
                <button type="button" className="ml-auto underline text-[10px] flex-shrink-0">
                  Review
                </button>
              </div>
            </div>

            <aside className="w-56 flex-shrink-0 border-l border-slate-200 bg-white px-3 py-4 sticky top-0 h-[calc(100vh-72px)] overflow-y-auto self-start">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Estimate total</p>
              <p className="text-2xl font-bold text-slate-800 mb-0.5 tabular-nums leading-none">{f.grandTotal > 0 ? fmt(f.grandTotal.toFixed(2)) : "$—"}</p>
              <p className="text-[10px] text-slate-400 mb-4">Materials only</p>
              <div className="h-px bg-slate-100 mb-3" />
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Breakdown</p>
              {[
                { label: "Materials", value: f.grandTotal, color: "bg-[#1D9E75]" },
                { label: "Equipment", value: 0, color: "bg-sky-400" },
                { label: "Labor", value: 0, color: "bg-violet-400" },
                { label: "Subs", value: 0, color: "bg-orange-400" },
                { label: "Overhead", value: 0, color: "bg-slate-300" },
                { label: "Margin", value: 0, color: "bg-amber-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-1.5 mb-2">
                  <div className={cn("w-2 h-2 rounded-sm flex-shrink-0", color, value === 0 && "opacity-30")} />
                  <span className="text-[11px] text-slate-500 flex-1">{label}</span>
                  <span className="text-[11px] font-medium text-slate-700 tabular-nums">{value > 0 ? fmt(value.toFixed(2)) : "—"}</span>
                </div>
              ))}
              <div className="h-px bg-slate-100 my-3" />
              <div className="rounded bg-[#534AB7]/5 border border-[#534AB7]/15 p-2.5">
                <div className="flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3 text-[#534AB7]" />
                  <span className="text-[10px] font-semibold text-[#534AB7]">AI context</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">Enter address + jurisdiction to load comparable bids and risk signals.</p>
              </div>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value={CR01_TAB.EQUIPMENT} className="mt-0 w-full min-w-0 flex-1 bg-white">
          <EquipmentScheduleMock layout="dense" />
        </TabsContent>

        <TabsContent value={CR01_TAB.LABOR} className="mt-0 w-full min-w-0 flex-1 bg-white">
          <LaborBreakdownMock layout="dense" />
        </TabsContent>

        <TabsContent value={CR01_TAB.SUMMARY} className="mt-0 w-full min-w-0 flex-1 bg-slate-50/80">
          <BidSummaryTabContent issues={f.issues} summaryRows={f.summaryRows} onGoToField={f.goToField} templateVersion={f.pinnedVersion} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
