import { Button } from './Button'

type HeroProps = {
  onCtaClick: () => void
}

export function Hero({ onCtaClick }: HeroProps) {
  return (
    <section className="flex min-h-[52vh] items-center justify-center py-12 text-center sm:py-16" id="hero">
      <div className="w-full max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#9ca3af]">
          Next-Gen ESG Intelligence
        </p>

        <h1 className="font-['Orbitron',sans-serif] text-5xl font-extrabold leading-tight text-[#e5e7eb] sm:text-6xl md:text-7xl">
          <span>Truth</span>
          <span className="text-[#6366f1]">ESG</span>
        </h1>

        <p className="mt-6 text-lg text-[#e5e7eb] sm:text-xl">
          AI-powered ESG Truth Verification Engine
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-[#9ca3af] sm:text-base">
          Upload ESG reports, verify sustainability claims, and generate structured risk signals
          through a clean workflow built for analysts and decision teams.
        </p>

        <Button
          className="mt-8 px-5 py-2.5 text-sm hover:scale-[1.02]"
          onClick={onCtaClick}
          type="button"
        >
          Analyze Report
        </Button>
      </div>
    </section>
  )
}