import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[#D53E0F]/30 bg-gradient-to-br from-[#9B0F06]/80 to-black/80 p-6 backdrop-blur-xl shadow-[0_30px_70px_rgba(0,0,0,0.55)] ring-1 ring-[#D53E0F]/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
