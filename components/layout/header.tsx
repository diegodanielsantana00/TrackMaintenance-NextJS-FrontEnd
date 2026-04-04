'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'
import { authService } from '@/features/auth/services/auth-service'

interface HeaderProps {
  titulo: string
  subtitulo?: string
}

interface UserProfile {
  id: string
  name: string
  email: string
}

export function Header({ titulo, subtitulo }: HeaderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const router = useRouter()

  useEffect(() => {
    api.get<UserProfile>('/v1/users/me')
      .then((res) => {
        if (res.data) setUser(res.data)
      })
      .catch(() => {})
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{titulo}</h1>
        {subtitulo && (
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        )}
      </div>

      <div className="flex items-center gap-4">

        {/* Perfil do Usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg bg-muted/50 py-1.5 pl-3 pr-1.5 transition-colors hover:bg-muted">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.name || '...'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || '...'}</p>
              </div>
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
