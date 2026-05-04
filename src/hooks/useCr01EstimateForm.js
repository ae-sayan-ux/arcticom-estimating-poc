import { useCallback, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getCr01CompletenessIssues, CR01_TAB } from "@/lib/cr01Completeness"
import { resolvePinnedTemplateVersion } from "@/lib/formTemplateVersion"

const INITIAL_COPPER_ROWS = [
  { id: 1, description: 'Copper pipe 1/2"', unit: "LF", qty: "", unitCost: "4.82", waste: "5", isAI: true },
  { id: 2, description: 'Copper pipe 3/4"', unit: "LF", qty: "", unitCost: "6.34", waste: "5", isAI: true },
  { id: 3, description: 'Copper pipe 1-1/8"', unit: "LF", qty: "", unitCost: "9.18", waste: "5", isAI: true },
  { id: 4, description: "Fittings allowance", unit: "LS", qty: "", unitCost: "", waste: "0", isAI: false },
]

const INITIAL_REFRIGERANT_ROWS = [
  { id: 1, description: "R-404A refrigerant", unit: "LB", qty: "", unitCost: "14.20", waste: "12", isAI: true, riskFlag: true },
]

export function calcLineTotal(qty, unitCost, waste) {
  const q = parseFloat(qty) || 0
  const uc = parseFloat(unitCost) || 0
  const w = parseFloat(waste) || 0
  if (q === 0 || uc === 0) return null
  return (q * uc * (1 + w / 100)).toFixed(2)
}

export const CR01_MAIN_TABS = [
  { label: "Estimate (CR-01)", value: CR01_TAB.ESTIMATE },
  { label: "Equipment schedule", value: CR01_TAB.EQUIPMENT },
  { label: "Labor breakdown", value: CR01_TAB.LABOR },
  { label: "Bid summary", value: CR01_TAB.SUMMARY },
]

export function useCr01EstimateForm() {
  const [searchParams] = useSearchParams()
  const pinnedVersion = useMemo(
    () => resolvePinnedTemplateVersion(searchParams.get("template")),
    [searchParams]
  )

  const [activeTab, setActiveTab] = useState(CR01_TAB.ESTIMATE)
  const [pulseId, setPulseId] = useState(null)

  const [projectName, setProjectName] = useState("")
  const [client, setClient] = useState("")
  const [siteAddress, setSiteAddress] = useState("")
  const [jurisdiction, setJurisdiction] = useState("")
  const [bidDueDate, setBidDueDate] = useState("")
  const [constructionType, setConstructionType] = useState("")
  const [jurisdictionLoaded, setJurisdictionLoaded] = useState(false)

  const [copperRows, setCopperRows] = useState(INITIAL_COPPER_ROWS)
  const [refrigerantRows, setRefrigerantRows] = useState(INITIAL_REFRIGERANT_ROWS)

  const handleCopperChange = (id, field, value) => {
    setCopperRows((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const handleRefrigerantChange = (id, field, value) => {
    setRefrigerantRows((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const addCopperRow = () => {
    const newId = Math.max(...copperRows.map((r) => r.id)) + 1
    setCopperRows([
      ...copperRows,
      { id: newId, description: "", unit: "LF", qty: "", unitCost: "", waste: "5", isAI: false },
    ])
  }

  const addRefrigerantRow = () => {
    const newId = Math.max(...refrigerantRows.map((r) => r.id)) + 1
    setRefrigerantRows([
      ...refrigerantRows,
      { id: newId, description: "", unit: "LB", qty: "", unitCost: "", waste: "5", isAI: false, riskFlag: false },
    ])
  }

  const removeCopperRow = (id) => {
    setCopperRows((rows) => rows.filter((r) => r.id !== id))
  }

  const removeRefrigerantRow = (id) => {
    setRefrigerantRows((rows) => rows.filter((r) => r.id !== id))
  }

  const allCopperTotal = copperRows.reduce((sum, r) => {
    const t = calcLineTotal(r.qty, r.unitCost, r.waste)
    return sum + (t ? parseFloat(t) : 0)
  }, 0)

  const allRefrigerantTotal = refrigerantRows.reduce((sum, r) => {
    const t = calcLineTotal(r.qty, r.unitCost, r.waste)
    return sum + (t ? parseFloat(t) : 0)
  }, 0)

  const grandTotal = allCopperTotal + allRefrigerantTotal

  const formState = useMemo(
    () => ({
      projectName,
      client,
      siteAddress,
      jurisdiction,
      bidDueDate,
      constructionType,
      copperRows,
      refrigerantRows,
    }),
    [projectName, client, siteAddress, jurisdiction, bidDueDate, constructionType, copperRows, refrigerantRows]
  )

  const issues = useMemo(() => getCr01CompletenessIssues(formState), [formState])

  const summaryRows = useMemo(() => {
    const hasMat = [...copperRows, ...refrigerantRows].some((r) => parseFloat(String(r.qty).replace(",", "")) > 0)
    return [
      { id: "projectName", label: "Project name", value: projectName.trim() },
      { id: "siteAddress", label: "Site address", value: siteAddress.trim() },
      { id: "jurisdiction", label: "Labor jurisdiction", value: jurisdiction },
      { id: "bidDueDate", label: "Bid due date", value: bidDueDate },
      { id: "constructionType", label: "Construction type", value: constructionType },
      { id: "client", label: "Client", value: client.trim() },
      {
        id: "materialsQty",
        label: "Materials (at least one quantity)",
        value: hasMat ? "Entered" : "",
      },
    ]
  }, [projectName, siteAddress, jurisdiction, bidDueDate, constructionType, client, copperRows, refrigerantRows])

  const goToField = useCallback((issue) => {
    setActiveTab(issue.tab)
    setPulseId(issue.anchorId)
    window.setTimeout(() => {
      const root = document.getElementById(issue.anchorId)
      root?.scrollIntoView({ behavior: "smooth", block: "center" })
      const input = root?.querySelector("input")
      if (input) {
        input.focus()
        return
      }
      root?.querySelector("button")?.focus()
    }, 80)
    window.setTimeout(() => setPulseId(null), 2600)
  }, [])

  const onJurisdictionChange = (v) => {
    setJurisdiction(v)
    if (v) setJurisdictionLoaded(true)
  }

  return {
    CR01_TAB,
    CR01_MAIN_TABS,
    pinnedVersion,
    activeTab,
    setActiveTab,
    pulseId,
    projectName,
    setProjectName,
    client,
    setClient,
    siteAddress,
    setSiteAddress,
    jurisdiction,
    setJurisdiction: onJurisdictionChange,
    bidDueDate,
    setBidDueDate,
    constructionType,
    setConstructionType,
    jurisdictionLoaded,
    copperRows,
    refrigerantRows,
    handleCopperChange,
    handleRefrigerantChange,
    addCopperRow,
    addRefrigerantRow,
    removeCopperRow,
    removeRefrigerantRow,
    allCopperTotal,
    allRefrigerantTotal,
    grandTotal,
    issues,
    summaryRows,
    goToField,
  }
}
