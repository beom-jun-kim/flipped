"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getCurrentUser, logout } from "@/lib/auth"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function CompanyHeader() {
  const router = useRouter()
  const user = getCurrentUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  return (
    <header className="bg-[#22ccb7] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-24 bg-[#22ccb7] flex items-center justify-center">
              <img
                src="https://xn--5y2bj31c.com/static/media/logo_basic.f40d41f4044bb64fb975b46bdf59bd3b.svg"
                alt="logo"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white">{user.department}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 border-white text-white cursor-pointer bg-transparent outline-none"
              aria-label="로그아웃"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
