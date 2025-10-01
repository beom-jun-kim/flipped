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
  getUnreadCount,
  sendMessage,
  markAsRead,
  deleteMessage,
  initializeMockMessages,
  searchUsers,
  type Message,
  type User,
} from "@/lib/messages"
import { MessageSquare, Send, Trash2, Mail, MailOpen, Search, X, User as UserIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar"

export default function CompanyMessagesPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [newMessage, setNewMessage] = useState({ subject: "", content: "", receiverId: "", receiverName: "" })
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "company" | "worker">("all")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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
    if (!user || !newMessage.subject || !newMessage.content || !newMessage.receiverId) return

    sendMessage({
      senderId: user.id,
      senderName: user.name,
      receiverId: newMessage.receiverId,
      receiverName: newMessage.receiverName,
      subject: newMessage.subject,
      content: newMessage.content,
    })

    setNewMessage({ subject: "", content: "", receiverId: "", receiverName: "" })
    setIsComposeOpen(false)
    reloadMessages()
  }

  const handleSearch = () => {
    const results = searchUsers(searchQuery, roleFilter)
    setSearchResults(results)
  }

  const handleSelectUser = (selectedUser: User) => {
    setNewMessage({
      ...newMessage,
      receiverId: selectedUser.id,
      receiverName: selectedUser.name,
    })
    setIsSearchOpen(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleResetSearch = () => {
    setSearchQuery("")
    setRoleFilter("all")
    setSearchResults([])
  }

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read && message.receiverId === user?.id) {
      markAsRead(message.id)
      reloadMessages()
    }
  }

  // 페이지네이션 로직
  const totalPages = Math.ceil(messages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMessages = messages.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedMessage(null) // 페이지 변경 시 선택된 메시지 초기화
  }

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId)
    setSelectedMessage(null)
    reloadMessages()
  }

  if (!user) return null

  const unreadCount = getUnreadCount(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">쪽지함</h1>
            <p className="text-sm text-muted-foreground">읽지 않은 쪽지 {unreadCount}개</p>
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
                  <div className="flex gap-2">
                    <Input 
                      value={newMessage.receiverName || ""} 
                      placeholder="받는 사람을 검색하세요"
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => setIsSearchOpen(true)}
                      className="bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
                    >
                      <Search className="w-4 h-4 mr-1" />
                      회원검색
                    </Button>
                  </div>
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

          {/* 회원 검색 모달 */}
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  회원검색
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* 검색 입력 */}
                <div className="flex gap-2">
                  <Input
                    placeholder="이름 또는 아이디를 입력하세요."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    회원검색
                  </Button>
                  <Button
                    onClick={handleResetSearch}
                    variant="outline"
                    className="bg-transparent"
                  >
                    초기화
                  </Button>
                </div>

                {/* 필터 옵션 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">역할:</label>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="role"
                          value="all"
                          checked={roleFilter === "all"}
                          onChange={(e) => setRoleFilter(e.target.value as "all")}
                        />
                        <span className="text-sm">전체</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="role"
                          value="company"
                          checked={roleFilter === "company"}
                          onChange={(e) => setRoleFilter(e.target.value as "company")}
                        />
                        <span className="text-sm">기업</span>
                      </label>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="role"
                          value="worker"
                          checked={roleFilter === "worker"}
                          onChange={(e) => setRoleFilter(e.target.value as "worker")}
                        />
                        <span className="text-sm">근로자</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 검색 결과 */}
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  {searchResults.length > 0 ? (
                    <div className="space-y-1 p-2">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">
                              {user.role === "company" ? user.company : `${user.company} ${user.department}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">검색 결과가 없습니다</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">받은 쪽지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paginatedMessages.length > 0 ? (
                  paginatedMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-[#f4fdfc] ${
                        selectedMessage?.id === message.id ? "bg-[#f4fdfc] border-[#22ccb7]" : ""
                      } ${!message.read && message.receiverId === user.id ? "bg-blue-50" : ""}`}
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
                            <Send className="w-4 h-4 text-gray-400" />
                          )}
                          <p className="font-medium text-sm">
                            {message.receiverId === user.id ? message.senderName : message.receiverName}
                          </p>
                        </div>
                        {!message.read && message.receiverId === user.id && (
                          <Badge className="bg-[#22ccb7] text-white hover:bg-[#22ccb7]">새 쪽지</Badge>
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
                    <p>받은 쪽지가 없습니다</p>
                  </div>
                )}
              </div>
              
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {startIndex + 1}-{Math.min(endIndex, messages.length)} / {messages.length}개
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === page 
                            ? "bg-[#22ccb7] hover:bg-[#1ab5a3] text-white" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
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
