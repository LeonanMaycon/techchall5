import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState, LoginCredentials } from './auth.types'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => boolean
  logout: () => void
}

const FAKE_USER = {
  email: 'professor@planejamento.com',
  password: '123456',
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: ({ email, password }) => {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
          set({
            isAuthenticated: true,
            user: email,
          })
          return true
        }

        return false
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
