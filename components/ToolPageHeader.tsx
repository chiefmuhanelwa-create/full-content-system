import { type LucideIcon } from 'lucide-react'

interface ToolPageHeaderProps {
  icon: LucideIcon
  iconColor?: string
  eyebrow?: string
  title: string
  description: string
  children?: React.ReactNode
}

export function ToolPageHeader({
  icon: Icon,
  iconColor = 'text-[#C9A646]',
  eyebrow,
  title,
  description,
  children,
}: ToolPageHeaderProps) {
  return (
    <div className="nc-page-header">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E1D0] flex-shrink-0 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            {eyebrow && (
              <p className="nc-eyebrow mb-1">{eyebrow}</p>
            )}
            <h1 className="font-heading font-black text-[#0A0A0A] text-2xl leading-none mb-1.5">
              {title}
            </h1>
            <p className="text-[#8A8071] text-sm font-heading leading-snug max-w-xl">
              {description}
            </p>
          </div>
        </div>
        {children && (
          <div className="flex-shrink-0">{children}</div>
        )}
      </div>
    </div>
  )
}
