"use client"

export type UserRole = "worker" | "company"

export interface User {
  id: string
  username: string
  role: UserRole
  name: string
  company?: string
  department?: string
  position?: string
  disability?: string
  joinDate?: string
}

// 테스트 계정 데이터
const TEST_USERS: Record<string, { password: string; user: User }> = {
  test01: {
    password: "1234",
    user: {
      id: "test01",
      username: "test01",
      role: "worker",
      name: "김근로",
      company: "테크 컴퍼니",
      department: "개발팀",
      position: "사원",
      disability: "시각장애",
      joinDate: "2024-01-15",
    },
  },
  test02: {
    password: "1234",
    user: {
      id: "test02",
      username: "test02",
      role: "company",
      name: "박인사",
      company: "테크 컴퍼니",
      department: "인사팀",
      position: "팀장",
    },
  },
}

export function login(username: string, password: string): User | null {
  const account = TEST_USERS[username]
  if (account && account.password === password) {
    // 로컬 스토리지에 사용자 정보 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(account.user))
    }
    return account.user
  }
  return null
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      return JSON.parse(userStr)
    }
  }
  return null
}

export function getWorkers(): User[] {
  // 테스트용 근로자 목록 (실제로는 서버에서 가져와야 함)
  const workers: User[] = [
    {
      id: "test01",
      username: "test01",
      role: "worker",
      name: "김근로",
      company: "테크 컴퍼니",
      department: "개발팀",
      position: "사원",
      disability: "시각장애",
      joinDate: "2024-01-15",
    },
    {
      id: "worker001",
      username: "worker001",
      role: "worker",
      name: "이개발",
      company: "테크 컴퍼니",
      department: "개발팀",
      position: "대리",
      disability: "지체장애",
      joinDate: "2023-06-01",
    },
    {
      id: "worker002",
      username: "worker002",
      role: "worker",
      name: "박디자인",
      company: "테크 컴퍼니",
      department: "디자인팀",
      position: "사원",
      disability: "청각장애",
      joinDate: "2024-02-01",
    },
    {
      id: "worker003",
      username: "worker003",
      role: "worker",
      name: "최마케팅",
      company: "테크 컴퍼니",
      department: "마케팅팀",
      position: "대리",
      disability: "시각장애",
      joinDate: "2023-09-15",
    },
    {
      id: "worker004",
      username: "worker004",
      role: "worker",
      name: "정운영",
      company: "테크 컴퍼니",
      department: "운영팀",
      position: "사원",
      disability: "지체장애",
      joinDate: "2024-01-01",
    },
  ]
  
  return workers
}

export function register(
  username: string,
  password: string,
  role: UserRole,
  name: string,
  additionalInfo: Partial<User>,
): boolean {
  // 실제로는 서버에 저장하지만, 여기서는 로컬 스토리지에 저장
  if (typeof window !== "undefined") {
    const users = JSON.parse(localStorage.getItem("registered_users") || "{}")

    if (users[username]) {
      return false // 이미 존재하는 사용자
    }

    const newUser: User = {
      id: username,
      username,
      role,
      name,
      ...additionalInfo,
    }

    users[username] = { password, user: newUser }
    localStorage.setItem("registered_users", JSON.stringify(users))
    return true
  }
  return false
}
