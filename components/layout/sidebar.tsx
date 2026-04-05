'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { authService } from '@/features/auth/services/auth-service'
import { 
  FileText, 
  LayoutDashboard, 
  Truck, 
  LogOut,
  Wrench,
  Menu,
  X,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: '/veiculos',
    label: 'Veiculos',
    icon: <Truck className="h-5 w-5" />,
  },
  {
    href: '/manutencao',
    label: 'Manutenção',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    href: '/relatorios',
    label: 'Relatorios',
    icon: <FileText className="h-5 w-5" />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image 
            src="/images/logo.png" 
            alt="LogiTrack" 
            width={150} 
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="fixed left-3 top-3.5 z-50 h-9 w-9 p-0 md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex h-full flex-col">
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card md:flex">
      {sidebarContent}
    </aside>
  )
}
