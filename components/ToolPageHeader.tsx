import { type LucideIcon } from 'lucide-react'

interface ToolPageHeaderProps {
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  eyebrow?: string
  title: string
  description: string
  children?: React.ReactNode
}

export function ToolPageHeader({
  icon: Icon,
  iconColor = 'text-[#C9A646]',
  iconBg = 'bg-[#C9A646]/10',
  eyebrow,
  title,
  description,
  children,
}: ToolPageHeaderProps) {
  return (
    <div className="bg-white border-b border-[#E8E1D0] px-6 py-5">
      <div className="max-w-5xl mx-auto flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} flex-shrink-0 mt-0.5`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            {eyebrow && (
              <p className="text-[10px] font-heading font-black uppercase tracking-[0.22em] text-[#C9A646] mb-1">
                {eyebrow}
              </p>
            )}
            <h1 className="font-heading font-black text-[#0F0F0F] text-xl leading-none tracking-tight">
              {title}
            </h1>
            <p className="text-[#6B6059] text-[12px] font-heading mt-1.5 leading-relaxed max-w-lg">
              {description}
            </p>
          </div>
        </div>
        {children && (
          <div className="flex-shrink-0 flex items-center gap-2">{children}</div>
        )}
      </div>
    </div>
  )
}

export function ToolPageContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      {children}
    </div>
  )
}
