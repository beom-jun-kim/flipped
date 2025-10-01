"use client"

export interface LeaveRequest {
  id: string
  userId: string
  userName: string
  type: "annual" | "sick" | "half-day"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

const LEAVE_KEY = "leave_requests"

export function getLeaveRequests(): LeaveRequest[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(LEAVE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveLeaveRequest(request: LeaveRequest): void {
  if (typeof window === "undefined") return
  const requests = getLeaveRequests()
  const existingIndex = requests.findIndex((r) => r.id === request.id)

  if (existingIndex >= 0) {
    requests[existingIndex] = request
  } else {
    requests.push(request)
  }

  localStorage.setItem(LEAVE_KEY, JSON.stringify(requests))
}

export function createLeaveRequest(
  userId: string,
  userName: string,
  type: LeaveRequest["type"],
  startDate: string,
  endDate: string,
  reason: string,
): LeaveRequest {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const request: LeaveRequest = {
    id: `leave-${Date.now()}`,
    userId,
    userName,
    type,
    startDate,
    endDate,
    days: type === "half-day" ? 0.5 : days,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  saveLeaveRequest(request)
  return request
}

export function getUserLeaveRequests(userId: string): LeaveRequest[] {
  const requests = getLeaveRequests()
  return requests.filter((r) => r.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getAllLeaveRequests(): LeaveRequest[] {
  const requests = getLeaveRequests()
  return requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function updateLeaveStatus(requestId: string, status: "approved" | "rejected", reviewedBy: string): void {
  const requests = getLeaveRequests()
  const request = requests.find((r) => r.id === requestId)
  if (request) {
    request.status = status
    request.reviewedBy = reviewedBy
    request.reviewedAt = new Date().toISOString()
    saveLeaveRequest(request)
  }
}

// 더미 데이터 생성
function generateMockLeaveRequests(): LeaveRequest[] {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
  const threeWeeksAgo = new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000)

  const employees = [
    { id: "emp001", name: "김철수" },
    { id: "emp002", name: "이영희" },
    { id: "emp003", name: "박민수" },
    { id: "emp004", name: "정수진" },
    { id: "emp005", name: "최동현" },
  ]

  const mockRequests: LeaveRequest[] = [
    {
      id: "leave-001",
      userId: "emp001",
      userName: "김철수",
      type: "annual",
      startDate: tomorrow.toISOString().split("T")[0],
      endDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      days: 3,
      reason: "가족 여행을 위해 연차를 신청합니다. 아이들과 함께 제주도 여행을 계획하고 있습니다.",
      status: "pending",
      createdAt: today.toISOString()
    },
    {
      id: "leave-002",
      userId: "emp002",
      userName: "이영희",
      type: "sick",
      startDate: today.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
      days: 1,
      reason: "감기로 인한 몸살 증상으로 병가를 신청합니다. 빠른 회복 후 복귀하겠습니다.",
      status: "pending",
      createdAt: today.toISOString()
    },
    {
      id: "leave-003",
      userId: "emp003",
      userName: "박민수",
      type: "half-day",
      startDate: nextWeek.toISOString().split("T")[0],
      endDate: nextWeek.toISOString().split("T")[0],
      days: 0.5,
      reason: "병원 예약으로 인한 반차 신청입니다. 오후에만 휴가를 사용하겠습니다.",
      status: "pending",
      createdAt: today.toISOString()
    },
    {
      id: "leave-004",
      userId: "emp004",
      userName: "정수진",
      type: "annual",
      startDate: twoWeeksAgo.toISOString().split("T")[0],
      endDate: new Date(twoWeeksAgo.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      days: 5,
      reason: "해외 여행을 위한 연차 신청입니다. 유럽 여행을 계획하고 있습니다.",
      status: "approved",
      reviewedBy: "관리자",
      reviewedAt: new Date(twoWeeksAgo.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(twoWeeksAgo.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "leave-005",
      userId: "emp005",
      userName: "최동현",
      type: "annual",
      startDate: threeWeeksAgo.toISOString().split("T")[0],
      endDate: new Date(threeWeeksAgo.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      days: 3,
      reason: "개인적인 사정으로 인한 연차 신청입니다.",
      status: "rejected",
      reviewedBy: "관리자",
      reviewedAt: new Date(threeWeeksAgo.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(threeWeeksAgo.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "leave-006",
      userId: "emp001",
      userName: "김철수",
      type: "sick",
      startDate: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      endDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      days: 2,
      reason: "독감으로 인한 병가 신청입니다. 완전히 회복 후 복귀하겠습니다.",
      status: "approved",
      reviewedBy: "관리자",
      reviewedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "leave-007",
      userId: "emp002",
      userName: "이영희",
      type: "half-day",
      startDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      endDate: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      days: 0.5,
      reason: "치과 예약으로 인한 반차 신청입니다.",
      status: "approved",
      reviewedBy: "관리자",
      reviewedAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  return mockRequests
}

// 초기 더미 데이터 생성
export function initializeMockLeaveRequests(): void {
  if (typeof window === "undefined") return

  const existingData = localStorage.getItem(LEAVE_KEY)
  if (!existingData || JSON.parse(existingData).length === 0) {
    const mockData = generateMockLeaveRequests()
    localStorage.setItem(LEAVE_KEY, JSON.stringify(mockData))
  }
}
