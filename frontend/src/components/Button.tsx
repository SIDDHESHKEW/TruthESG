import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const baseClassName =
  'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]/70 disabled:cursor-not-allowed disabled:opacity-50'

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-[#6366f1] hover:bg-[#4f46e5] hover:scale-[1.02] shadow-[0_0_0_1px_rgba(99,102,241,0.25)]',
  secondary:
    'border border-[#374151] bg-[#111827] text-[#e5e7eb] hover:border-[#6366f1]/70',
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  fullWidth = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClassName} ${variantClassNames[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
