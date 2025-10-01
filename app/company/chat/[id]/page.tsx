"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getChatRooms, getChatMessages, sendMessage, markRoomAsRead, type ChatRoom, type ChatMessage } from "@/lib/chat"
import { ArrowLeft, Search, User, MessageSquarePlus, Paperclip, Send } from "lucide-react"

export default function CompanyChatDetailPage() {
  const router = useRouter()
  const params = useParams()
  const user = useMemo(() => getCurrentUser(), [])
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    const roomId = params.id as string
    const rooms = getChatRooms()
    const room = rooms.find(r => r.id === roomId)
    
    if (!room) {
      router.push("/company/chat")
      return
    }

    setChatRoom(room)
    markRoomAsRead(roomId)
    
    const roomMessages = getChatMessages(roomId)
    setMessages(roomMessages)
  }, [user, params.id])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatRoom || !user) return

    const sentMessage = sendMessage(chatRoom.id, user.id, user.name, newMessage.trim())
    setMessages(prev => [...prev, sentMessage])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long"
    })
  }

  if (!user || !chatRoom) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CompanyHeader />

      {/* Chat Header */}
      <div className="px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/company/chat")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold">채팅</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/20 text-white"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/20 text-white"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/20 text-white"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      </div>

      {/* Chat Info */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h2 className="font-semibold">{chatRoom.name}</h2>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const isSystem = message.type === "system"
            const isOwn = message.senderId === user.id
            const showDate = index === 0 || 
              new Date(message.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                )}
                
                {isSystem ? (
                  <div className="text-center">
                    <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full inline-block">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                      {!isOwn && (
                        <div className="text-sm text-gray-600 mb-1">{message.senderName}</div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwn
                            ? "bg-[#22ccb7] text-white"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                        {formatMessageTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            className="flex-1"
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
