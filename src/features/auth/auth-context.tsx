import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "./auth.api"

import type {
  LoginRequest,
  UserResponse,
} from "./auth.types"

interface AuthContextValue {
  user: UserResponse | null
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<UserResponse | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser =
          await getCurrentUser()

        setUser(currentUser)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  async function login(
    credentials: LoginRequest,
  ): Promise<void> {
    const authenticatedUser =
      await loginRequest(credentials)

    setUser(authenticatedUser)
  }

  async function logout(): Promise<void> {
    await logoutRequest()

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider.",
    )
  }

  return context
}