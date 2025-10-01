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
    // 기업이 받은 메시지들 (근로자 → 기업)
    {
      id: "msg1",
      senderId: "test01",
      senderName: "김근로",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "연차 신청 요청",
      content: "안녕하세요. 다음 주 월요일부터 3일간 연차를 신청하고 싶습니다. 업무 일정을 확인해주시고 승인해주시면 감사하겠습니다.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "msg2",
      senderId: "user-001",
      senderName: "강유신",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "업무 관련 문의",
      content: "새로운 프로젝트에 대한 업무 지시를 받았는데, 몇 가지 질문이 있습니다. 언제 시간이 되시면 상담 가능할까요?",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "msg3",
      senderId: "user-002",
      senderName: "양우석",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "출퇴근 시간 조정 요청",
      content: "개인 사정으로 인해 출근 시간을 9시에서 10시로 조정하고 싶습니다. 가능한지 확인해주세요.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg4",
      senderId: "user-003",
      senderName: "정재훈",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "업무일지 제출 완료",
      content: "이번 주 업무일지를 제출했습니다. 확인 부탁드립니다. 추가로 필요한 사항이 있으시면 말씀해주세요.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg5",
      senderId: "user-004",
      senderName: "김민수",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "입사서류 제출 완료",
      content: "요청하신 입사서류들을 모두 제출했습니다. 혹시 추가로 필요한 서류가 있으시면 알려주세요.",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg6",
      senderId: "user-005",
      senderName: "박지영",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "회의 일정 변경 요청",
      content: "내일 예정된 마케팅 회의 시간을 오후 2시에서 3시로 변경하고 싶습니다. 다른 팀원들과 조율이 필요합니다.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg7",
      senderId: "user-006",
      senderName: "이준호",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "디자인 리소스 요청",
      content: "새로운 프로젝트를 위한 디자인 리소스가 필요합니다. 어떤 방향으로 진행하면 좋을지 조언 부탁드립니다.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg8",
      senderId: "user-007",
      senderName: "최수진",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "개발 환경 설정 문의",
      content: "새로운 개발 환경 설정에 대해 문의드립니다. 어떤 도구를 사용해야 하는지 가이드라인을 받을 수 있을까요?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg9",
      senderId: "user-008",
      senderName: "정민호",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "코드 리뷰 요청",
      content: "작성한 코드에 대한 리뷰를 받고 싶습니다. 언제 시간이 되시면 확인해주실 수 있을까요?",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg10",
      senderId: "user-009",
      senderName: "홍길동",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "인사 관련 제안",
      content: "팀원들의 업무 효율성을 높이기 위한 몇 가지 제안사항이 있습니다. 검토해보시고 의견 주시면 감사하겠습니다.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg11",
      senderId: "user-010",
      senderName: "김영희",
      receiverId: "company1",
      receiverName: "테크 컴퍼니",
      subject: "마케팅 캠페인 결과 보고",
      content: "지난 주 진행한 마케팅 캠페인의 결과를 정리했습니다. 성과가 기대 이상이었습니다. 자세한 내용은 첨부 파일을 확인해주세요.",
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    
    // 기업이 보낸 메시지들 (기업 → 근로자)
    {
      id: "msg12",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "test01",
      receiverName: "김근로",
      subject: "새로운 업무 지시",
      content: "새로운 프로젝트에 대한 업무 지시를 드립니다. 자세한 내용은 업무지시 페이지에서 확인해주세요.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: "msg13",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-001",
      receiverName: "강유신",
      subject: "회의 일정 안내",
      content: "내일 오후 2시에 팀 회의가 예정되어 있습니다. 참석 가능하신지 확인 부탁드립니다.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg14",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-002",
      receiverName: "양우석",
      subject: "출퇴근 시간 조정 승인",
      content: "요청하신 출퇴근 시간 조정을 승인했습니다. 10시 출근으로 변경되었습니다.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg15",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-003",
      receiverName: "정재훈",
      subject: "업무일지 피드백",
      content: "제출해주신 업무일지를 확인했습니다. 잘 작성해주셨습니다. 수고하셨습니다!",
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg16",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-004",
      receiverName: "김민수",
      subject: "입사서류 확인 완료",
      content: "제출해주신 입사서류들을 모두 확인했습니다. 모든 서류가 정상적으로 제출되었습니다.",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg17",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-005",
      receiverName: "박지영",
      subject: "회의 일정 변경 승인",
      content: "요청하신 회의 시간 변경을 승인했습니다. 오후 3시로 변경되었습니다.",
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg18",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-006",
      receiverName: "이준호",
      subject: "디자인 리소스 제공",
      content: "요청하신 디자인 리소스를 제공해드립니다. 첨부 파일을 확인해주세요.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg19",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-007",
      receiverName: "최수진",
      subject: "개발 환경 가이드 제공",
      content: "새로운 개발 환경 설정 가이드를 제공해드립니다. 문의사항이 있으시면 언제든 연락주세요.",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg20",
      senderId: "company1",
      senderName: "테크 컴퍼니",
      receiverId: "user-008",
      receiverName: "정민호",
      subject: "코드 리뷰 완료",
      content: "제출해주신 코드를 리뷰했습니다. 전반적으로 잘 작성되었습니다. 몇 가지 개선사항이 있으니 확인해주세요.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
