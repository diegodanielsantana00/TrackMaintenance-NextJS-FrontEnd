"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading]       = useState(false)
  const [email, setEmail]               = useState("")
  const [password, setPassword]         = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="flex w-full flex-col justify-between bg-background p-8 lg:w-1/2">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="LogiTrack Transporte"
            width={180}
            height={50}
            className="h-12 w-auto"
          />
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="text-muted-foreground">
              Digite seu email e senha para acessar sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Lembrar de mim
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ainda nao tem uma conta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Registre-se agora.
              </Link>
            </p>
          </form>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Copyright 2025 LogiTrack Pro.</p>
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Politica de Privacidade
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden flex-col justify-center bg-primary p-12 lg:flex lg:w-1/2" />
    </div>
  )
}
