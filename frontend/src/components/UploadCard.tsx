import { useRef, useState, type DragEvent } from 'react'
import { Button } from './Button'

type UploadCardProps = {
  selectedFile: File | null
  onFileSelect: (file: File | null) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

export function UploadCard({ selectedFile, onFileSelect, onAnalyze, isAnalyzing }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0] ?? null
    onFileSelect(file)
  }

  return (
    <section className="mx-auto w-full max-w-3xl" id="upload-section">
      <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-8">
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-[#e5e7eb] sm:text-3xl">Upload Report</h2>
          <p className="mt-2 text-sm text-[#9ca3af]">
            Drop your ESG disclosure PDF to start the analysis workflow.
          </p>
        </div>

        <div
          className={`rounded-xl border-2 border-dashed p-7 text-center transition-all duration-200 sm:p-10 ${
            isDragging
              ? 'border-[#6366f1] bg-[#0f172a]'
              : 'border-[#374151] bg-[#0f172a] hover:border-[#6366f1]'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              fileInputRef.current?.click()
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
          />

          <p className="text-sm font-medium text-[#e5e7eb] sm:text-base">
            Drag and drop your PDF here
          </p>
          <p className="mt-2 text-xs text-[#9ca3af]">Accepted format: .pdf</p>

          <div className="mt-5 rounded-lg border border-[#374151] bg-[#111827] px-4 py-3 text-xs text-[#e5e7eb] sm:text-sm">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </div>
        </div>

        <Button
          className="mt-6 w-full py-3.5 text-base"
          disabled={!selectedFile || isAnalyzing}
          onClick={onAnalyze}
          type="button"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
    </section>
  )
}