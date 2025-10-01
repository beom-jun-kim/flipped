"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  getUserMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
  initializeMockMessages,
  type Message,
} from "@/lib/messages"
import { MessageSquare, Send, Trash2, Mail, MailOpen } from "lucide-react"
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar"

export default function CompanyMessagesPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({
    receiverId: "test01",
    receiverName: "김민수",
    subject: "",
    content: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    initializeMockMessages()
    const userMessages = getUserMessages(user.id)
    setMessages(userMessages)
  }, [user])

  const reloadMessages = () => {
    if (!user) return
    const userMessages = getUserMessages(user.id)
    setMessages(userMessages)
  }

  const handleSendMessage = () => {
    if (!user || !newMessage.subject || !newMessage.content) return

    sendMessage({
      senderId: user.id,
      senderName: user.name,
      receiverId: newMessage.receiverId,
      receiverName: newMessage.receiverName,
      subject: newMessage.subject,
      content: newMessage.content,
    })

    setNewMessage({
      receiverId: "test01",
      receiverName: "김민수",
      subject: "",
      content: "",
    })
    setIsComposeOpen(false)
    reloadMessages()
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read && message.receiverId === user?.id) {
      markAsRead(message.id)
      reloadMessages()
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId)
    setSelectedMessage(null)
    reloadMessages()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">쪽지함</h1>
            <p className="text-sm text-muted-foreground">직원과 메시지를 주고받으세요</p>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#22ccb7] hover:bg-[#1ab5a3] text-white cursor-pointer">
                <Send className="w-4 h-4 mr-2" />
                쪽지 보내기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 쪽지 작성</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">받는 사람</label>
                  <Select
                    value={newMessage.receiverId}
                    onValueChange={(value) => {
                      const name = value === "test01" ? "김민수" : "이영희"
                      setNewMessage({ ...newMessage, receiverId: value, receiverName: name })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="test01">김민수</SelectItem>
                      <SelectItem value="worker2">이영희</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">제목</label>
                  <Input
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                    placeholder="제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">내용</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    placeholder="내용을 입력하세요"
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-[#22ccb7] hover:bg-[#1ab5a3] text-white cursor-pointer"
                  disabled={!newMessage.subject || !newMessage.content}
                >
                  <Send className="w-4 h-4 mr-2" />
                  보내기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">쪽지 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-[#f4fdfc] ${
                        selectedMessage?.id === message.id ? "bg-[#f4fdfc] border-[#22ccb7]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {message.receiverId === user.id ? (
                            message.read ? (
                              <MailOpen className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Mail className="w-4 h-4 text-[#22ccb7]" />
                            )
                          ) : (
                            <Send className="w-4 h-4 text-[#22ccb7]" />
                          )}
                          <p className="font-medium text-sm">
                            {message.receiverId === user.id ? message.senderName : message.receiverName}
                          </p>
                        </div>
                        {message.senderId === user.id && (
                          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">보낸 쪽지</Badge>
                        )}
                      </div>
                      <p className="font-medium mb-1">{message.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>쪽지가 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Detail */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">쪽지 내용</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="pb-4 border-b">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {selectedMessage.receiverId === user.id ? "보낸 사람" : "받는 사람"}
                        </p>
                        <p className="font-medium">
                          {selectedMessage.receiverId === user.id
                            ? selectedMessage.senderName
                            : selectedMessage.receiverName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedMessage.timestamp).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">{selectedMessage.subject}</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>쪽지를 선택하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AccessibilityToolbar />
    </div>
  )
}
