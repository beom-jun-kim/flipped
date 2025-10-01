"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function ChatButton() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleChatClick = () => {
    if (!user) return
    
    if (user.role === "company") {
      router.push("/company/chat")
    } else {
      router.push("/worker/chat")
    }
  }

  if (!user) return null

  return (
    <button
      onClick={handleChatClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
      aria-label="채팅 열기"
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  )
}
