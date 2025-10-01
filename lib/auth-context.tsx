"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "employee"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const MOCK_USERS = [
  { id: "1", email: "admin@company.com", password: "admin123", name: "Michael Chen", role: "admin" as const },
  {
    id: "2",
    email: "sarah.johnson@company.com",
    password: "employee123",
    name: "Sarah Johnson",
    role: "employee" as const,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - replace with real auth later
    const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!mockUser) {
      throw new Error("Invalid email or password")
    }

    const user = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    }

    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
