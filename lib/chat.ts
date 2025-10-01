export interface ChatRoom {
  id: string
  name: string
  participants: string[]
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  type: "direct" | "group"
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "system"
}

const CHAT_ROOMS_KEY = "hr_chat_rooms"
const CHAT_MESSAGES_KEY = "hr_chat_messages"

export function initializeMockChatData() {
  if (typeof window === "undefined") return

  const existingRooms = localStorage.getItem(CHAT_ROOMS_KEY)
  const existingMessages = localStorage.getItem(CHAT_MESSAGES_KEY)
  
  if (existingRooms && existingMessages) return

  const mockRooms: ChatRoom[] = [
    {
      id: "room1",
      name: "admin (관리자)",
      participants: ["company1", "admin"],
      lastMessage: "테스트채팅",
      lastMessageTime: "2024-12-18",
      unreadCount: 0,
      type: "direct"
    },
    {
      id: "room2", 
      name: "test02 (김드림)",
      participants: ["company1", "test02"],
      lastMessage: "테스트기업회원 : 귀엽네여",
      lastMessageTime: "2025-08-25",
      unreadCount: 1,
      type: "direct"
    },
    {
      id: "room3",
      name: "test003 (테스트003)",
      participants: ["company1", "test003"],
      lastMessage: "테스트기업회원 : 테스트",
      lastMessageTime: "2024-12-18",
      unreadCount: 0,
      type: "direct"
    },
    {
      id: "room4",
      name: "테스트기업회원 : 테스트 진행중",
      participants: ["company1", "test04"],
      lastMessage: "테스트기업회원 : hola",
      lastMessageTime: "2024-12-17",
      unreadCount: 2,
      type: "direct"
    },
    {
      id: "room5",
      name: "테스트기업회원 : test",
      participants: ["company1", "test05"],
      lastMessage: "테스트기업회원 : 안녕하세요",
      lastMessageTime: "2024-12-16",
      unreadCount: 0,
      type: "direct"
    }
  ]

  const mockMessages: ChatMessage[] = [
    // room1 메시지들
    {
      id: "msg1",
      roomId: "room1",
      senderId: "system",
      senderName: "시스템",
      content: "테스트기업회원 님이 들어왔습니다.",
      timestamp: "2023-05-03",
      type: "system"
    },
    {
      id: "msg2",
      roomId: "room1", 
      senderId: "system",
      senderName: "시스템",
      content: "관리자 님이 들어왔습니다.",
      timestamp: "2023-05-03",
      type: "system"
    },
    {
      id: "msg3",
      roomId: "room1",
      senderId: "admin",
      senderName: "admin 관리자",
      content: "테스트채팅",
      timestamp: "2024-12-18",
      type: "text"
    },
    {
      id: "msg4",
      roomId: "room1",
      senderId: "company1",
      senderName: "테스트기업회원",
      content: "테스트",
      timestamp: "2024-12-18",
      type: "text"
    },
    
    // room2 메시지들
    {
      id: "msg5",
      roomId: "room2",
      senderId: "test02",
      senderName: "test02 김드림",
      content: "테스트기업회원 : 귀엽네여",
      timestamp: "2025-08-25",
      type: "text"
    },
    
    // room3 메시지들
    {
      id: "msg6",
      roomId: "room3",
      senderId: "test003",
      senderName: "test003 테스트003",
      content: "테스트기업회원 : 테스트",
      timestamp: "2024-12-18",
      type: "text"
    },
    
    // room4 메시지들
    {
      id: "msg7",
      roomId: "room4",
      senderId: "test04",
      senderName: "test04 테스트기업회원",
      content: "테스트기업회원 : hola",
      timestamp: "2024-12-17",
      type: "text"
    },
    {
      id: "msg8",
      roomId: "room4",
      senderId: "test04",
      senderName: "test04 테스트기업회원",
      content: "테스트기업회원 : 안녕하세요",
      timestamp: "2024-12-17",
      type: "text"
    },
    
    // room5 메시지들
    {
      id: "msg9",
      roomId: "room5",
      senderId: "test05",
      senderName: "test05 테스트기업회원",
      content: "테스트기업회원 : 안녕하세요",
      timestamp: "2024-12-16",
      type: "text"
    }
  ]

  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(mockRooms))
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(mockMessages))
}

export function getChatRooms(): ChatRoom[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CHAT_ROOMS_KEY)
  return data ? JSON.parse(data) : []
}

export function getChatMessages(roomId: string): ChatMessage[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(CHAT_MESSAGES_KEY)
  const messages = data ? JSON.parse(data) : []
  return messages
    .filter((msg: ChatMessage) => msg.roomId === roomId)
    .sort((a: ChatMessage, b: ChatMessage) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export function sendMessage(roomId: string, senderId: string, senderName: string, content: string): ChatMessage {
  const messages = getChatMessages("")
  const newMessage: ChatMessage = {
    id: `msg${Date.now()}`,
    roomId,
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString(),
    type: "text"
  }
  
  messages.push(newMessage)
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages))
  
  // 채팅방의 마지막 메시지 업데이트
  updateChatRoomLastMessage(roomId, content, newMessage.timestamp)
  
  return newMessage
}

function updateChatRoomLastMessage(roomId: string, content: string, timestamp: string) {
  const rooms = getChatRooms()
  const room = rooms.find(r => r.id === roomId)
  if (room) {
    room.lastMessage = content
    room.lastMessageTime = new Date(timestamp).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms))
  }
}

export function markRoomAsRead(roomId: string) {
  const rooms = getChatRooms()
  const room = rooms.find(r => r.id === roomId)
  if (room) {
    room.unreadCount = 0
    localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms))
  }
}
