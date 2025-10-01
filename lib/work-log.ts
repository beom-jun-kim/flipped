"use client"

export interface WorkLog {
  id: string
  userId: string
  userName: string
  date: string
  title: string
  content: string
  tasks: string[]
  feedback?: string
  createdAt: string
}

const WORK_LOG_KEY = "work_logs"

export function getWorkLogs(): WorkLog[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(WORK_LOG_KEY)
  return data ? JSON.parse(data) : []
}

export function saveWorkLog(log: WorkLog): void {
  if (typeof window === "undefined") return
  const logs = getWorkLogs()
  const existingIndex = logs.findIndex((l) => l.id === log.id)

  if (existingIndex >= 0) {
    logs[existingIndex] = log
  } else {
    logs.push(log)
  }

  localStorage.setItem(WORK_LOG_KEY, JSON.stringify(logs))
}

export function createWorkLog(
  userId: string,
  userName: string,
  title: string,
  content: string,
  tasks: string[],
): WorkLog {
  const now = new Date()
  const log: WorkLog = {
    id: `log-${Date.now()}`,
    userId,
    userName,
    date: now.toISOString().split("T")[0],
    title,
    content,
    tasks,
    createdAt: now.toISOString(),
  }

  saveWorkLog(log)
  return log
}

export function getUserWorkLogs(userId: string): WorkLog[] {
  const logs = getWorkLogs()
  return logs.filter((l) => l.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getAllWorkLogs(): WorkLog[] {
  const logs = getWorkLogs()
  return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function addFeedback(logId: string, feedback: string): void {
  const logs = getWorkLogs()
  const log = logs.find((l) => l.id === logId)
  if (log) {
    log.feedback = feedback
    saveWorkLog(log)
  }
}

// 더미 데이터 생성
function generateMockWorkLogs(): WorkLog[] {
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
  const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)

  const employees = [
    { id: "emp001", name: "김철수" },
    { id: "emp002", name: "이영희" },
    { id: "emp003", name: "박민수" },
    { id: "emp004", name: "정수진" },
    { id: "emp005", name: "최동현" },
  ]

  const mockLogs: WorkLog[] = [
    {
      id: "log-001",
      userId: "emp001",
      userName: "김철수",
      date: today.toISOString().split("T")[0],
      title: "프로젝트 A 개발 진행",
      content: "오늘은 프로젝트 A의 사용자 인증 기능을 구현했습니다. JWT 토큰 기반 인증 시스템을 구축하고, 로그인/로그아웃 기능을 완성했습니다. 보안을 위해 비밀번호 해싱과 토큰 만료 시간 설정도 추가했습니다.",
      tasks: [
        "JWT 토큰 인증 시스템 구현",
        "로그인/로그아웃 API 개발",
        "비밀번호 해싱 기능 추가",
        "토큰 만료 시간 설정"
      ],
      feedback: "인증 시스템 구현이 잘 되었네요. 보안 측면에서 추가로 2FA 인증도 고려해보시기 바랍니다.",
      createdAt: today.toISOString()
    },
    {
      id: "log-002",
      userId: "emp002",
      userName: "이영희",
      date: today.toISOString().split("T")[0],
      title: "UI/UX 디자인 개선",
      content: "사용자 인터페이스 개선 작업을 진행했습니다. 기존 디자인의 접근성 문제를 해결하고, 모바일 반응형 디자인을 최적화했습니다. 사용자 피드백을 반영하여 버튼 크기와 색상 대비를 조정했습니다.",
      tasks: [
        "모바일 반응형 디자인 최적화",
        "접근성 가이드라인 적용",
        "사용자 피드백 반영",
        "색상 대비 개선"
      ],
      createdAt: today.toISOString()
    },
    {
      id: "log-003",
      userId: "emp003",
      userName: "박민수",
      date: yesterday.toISOString().split("T")[0],
      title: "데이터베이스 최적화",
      content: "시스템 성능 개선을 위해 데이터베이스 쿼리를 최적화했습니다. 인덱스를 추가하고, 복잡한 쿼리를 단순화하여 응답 시간을 30% 단축했습니다. 또한 데이터 백업 시스템도 점검했습니다.",
      tasks: [
        "데이터베이스 인덱스 추가",
        "복잡한 쿼리 최적화",
        "성능 모니터링 설정",
        "백업 시스템 점검"
      ],
      feedback: "성능 개선이 눈에 띄게 좋아졌습니다. 정기적인 성능 모니터링을 계속 진행해주세요.",
      createdAt: yesterday.toISOString()
    },
    {
      id: "log-004",
      userId: "emp004",
      userName: "정수진",
      date: yesterday.toISOString().split("T")[0],
      title: "고객 지원 시스템 구축",
      content: "고객 문의 처리를 위한 티켓 시스템을 구축했습니다. 실시간 채팅 기능과 이메일 알림 시스템을 연동하여 고객 응답 시간을 단축했습니다. FAQ 시스템도 함께 구축했습니다.",
      tasks: [
        "티켓 시스템 구축",
        "실시간 채팅 기능 개발",
        "이메일 알림 시스템 연동",
        "FAQ 시스템 구축"
      ],
      createdAt: yesterday.toISOString()
    },
    {
      id: "log-005",
      userId: "emp005",
      userName: "최동현",
      date: twoDaysAgo.toISOString().split("T")[0],
      title: "API 문서화 및 테스트",
      content: "새로 개발한 API들의 문서화 작업을 완료했습니다. Swagger를 활용하여 자동 문서화를 구축하고, API 테스트 케이스를 작성했습니다. 개발팀과의 협업을 위해 API 가이드라인도 정리했습니다.",
      tasks: [
        "Swagger API 문서화",
        "API 테스트 케이스 작성",
        "API 가이드라인 정리",
        "개발팀 협업 문서 작성"
      ],
      feedback: "문서화가 매우 체계적으로 잘 되어있습니다. 다른 팀원들도 참고할 수 있도록 공유해주세요.",
      createdAt: twoDaysAgo.toISOString()
    },
    {
      id: "log-006",
      userId: "emp001",
      userName: "김철수",
      date: twoDaysAgo.toISOString().split("T")[0],
      title: "보안 취약점 점검",
      content: "시스템 보안 점검을 진행했습니다. OWASP Top 10 가이드라인을 기준으로 취약점을 점검하고, SQL 인젝션과 XSS 공격에 대한 방어 코드를 추가했습니다. 보안 정책 문서도 업데이트했습니다.",
      tasks: [
        "OWASP Top 10 취약점 점검",
        "SQL 인젝션 방어 코드 추가",
        "XSS 공격 방어 코드 추가",
        "보안 정책 문서 업데이트"
      ],
      createdAt: twoDaysAgo.toISOString()
    },
    {
      id: "log-007",
      userId: "emp002",
      userName: "이영희",
      date: threeDaysAgo.toISOString().split("T")[0],
      title: "사용자 경험 분석",
      content: "사용자 행동 데이터를 분석하여 UX 개선점을 도출했습니다. Google Analytics와 Hotjar를 활용하여 사용자 여정을 분석하고, 이탈률이 높은 페이지들을 식별했습니다. 개선 방안을 제시했습니다.",
      tasks: [
        "Google Analytics 데이터 분석",
        "Hotjar 사용자 행동 분석",
        "사용자 여정 매핑",
        "이탈률 높은 페이지 식별"
      ],
      createdAt: threeDaysAgo.toISOString()
    }
  ]

  return mockLogs
}

// 초기 더미 데이터 생성
export function initializeMockWorkLogs(): void {
  if (typeof window === "undefined") return

  const existingData = localStorage.getItem(WORK_LOG_KEY)
  if (!existingData || JSON.parse(existingData).length === 0) {
    const mockData = generateMockWorkLogs()
    localStorage.setItem(WORK_LOG_KEY, JSON.stringify(mockData))
  }
}
