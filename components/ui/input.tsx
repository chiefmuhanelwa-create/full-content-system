import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-[#DED5C2] bg-[#FAF7F0] px-4 py-2.5 text-sm text-[#1F1B16] font-body ring-offset-background',
          'placeholder:text-[#A89F94]',
          'focus-visible:outline-none focus-visible:border-[#C9A646] focus-visible:ring-2 focus-visible:ring-[#C9A646]/25',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
