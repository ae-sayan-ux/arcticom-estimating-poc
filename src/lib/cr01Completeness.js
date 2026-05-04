/** Tab values must match TabsTrigger `value` in form screens. */
export const CR01_TAB = {
  ESTIMATE: "estimate",
  EQUIPMENT: "equipment-schedule",
  LABOR: "labor-breakdown",
  SUMMARY: "bid-summary",
}

/**
 * @param {object} s
 * @param {string} s.projectName
 * @param {string} s.client
 * @param {string} s.siteAddress
 * @param {string} s.jurisdiction
 * @param {string} s.bidDueDate
 * @param {string} s.constructionType
 * @param {{ qty: string }[]} s.copperRows
 * @param {{ qty: string }[]} s.refrigerantRows
 * @returns {{ id: string, label: string, tab: string, anchorId: string }[]}
 */
export function getCr01CompletenessIssues(s) {
  const issues = []
  if (!String(s.projectName ?? "").trim()) {
    issues.push({
      id: "projectName",
      label: "Project name",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "field-project-name",
    })
  }
  if (!String(s.siteAddress ?? "").trim()) {
    issues.push({
      id: "siteAddress",
      label: "Site address",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "field-site-address",
    })
  }
  if (!String(s.jurisdiction ?? "").trim()) {
    issues.push({
      id: "jurisdiction",
      label: "Labor jurisdiction",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "field-jurisdiction",
    })
  }
  if (!String(s.bidDueDate ?? "").trim()) {
    issues.push({
      id: "bidDueDate",
      label: "Bid due date",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "field-bid-due-date",
    })
  }
  if (!String(s.constructionType ?? "").trim()) {
    issues.push({
      id: "constructionType",
      label: "Construction type",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "field-construction-type",
    })
  }
  if (!String(s.client ?? "").trim()) {
    issues.push({
      id: "client",
      label: "Client",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "field-client",
    })
  }

  const materialLineHasQty = [...(s.copperRows ?? []), ...(s.refrigerantRows ?? [])].some(
    (r) => parseFloat(String(r.qty ?? "").replace(",", "")) > 0
  )
  if (!materialLineHasQty) {
    issues.push({
      id: "materialsQty",
      label: "At least one materials quantity (Section 1)",
      tab: CR01_TAB.ESTIMATE,
      anchorId: "section-materials",
    })
  }

  return issues
}
