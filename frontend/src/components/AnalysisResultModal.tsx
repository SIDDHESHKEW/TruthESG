type ClaimResult = {
  claim: string
  final_score: number
  final_risk: string
  reason: string
}

type AnalysisResultModalProps = {
  isOpen: boolean
  onClose: () => void
  claims: ClaimResult[]
  averageScore: number
  overallRisk: string
}

function getRiskMeta(risk: string) {
  const normalized = risk.trim().toLowerCase()

  if (normalized.includes('verified') || normalized.includes('low')) {
    return {
      label: 'Verified',
      badgeClass: 'border-[#22c55e]/35 bg-[#22c55e]/10 text-[#22c55e]',
    }
  }

  if (normalized.includes('questionable') || normalized.includes('medium')) {
    return {
      label: 'Questionable',
      badgeClass: 'border-[#eab308]/35 bg-[#eab308]/10 text-[#eab308]',
    }
  }

  return {
    label: 'High Risk',
    badgeClass: 'border-[#ef4444]/35 bg-[#ef4444]/10 text-[#ef4444]',
  }
}

function getInsightText(averageScore: number) {
  if (averageScore >= 0.75) {
    return 'This company shows strong ESG credibility with consistently verifiable claims and low material risk.'
  }

  if (averageScore >= 0.45) {
    return 'This company shows moderate ESG credibility, but several claims need stronger evidence and clearer disclosures.'
  }

  return 'This company shows weak ESG credibility with elevated verification gaps and significant disclosure risk.'
}

export function AnalysisResultModal({
  isOpen,
  onClose,
  claims,
  averageScore,
  overallRisk,
}: AnalysisResultModalProps) {
  const avgPercent = Math.round(averageScore * 100)
  const overallRiskMeta = getRiskMeta(overallRisk)
  const insightText = getInsightText(averageScore)

  return (
    <div
      className={`fixed top-0 left-0 z-[70] h-full w-full bg-[#020617]/90 backdrop-blur-md transition-all duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`flex h-full w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_#172554_0%,_#0b1221_40%,_#020617_100%)] transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-[0.985]'
        }`}
      >
        <header className="border-b border-slate-800/90 bg-slate-950/35 px-6 py-5 backdrop-blur-sm sm:px-10">
          <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-5">
            <div>
              <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">ESG Analysis Report</h2>
              <p className="mt-1 text-sm text-slate-400 sm:text-base">AI-generated verification summary</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700/80 bg-slate-900/80 text-base font-semibold text-slate-200 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white"
              aria-label="Close analysis report"
            >
              X
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10 sm:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <section className="mb-6 rounded-2xl border border-slate-800/90 bg-slate-900/65 p-6 shadow-[0_18px_55px_-25px_rgba(15,23,42,0.9)] backdrop-blur-sm sm:p-7">
              <p className="text-sm tracking-wide text-slate-400 uppercase">Overall summary</p>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-5xl font-bold text-slate-100 sm:text-6xl">{avgPercent}%</p>
                <span
                  className={`inline-flex w-fit items-center rounded-md border px-3 py-1.5 text-sm font-medium ${overallRiskMeta.badgeClass}`}
                >
                  {overallRiskMeta.label}
                </span>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">{insightText}</p>
            </section>

            <section className="space-y-4 pb-6">
              {claims.map((item, index) => {
                const scorePercent = Math.max(0, Math.min(100, Math.round(item.final_score * 100)))
                const riskMeta = getRiskMeta(item.final_risk)

                return (
                  <article
                    key={`${item.claim}-${index}`}
                    className="rounded-lg border border-slate-800/90 bg-slate-900/55 p-5 backdrop-blur-sm"
                  >
                    <p className="text-base leading-7 font-medium text-slate-100">{item.claim}</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Score</span>
                        <span className="font-semibold text-slate-200">{scorePercent}%</span>
                      </div>

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 transition-all duration-300"
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${riskMeta.badgeClass}`}
                      >
                        {riskMeta.label}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.reason}</p>
                  </article>
                )
              })}
            </section>
          </div>
        </div>

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.15),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.12),transparent_25%)]" />
      </div>
    </div>
  )
}
