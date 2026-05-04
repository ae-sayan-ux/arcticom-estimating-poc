import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, Check } from "lucide-react"

/**
 * @param {object} props
 * @param {{ id: string, label: string, tab: string, anchorId: string }[]} props.issues
 * @param {{ id: string, label: string, value: string, ok: boolean }[]} props.summaryRows
 * @param {(issue: { tab: string, anchorId: string }) => void} props.onGoToField
 * @param {string} props.templateVersion
 */
export function BidSummaryTabContent({ issues, summaryRows, onGoToField, templateVersion }) {
  const missingIds = new Set(issues.map((i) => i.id))
  const issueById = new Map(issues.map((i) => [i.id, i]))

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Bid summary</h2>
          <p className="text-xs text-slate-500 mt-1">
            Required fields and materials must be complete before submit. Template{" "}
            <span className="font-mono text-slate-700">v{templateVersion}</span> controls validation rules.
            {issues.length > 0 && (
              <span className="block mt-1.5 text-amber-900/85">
                Incomplete rows include a <strong className="font-medium">Go to field</strong> action to jump to the
                Estimate tab and focus that entry.
              </span>
            )}
          </p>
        </div>
        {issues.length > 0 ? (
          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900 text-[11px] shrink-0">
            {issues.length} missing
          </Badge>
        ) : (
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900 text-[11px] shrink-0">
            Complete
          </Badge>
        )}
      </div>

      <Card
        className={
          issues.length > 0
            ? "border-amber-300 shadow-sm ring-1 ring-amber-200/60"
            : "border-slate-200 shadow-sm"
        }
      >
        <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/80">
          <CardTitle className="text-xs font-semibold text-slate-700">Completeness &amp; values</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-100">
          {summaryRows.map((row) => {
            const isMissing = missingIds.has(row.id)
            const issue = issueById.get(row.id)
            return (
              <div
                key={row.id}
                className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 px-4 py-3 text-xs ${
                  isMissing ? "bg-amber-50/90" : "bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${isMissing ? "text-amber-950" : "text-slate-700"}`}>{row.label}</p>
                  <p
                    className={`mt-0.5 truncate font-mono tabular-nums ${
                      isMissing ? "text-amber-800/90" : "text-slate-600"
                    }`}
                  >
                    {row.value || "—"}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2 shrink-0 sm:pl-2">
                  {isMissing && issue ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] gap-1 border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75]/10"
                        onClick={() => onGoToField(issue)}
                      >
                        Go to field
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                      <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden />
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <Check className="w-3.5 h-3.5" aria-hidden />
                      OK
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
