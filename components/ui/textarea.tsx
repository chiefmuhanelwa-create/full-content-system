import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[110px] w-full rounded-xl border border-[#E4E4E7] bg-[#F9FAFB] px-4 py-3 text-sm text-[#18181B] font-body ring-offset-background resize-none placeholder:text-[#A89F94] focus-visible:outline-none focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/25 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
