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
