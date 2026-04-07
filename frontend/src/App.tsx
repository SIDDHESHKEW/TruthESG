import { useState } from 'react'
import { Hero } from './components/Hero'
import { UploadCard } from './components/UploadCard'

type ClaimResult = {
  claim: string
  final_score: number
  final_risk: string
  reason: string
}

type AnalyzeResponse = {
  claims: ClaimResult[]
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleAnalyze() {
    if (!file) {
      alert('Please upload a file')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Upload request failed')
      }

      const uploadData: { file_path?: string } = await uploadResponse.json()

      if (!uploadData.file_path) {
        throw new Error('Missing file_path in upload response')
      }

      const analyzeResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: uploadData.file_path }),
      })

      if (!analyzeResponse.ok) {
        throw new Error('Analyze request failed')
      }

      const analyzeData: AnalyzeResponse = await analyzeResponse.json()
      setResult(analyzeData)
    } catch (error) {
      console.error(error)
      alert('Something went wrong while analyzing the file')
    } finally {
      setLoading(false)
    }
  }

  function onFileSelect(file: File | null) {
    if (!file || file.type !== 'application/pdf') {
      return
    }

    setFile(file)
    setResult(null)
  }

  const claims: ClaimResult[] = Array.isArray(result?.claims) ? result.claims : []
  const avgScore = claims.length
    ? claims.reduce((sum, item) => sum + item.final_score, 0) / claims.length
    : 0
  const avgPercent = Math.round(avgScore * 100)
  const confidencePercent = Math.max(0, Math.min(100, Math.round((1 - avgScore) * 100)))

  const overallRisk =
    avgScore >= 0.75 ? 'Verified' : avgScore >= 0.45 ? 'Questionable' : 'High Risk'

  const verdictMessage =
    avgScore < 0.4
      ? 'High Risk of Greenwashing'
      : avgScore <= 0.7
        ? 'Moderate Risk Detected'
        : 'Claims Appear Reliable'

  const overallRiskColor =
    overallRisk === 'Verified'
      ? 'text-[#22c55e]'
      : overallRisk === 'Questionable'
        ? 'text-[#eab308]'
        : 'text-[#ef4444]'

  const verdictBorderColor =
    avgScore < 0.4
      ? 'border-l-[#ef4444]'
      : avgScore <= 0.7
        ? 'border-l-[#eab308]'
        : 'border-l-[#22c55e]'

  const questionableClaimsCount = claims.filter((item) => {
    const riskText = item.final_risk.toLowerCase()
    return riskText.includes('questionable') || riskText.includes('medium')
  }).length

  const keyInsight =
    questionableClaimsCount >= Math.ceil(claims.length / 2)
      ? 'Multiple claims lack strong supporting evidence'
      : avgScore > 0.7
        ? 'Claims are consistent with available signals'
        : 'Some claims need stronger verification signals'

  function getReasonSegments(reason: string) {
    const normalized = reason.toLowerCase()

    if (normalized.includes('no issues')) {
      return [
        { text: reason, className: 'text-[#22c55e]' },
      ]
    }

    if (normalized.includes('moderate')) {
      return [
        { text: reason, className: 'text-[#eab308]' },
      ]
    }

    if (normalized.includes('strong')) {
      return [
        { text: reason, className: 'text-[#22c55e]' },
      ]
    }

    return [{ text: reason, className: 'text-[#9ca3af]' }]
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e5e7eb]">
      <main className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        {claims.length > 0 && (
          <section
            className={`mb-6 rounded-lg border border-[#1f2937] border-l-4 ${verdictBorderColor} bg-gradient-to-r from-[#111827] to-[#0f172a] p-4 transition-all duration-300`}
          >
            <p className="text-sm font-semibold text-[#e5e7eb]">AI Verdict</p>
            <p className={`mt-1 text-base font-medium ${overallRiskColor}`}>{verdictMessage}</p>
          </section>
        )}

        <Hero
          onCtaClick={() =>
            document.getElementById('upload-section')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        />

        <div className="flex flex-col gap-8 pb-14">
          <UploadCard
            selectedFile={file}
            onFileSelect={onFileSelect}
            onAnalyze={handleAnalyze}
            isAnalyzing={loading}
          />

          {loading && (
            <section className="rounded-xl border border-[#1f2937] bg-[#111827] p-6 sm:p-8">
              <h3 className="text-center text-xl font-semibold text-[#e5e7eb] sm:text-2xl">
                Processing
              </h3>

              <p className="mt-4 text-center text-sm text-[#9ca3af] sm:text-base">
                Analyzing... Extracting → Verifying → Scoring
              </p>
            </section>
          )}

          <section
            className={`space-y-5 transition-all duration-300 ${
              claims.length > 0
                ? 'translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-1 opacity-0'
            }`}
          >
            {claims.length > 0 && (
              <>
              <h3 className="text-xl font-semibold text-[#e5e7eb] sm:text-2xl">AI Analysis Results</h3>

              <article className="rounded-xl border border-[#1f2937] bg-[#111827] p-6 transition-all duration-300">
                <p className="text-sm font-medium text-[#9ca3af]">Overall Company Result</p>
                <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
                  <p className="text-4xl font-bold text-[#e5e7eb]">ESG Integrity Score: {avgPercent}%</p>
                  <div className="text-right">
                    <p className="text-sm text-[#9ca3af]">Risk Level</p>
                    <p className={`text-lg font-semibold ${overallRiskColor}`}>{overallRisk}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#9ca3af]">AI Confidence: {confidencePercent}%</p>
                <p className="mt-2 text-sm italic text-[#9ca3af]">Key Insight: {keyInsight}</p>
              </article>

              <div className="grid gap-4 sm:grid-cols-2">
                {claims.map((item: ClaimResult, index: number) => {
                  const scorePercent = Math.max(0, Math.min(100, Math.round(item.final_score * 100)))
                  const riskMeta = getRiskMeta(item.final_risk)
                  const reasonSegments = getReasonSegments(item.reason)

                  return (
                    <article
                      key={`${item.claim}-${index}`}
                      className="space-y-3 rounded-xl border border-[#1f2937] bg-[#111827] p-5 transition-all duration-200 hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-base font-semibold text-[#e5e7eb]">{item.claim}</p>
                        <span className="rounded-md border border-[#374151] bg-[#0f172a] px-2 py-1 text-[11px] font-medium text-[#9ca3af]">
                          AI Checked
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#9ca3af]">Score</span>
                          <span className="font-medium text-[#e5e7eb]">{scorePercent}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1f2937]">
                          <div
                            className="h-full rounded-full bg-[#6366f1] transition-all duration-200"
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${riskMeta.badgeClass}`}
                        >
                          {riskMeta.label}
                        </span>
                      </div>

                      <p className="text-sm">
                        {reasonSegments.map((segment, segmentIndex) => (
                          <span key={`${segment.text}-${segmentIndex}`} className={segment.className}>
                            {segment.text}
                          </span>
                        ))}
                      </p>
                    </article>
                  )
                })}
              </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
