import { useEffect, useState } from 'react'

const loadingSteps = [
  'Extracting ESG claims...',
  'Analyzing ESG signals...',
  'Generating risk score...',
]

type AnalysisLoadingOverlayProps = {
  isVisible: boolean
}

export function AnalysisLoadingOverlay({ isVisible }: AnalysisLoadingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setStepIndex(0)
      return
    }

    const intervalId = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length)
    }, 1500)

    return () => window.clearInterval(intervalId)
  }, [isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/75 backdrop-blur-sm">
      <div className="flex w-[90%] max-w-md flex-col items-center rounded-2xl border border-slate-700/70 bg-[#0f172a] px-8 py-10 text-center shadow-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-300/30 border-t-indigo-400" />
        <p className="mt-5 text-base font-medium text-slate-200 transition-opacity duration-300">
          {loadingSteps[stepIndex]}
        </p>
      </div>
    </div>
  )
}
