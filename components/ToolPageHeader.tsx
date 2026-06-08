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
  iconColor = 'text-[#2563EB]',
  iconBg = 'bg-[#2563EB]/10',
  eyebrow,
  title,
  description,
  children,
}: ToolPageHeaderProps) {
  return (
    <div className="bg-white border-b border-[#E4E4E7] px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex-shrink-0 mt-0.5`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            {eyebrow && (
              <p className="text-[11px] font-display font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-1">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display font-bold text-[#18181B] text-[22px] leading-none tracking-tight">
              {title}
            </h1>
            <p className="text-[#71717A] text-[13px] font-display mt-1.5 leading-relaxed max-w-lg">
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
    <div className="px-6 py-6">
      {children}
    </div>
  )
}
