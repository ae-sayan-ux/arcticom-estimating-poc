import { Badge } from "@/components/ui/badge"
import {
  CURRENT_CR01_TEMPLATE_VERSION,
  FORM_CODE_CR01,
  getVersionMeta,
} from "@/lib/formTemplateVersion"

export function TemplateVersionStrip({ pinnedVersion }) {
  const isLegacy = pinnedVersion !== CURRENT_CR01_TEMPLATE_VERSION
  const meta = getVersionMeta(pinnedVersion)

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
      <Badge variant="outline" className="font-mono text-[10px] font-normal border-slate-300 bg-white">
        {FORM_CODE_CR01} · Template v{pinnedVersion}
      </Badge>
      {meta && <span className="text-slate-500">Published {meta.publishedAt}</span>}
      {isLegacy && (
        <span className="text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5 font-medium">
          Historical template — validation rules frozen for this estimate
        </span>
      )}
    </div>
  )
}
