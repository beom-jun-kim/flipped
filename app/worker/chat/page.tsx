"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { initializeMockChatData, getChatRooms, markRoomAsRead, type ChatRoom } from "@/lib/chat"
import { ArrowLeft, Search, User, MessageSquare, MessageSquarePlus } from "lucide-react"

export default function WorkerChatListPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard")
      return
    }

    initializeMockChatData()
    const rooms = getChatRooms()
    setChatRooms(rooms)
  }, [user])

  const handleRoomClick = (room: ChatRoom) => {
    markRoomAsRead(room.id)
    router.push(`/worker/chat/${room.id}`)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">채팅목록</h1>
          </div>
          
          {/* <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-100"
            >
              <MessageSquarePlus className="w-4 h-4" />
            </Button>
          </div> */}
        </div>

        {/* Chat Rooms List */}
        <div className="space-y-2">
          {chatRooms.length > 0 ? (
            chatRooms.map((room) => (
              <Card
                key={room.id}
                className="border-gray-200 cursor-pointer hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
                onClick={() => handleRoomClick(room)}
              >
                <CardContent>
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    
                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-lg truncate">{room.name}</h3>
                        <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                          {room.lastMessageTime?.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {room.lastMessage || "메시지가 없습니다"}
                      </p>
                    </div>
                    
                    {/* Unread Count */}
                    {/* {room.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-[#22ccb7] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {room.unreadCount}
                      </div>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">채팅방이 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
