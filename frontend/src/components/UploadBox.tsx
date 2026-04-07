import { useRef, useState, type DragEvent } from 'react'

type UploadBoxProps = {
  selectedFile: File | null
  onFileSelect: (file: File | null) => void
}

export function UploadBox({ selectedFile, onFileSelect }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0] ?? null
    onFileSelect(file)
  }

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
        isDragging
          ? 'border-[#D53E0F] bg-[#D53E0F]/10 shadow-[0_0_35px_rgba(213,62,15,0.55)]'
          : 'border-[#EED9B9]/25 bg-black/20 hover:border-[#D53E0F]/80 hover:shadow-[0_0_30px_rgba(213,62,15,0.4)]'
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

      <p className="text-sm font-medium text-[#EED9B9]">Drag and drop your PDF here</p>
      <p className="mt-2 text-xs text-[#EED9B9]/65">Accepted format: .pdf</p>

      <div className="mt-4 rounded-xl border border-[#EED9B9]/15 bg-[#5E0006]/40 px-4 py-2 text-xs text-[#EED9B9]/90">
        {selectedFile ? selectedFile.name : 'No file selected'}
      </div>
    </div>
  )
}
