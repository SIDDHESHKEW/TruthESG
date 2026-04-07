import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { UploadBox } from './components/UploadBox'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const loadingSteps = ['Extracting', 'Verifying', 'Scoring', 'Finalizing']

  useEffect(() => {
    if (!isAnalyzing) return

    const interval = setInterval(() => {
      setActiveStep((current) => {
        if (current >= loadingSteps.length - 1) {
          return current
        }
        return current + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isAnalyzing, loadingSteps.length])

  function handleAnalyze() {
    console.log('analyzing')
    setActiveStep(0)
    setIsAnalyzing(true)
  }

  function onFileSelect(file: File | null) {
    if (!file || file.type !== 'application/pdf') {
      return
    }

    setSelectedFile(file)
    setActiveStep(0)
    setIsAnalyzing(false)
  }

  const progressWidth = ((activeStep + 1) / loadingSteps.length) * 100

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#5E0006] via-[#160203] to-black text-[#EED9B9]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-0 h-[360px] w-[360px] rounded-full bg-[#D53E0F]/28 blur-[120px]" />
        <div className="absolute -right-20 bottom-10 h-[320px] w-[320px] rounded-full bg-[#9B0F06]/35 blur-[110px]" />
        <div className="absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-[#EED9B9]/12 blur-[100px]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8 sm:py-14">
        <section className="mx-auto flex min-h-[68vh] w-full max-w-4xl items-center justify-center text-center">
          <div className="space-y-6">
            <div className="mx-auto h-16 w-16 rounded-xl border border-[#D53E0F]/40 bg-[#9B0F06]/40 shadow-[0_0_35px_rgba(213,62,15,0.35)]" />
            <h1 className="text-6xl font-extrabold tracking-tight text-[#EED9B9] md:text-7xl">
              <span className="text-[#EED9B9]">Truth</span>
              <span className="text-[#D53E0F] drop-shadow-[0_0_20px_rgba(213,62,15,0.95)]">ESG</span>
            </h1>
            <h2 className="text-lg text-[#EED9B9] md:text-2xl">
              AI-powered ESG Truth Verification Engine
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-[#EED9B9]/75 md:text-base">
              Upload ESG reports and detect greenwashing using AI
            </p>

            <Button
              className="mt-4 px-10 py-3 text-base"
              onClick={() =>
                document.getElementById('upload-section')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }
            >
              Analyze Report
            </Button>
          </div>
        </section>

        <Card className="space-y-6" id="upload-section">
          <section className="space-y-5">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-[#EED9B9]">Upload Report</h3>
              <p className="mt-2 text-sm text-[#EED9B9]/70">
                Drag and drop your PDF report for analysis.
              </p>
            </div>

            <UploadBox selectedFile={selectedFile} onFileSelect={onFileSelect} />

            <Button
              onClick={handleAnalyze}
              fullWidth
              disabled={!selectedFile}
              className="py-3 text-base"
            >
              Analyze
            </Button>
          </section>
        </Card>

        {isAnalyzing ? (
          <Card className="space-y-6">
            <section className="space-y-5 text-center">
              <h3 className="text-xl font-bold text-[#EED9B9]">Processing</h3>

              <div className="mx-auto h-2 w-full max-w-2xl overflow-hidden rounded-xl bg-[#5E0006]/70 ring-1 ring-[#D53E0F]/25">
                <div
                  className="h-full rounded-xl bg-gradient-to-r from-[#D53E0F] to-[#EED9B9] shadow-[0_0_22px_rgba(213,62,15,0.75)] transition-all duration-300"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
                {loadingSteps.map((step, index) => {
                  const isActive = index === activeStep
                  const isDone = index < activeStep

                  return (
                    <div key={step} className="flex items-center gap-3">
                      <span
                        className={`rounded-xl border px-4 py-1.5 transition-all duration-300 ${
                          isActive
                            ? 'border-[#EED9B9]/70 bg-[#D53E0F]/30 text-[#EED9B9] shadow-[0_0_28px_rgba(213,62,15,0.65)]'
                            : isDone
                              ? 'border-[#D53E0F]/45 bg-[#D53E0F]/18 text-[#EED9B9]/90'
                              : 'border-[#EED9B9]/15 bg-black/25 text-[#EED9B9]/55'
                        }`}
                      >
                      {step}
                      </span>
                      {index < loadingSteps.length - 1 ? (
                        <span className="text-[#D53E0F]">→</span>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </section>
          </Card>
        ) : null}
      </main>
    </div>
  )
}

export default App
