/** CR-01 form template identity & published versions (RFP: form versioning, historical fidelity). */

export const FORM_CODE_CR01 = "CR-01"

/** Latest published template — new estimates pin to this until a newer version ships. */
export const CURRENT_CR01_TEMPLATE_VERSION = "1.1.0"

/** Prior releases; estimates opened with ?template= retain rules/labels from that release. */
export const CR01_TEMPLATE_PUBLISHED_VERSIONS = [
  {
    version: "1.1.0",
    publishedAt: "2026-04-15",
    notes: "Materials waste defaults; bid summary completeness rules.",
  },
  {
    version: "1.0.0",
    publishedAt: "2025-11-01",
    notes: "Initial web parity baseline with Excel workbook v2025.08.",
  },
]

export function isKnownCr01TemplateVersion(v) {
  return CR01_TEMPLATE_PUBLISHED_VERSIONS.some((entry) => entry.version === v)
}

export function resolvePinnedTemplateVersion(fromUrl) {
  if (fromUrl && isKnownCr01TemplateVersion(fromUrl)) return fromUrl
  return CURRENT_CR01_TEMPLATE_VERSION
}

export function getVersionMeta(version) {
  return CR01_TEMPLATE_PUBLISHED_VERSIONS.find((e) => e.version === version) ?? null
}
