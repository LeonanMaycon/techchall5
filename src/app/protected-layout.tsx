import { useAuthStore } from '@/features/auth/auth.store'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LogOut } from 'lucide-react'

export function ProtectedLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">

      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

          <h1 className="text-lg font-semibold tracking-tight">
            Planejador Semanal
          </h1>

          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {user}
            </Badge>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut />
              Sair
            </Button>
          </div>

        </div>
      </header>

      <Separator />

      {/* Conteúdo */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  )
}
