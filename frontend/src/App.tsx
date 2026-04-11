import { useState } from 'react'
import { Hero } from './components/Hero'
import { UploadCard } from './components/UploadCard'
import CompanySearchBar from './components/CompanySearchBar.jsx'
import { AnalysisLoadingOverlay } from './components/AnalysisLoadingOverlay'
import { AnalysisResultModal } from './components/AnalysisResultModal'
import { getCompanyPDF } from './lib/getCompanyPDF.js'

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
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)

  async function handleAnalyze() {
    if (!file) {
      alert('Please upload a file')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const analyzeResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!analyzeResponse.ok) {
        throw new Error('Analyze request failed')
      }

      const analyzeData: AnalyzeResponse = await analyzeResponse.json()
      setResult(analyzeData)
      setShowResultModal(true)
    } catch (error) {
      console.error(error)
      alert('Something went wrong while analyzing the file')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCompanySearch(query: string) {
    const filePath = getCompanyPDF(query)

    if (!filePath) {
      alert('Demo supports Tata, Reliance, Adani, Infosys')
      return
    }

    setIsLoading(true)

    try {
      const fileResponse = await fetch(filePath)
      if (!fileResponse.ok) {
        throw new Error('File not found')
      }

      const blob = await fileResponse.blob()
      const fileName = filePath.split('/').pop() ?? 'company.pdf'
      const formData = new FormData()
      formData.append('file', blob, fileName)

      const analyzeResponse = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!analyzeResponse.ok) {
        throw new Error('Analyze request failed')
      }

      const analyzeData: AnalyzeResponse = await analyzeResponse.json()
      setResult(analyzeData)
      setShowResultModal(true)
    } catch (error) {
      console.error(error)
      alert('Demo supports Tata, Reliance, Adani, Infosys')
    } finally {
      setIsLoading(false)
    }
  }

  function onFileSelect(file: File | null) {
    if (!file || file.type !== 'application/pdf') {
      return
    }

    setFile(file)
    setResult(null)
    setShowResultModal(false)
  }

  const claims: ClaimResult[] = Array.isArray(result?.claims) ? result.claims : []
  const averageScore = claims.length
    ? claims.reduce((sum, item) => sum + item.final_score, 0) / claims.length
    : 0
  const overallRisk =
    averageScore >= 0.75 ? 'Verified' : averageScore >= 0.45 ? 'Questionable' : 'High Risk'

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e5e7eb]">
      <main className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <Hero
          onCtaClick={() =>
            document.getElementById('upload-section')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        />

        <section className="mt-10 mb-6">
          <CompanySearchBar handleCompanySearch={handleCompanySearch} />
        </section>

        <div className="flex flex-col gap-8 pb-14">
          <UploadCard
            selectedFile={file}
            onFileSelect={onFileSelect}
            onAnalyze={handleAnalyze}
            isAnalyzing={isLoading}
          />
        </div>
      </main>

      <AnalysisResultModal
        isOpen={showResultModal && claims.length > 0}
        onClose={() => setShowResultModal(false)}
        claims={claims}
        averageScore={averageScore}
        overallRisk={overallRisk}
      />

      <AnalysisLoadingOverlay isVisible={isLoading} />
    </div>
  )
}

export default App
