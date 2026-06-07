import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-heading font-bold text-sm tracking-wide ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-[#E6C871] via-[#C9A646] to-[#8C6F1F] text-[#0A0A0A] border border-[rgba(140,111,31,0.35)] shadow-[0_0_20px_rgba(201,166,70,0.22),0_4px_14px_rgba(10,10,10,0.08)] hover:shadow-[0_0_35px_rgba(201,166,70,0.40),0_10px_24px_rgba(10,10,10,0.12)] hover:-translate-y-0.5',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-[#DED5C2] bg-white text-[#1F1B16] hover:border-[#C9A646]/50 hover:bg-[#F4EFE3] hover:text-[#0A0A0A]',
        secondary:
          'bg-[#F4EFE3] text-[#1F1B16] border border-[#DED5C2] hover:bg-[#EDE4CF] hover:border-[#C9A646]/40',
        ghost:
          'text-[#4A3F35] hover:bg-[#F4EFE3] hover:text-[#0A0A0A]',
        link:
          'text-[#8C6F1F] underline-offset-4 hover:underline hover:text-[#C9A646]',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm:      'h-9 rounded-lg px-4 text-xs',
        lg:      'h-12 rounded-xl px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
