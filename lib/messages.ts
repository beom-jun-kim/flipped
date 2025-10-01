export interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  subject: string
  content: string
  timestamp: string
  read: boolean
}

export interface User {
  id: string
  name: string
  role: "company" | "worker"
  company?: string
  department?: string
}

const MESSAGES_KEY = "hr_messages"

export function initializeMockMessages() {
  if (typeof window === "undefined") return

  const existing = localStorage.getItem(MESSAGES_KEY)
  if (existing) return

  const mockMessages: Message[] = [
    {
      id: "msg1",
      senderId: "company1",
      senderName: "인사팀",
      receiverId: "test01",
      receiverName: "김민수",
      subject: "연차 신청 승인 안내",
      content: "신청하신 연차가 승인되었습니다. 좋은 휴가 보내세요!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "msg2",
      senderId: "company1",
      senderName: "인사팀",
      receiverId: "test01",
      receiverName: "김민수",
      subject: "업무일지 피드백",
      content: "어제 작성하신 업무일지 잘 확인했습니다. 수고하셨습니다!",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ]

  localStorage.setItem(MESSAGES_KEY, JSON.stringify(mockMessages))
}

export function getMessages(): Message[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(MESSAGES_KEY)
  return data ? JSON.parse(data) : []
}

export function getUserMessages(userId: string): Message[] {
  const messages = getMessages()
  return messages
    .filter((msg) => msg.senderId === userId || msg.receiverId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function getUnreadCount(userId: string): number {
  const messages = getMessages()
  return messages.filter((msg) => msg.receiverId === userId && !msg.read).length
}

export function sendMessage(message: Omit<Message, "id" | "timestamp" | "read">): Message {
  const messages = getMessages()
  const newMessage: Message = {
    ...message,
    id: `msg${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
  }
  messages.push(newMessage)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return newMessage
}

export function markAsRead(messageId: string) {
  const messages = getMessages()
  const message = messages.find((msg) => msg.id === messageId)
  if (message) {
    message.read = true
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  }
}

export function deleteMessage(messageId: string) {
  const messages = getMessages()
  const filtered = messages.filter((msg) => msg.id !== messageId)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered))
}

// 회원 검색 관련 함수들
export function getMockUsers(): User[] {
  return [
    { id: "admin", name: "관리자", role: "company", company: "관리자" },
    { id: "vdream", name: "vdream", role: "company", company: "브이드림" },
    { id: "user-001", name: "강유신", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "user-002", name: "양우석", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "user-003", name: "정재훈", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "user-004", name: "김민수", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "user-005", name: "박지영", role: "worker", company: "테크 컴퍼니", department: "마케팅팀" },
    { id: "user-006", name: "이준호", role: "worker", company: "테크 컴퍼니", department: "디자인팀" },
    { id: "user-007", name: "최수진", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "user-008", name: "정민호", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "user-009", name: "홍길동", role: "worker", company: "테크 컴퍼니", department: "인사팀" },
    { id: "user-010", name: "김영희", role: "worker", company: "테크 컴퍼니", department: "마케팅팀" },
    { id: "test01", name: "김근로", role: "worker", company: "테크 컴퍼니", department: "개발팀" },
    { id: "test02", name: "박인사", role: "company", company: "테크 컴퍼니", department: "인사팀" },
  ]
}

export function searchUsers(query: string, roleFilter?: "all" | "company" | "worker"): User[] {
  const users = getMockUsers()
  let filtered = users

  // 역할 필터 적용
  if (roleFilter && roleFilter !== "all") {
    filtered = filtered.filter(user => user.role === roleFilter)
  }

  // 검색어 필터 적용
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(searchTerm) || 
      user.id.toLowerCase().includes(searchTerm) ||
      (user.company && user.company.toLowerCase().includes(searchTerm))
    )
  }

  return filtered
}
