import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary'
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className={cn("rounded-lg p-2", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}
