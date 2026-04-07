import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const baseClassName =
  'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-[#EED9B9] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D53E0F]/80 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#D53E0F] to-[#9B0F06] shadow-[0_0_30px_rgba(213,62,15,0.6)] hover:scale-[1.03] hover:shadow-[0_0_44px_rgba(213,62,15,0.78)]',
  secondary:
    'bg-[#9B0F06]/40 ring-1 ring-[#D53E0F]/35 hover:scale-[1.01] hover:bg-[#9B0F06]/55 hover:ring-[#D53E0F]/50',
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
