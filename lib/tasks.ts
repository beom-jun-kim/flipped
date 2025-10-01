"use client"

export interface Task {
  id: string
  assignedTo: string
  assignedToName: string
  assignedBy: string
  assignedByName: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  createdAt: string
}

const TASKS_KEY = "tasks"

export function getTasks(): Task[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(TASKS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveTask(task: Task): void {
  if (typeof window === "undefined") return
  const tasks = getTasks()
  const existingIndex = tasks.findIndex((t) => t.id === task.id)

  if (existingIndex >= 0) {
    tasks[existingIndex] = task
  } else {
    tasks.push(task)
  }

  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function createTask(
  assignedTo: string,
  assignedToName: string,
  assignedBy: string,
  assignedByName: string,
  title: string,
  description: string,
  priority: Task["priority"],
  dueDate: string,
): Task {
  const task: Task = {
    id: `task-${Date.now()}`,
    assignedTo,
    assignedToName,
    assignedBy,
    assignedByName,
    title,
    description,
    priority,
    status: "pending",
    dueDate,
    createdAt: new Date().toISOString(),
  }

  saveTask(task)
  return task
}

export function getUserTasks(userId: string): Task[] {
  const tasks = getTasks()
  return tasks.filter((t) => t.assignedTo === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function updateTaskStatus(taskId: string, status: Task["status"]): void {
  const tasks = getTasks()
  const task = tasks.find((t) => t.id === taskId)
  if (task) {
    task.status = status
    saveTask(task)
  }
}

export function getAllTasks(): Task[] {
  const tasks = getTasks()
  return tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function deleteTask(taskId: string): void {
  if (typeof window === "undefined") return
  const tasks = getTasks()
  const filteredTasks = tasks.filter((t) => t.id !== taskId)
  localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks))
}

// 더미 데이터 초기화 함수
export function initializeMockTasks(): void {
  if (typeof window === "undefined") return
  
  const existingTasks = getTasks()
  if (existingTasks.length > 0) return // 이미 데이터가 있으면 초기화하지 않음

  const mockTasks: Task[] = [
    {
      id: "task-1",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "웹사이트 UI 개선 작업",
      description: "메인 페이지의 사용자 인터페이스를 개선하고 접근성을 향상시키는 작업입니다. 색상 대비를 높이고 키보드 네비게이션을 개선해야 합니다.",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-25",
      createdAt: "2024-01-15T09:00:00.000Z",
    },
    {
      id: "task-2",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "데이터베이스 정리",
      description: "사용하지 않는 데이터를 정리하고 성능을 최적화하는 작업입니다. 백업 후 진행해야 합니다.",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-01-30",
      createdAt: "2024-01-10T14:30:00.000Z",
    },
    {
      id: "task-3",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "문서화 작업",
      description: "새로운 기능에 대한 사용자 매뉴얼을 작성하고 API 문서를 업데이트하는 작업입니다.",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-20",
      createdAt: "2024-01-05T11:15:00.000Z",
    },
    {
      id: "task-4",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "보안 점검 및 업데이트",
      description: "시스템의 보안 취약점을 점검하고 필요한 보안 패치를 적용하는 작업입니다.",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-28",
      createdAt: "2024-01-12T16:45:00.000Z",
    },
    {
      id: "task-5",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "성능 모니터링 도구 설정",
      description: "애플리케이션의 성능을 모니터링할 수 있는 도구를 설정하고 대시보드를 구성하는 작업입니다.",
      priority: "medium",
      status: "in-progress",
      dueDate: "2024-02-05",
      createdAt: "2024-01-08T10:20:00.000Z",
    },
    {
      id: "task-6",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "코드 리뷰 및 리팩토링",
      description: "기존 코드의 품질을 개선하고 중복 코드를 제거하는 리팩토링 작업입니다.",
      priority: "medium",
      status: "pending",
      dueDate: "2024-02-10",
      createdAt: "2024-01-14T13:30:00.000Z",
    },
    {
      id: "task-7",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "사용자 피드백 분석",
      description: "최근 수집된 사용자 피드백을 분석하고 개선사항을 도출하는 작업입니다.",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-18",
      createdAt: "2024-01-03T15:00:00.000Z",
    },
    {
      id: "task-8",
      assignedTo: "test01",
      assignedToName: "김근로",
      assignedBy: "test02",
      assignedByName: "박인사",
      title: "모바일 앱 테스트",
      description: "새로 개발된 모바일 앱의 기능을 테스트하고 버그를 찾아 수정하는 작업입니다.",
      priority: "high",
      status: "pending",
      dueDate: "2024-02-01",
      createdAt: "2024-01-16T09:45:00.000Z",
    }
  ]

  localStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks))
}
