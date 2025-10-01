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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#f4fdfc] rounded-lg cursor-pointer transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5 text-[#22ccb7]" />
            </button>
            <h1 className="text-xl font-bold text-[#22ccb7]">기업 관리자</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.department}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 border-[#22ccb7] text-[#22ccb7] hover:bg-[#f4fdfc] cursor-pointer bg-transparent"
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
