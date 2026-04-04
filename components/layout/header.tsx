'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
  titulo: string
  subtitulo?: string
}

export function Header({ titulo, subtitulo }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{titulo}</h1>
        {subtitulo && (
          <p className="text-sm text-muted-foreground">{subtitulo}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Busca */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar algo..."
            className="h-10 w-72 rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Notificacoes */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Perfil do Usuario */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 py-1.5 pl-3 pr-1.5">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">Gerente</p>
          </div>
          <Avatar className="h-8 w-8 border-2 border-primary">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              AU
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
