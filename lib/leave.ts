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
