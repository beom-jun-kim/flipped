"use client"

export interface AttendanceRecord {
  id: string
  userId: string
  userName: string
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "late" | "leave"
  workHours?: number
}

// 로컬 스토리지 키
const ATTENDANCE_KEY = "attendance_records"

export function getAttendanceRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(ATTENDANCE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveAttendanceRecord(record: AttendanceRecord): void {
  if (typeof window === "undefined") return
  const records = getAttendanceRecords()
  const existingIndex = records.findIndex((r) => r.id === record.id)

  if (existingIndex >= 0) {
    records[existingIndex] = record
  } else {
    records.push(record)
  }

  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records))
}

export function checkIn(userId: string, userName: string): AttendanceRecord {
  const now = new Date()
  const date = now.toISOString().split("T")[0]
  const time = now.toTimeString().split(" ")[0].substring(0, 5)

  const record: AttendanceRecord = {
    id: `${userId}-${date}`,
    userId,
    userName,
    date,
    checkIn: time,
    status: time > "09:00" ? "late" : "present",
  }

  saveAttendanceRecord(record)
  return record
}

export function checkOut(userId: string): AttendanceRecord | null {
  const now = new Date()
  const date = now.toISOString().split("T")[0]
  const time = now.toTimeString().split(" ")[0].substring(0, 5)

  const records = getAttendanceRecords()
  const record = records.find((r) => r.id === `${userId}-${date}`)

  if (record && record.checkIn) {
    const checkInTime = new Date(`2000-01-01T${record.checkIn}:00`)
    const checkOutTime = new Date(`2000-01-01T${time}:00`)
    const workHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)

    record.checkOut = time
    record.workHours = Math.round(workHours * 10) / 10

    saveAttendanceRecord(record)
    return record
  }

  return null
}

export function getTodayAttendance(userId: string): AttendanceRecord | null {
  const today = new Date().toISOString().split("T")[0]
  const records = getAttendanceRecords()
  return records.find((r) => r.id === `${userId}-${today}`) || null
}

export function getUserAttendanceHistory(userId: string, limit = 10): AttendanceRecord[] {
  const records = getAttendanceRecords()
  return records
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
}

export function getAllTodayAttendance(): AttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0]
  const records = getAttendanceRecords()
  return records.filter((r) => r.date === today)
}

// 더미 데이터 생성
function generateMockAttendanceData(): AttendanceRecord[] {
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const employees = [
    { id: "emp001", name: "김철수" },
    { id: "emp002", name: "이영희" },
    { id: "emp003", name: "박민수" },
    { id: "emp004", name: "정수진" },
    { id: "emp005", name: "최동현" },
    { id: "emp006", name: "한미영" },
    { id: "emp007", name: "윤태호" },
    { id: "emp008", name: "강지은" },
    { id: "emp009", name: "임성민" },
    { id: "emp010", name: "조현우" },
    { id: "emp011", name: "서나연" },
    { id: "emp012", name: "배준호" },
    { id: "emp013", name: "오지현" },
    { id: "emp014", name: "신동욱" },
    { id: "emp015", name: "홍서영" },
  ]

  const records: AttendanceRecord[] = []

  // 오늘 출퇴근 기록
  employees.forEach((emp, index) => {
    const statuses: AttendanceRecord["status"][] = ["present", "late", "absent", "leave"]
    const status = statuses[index % statuses.length]
    
    if (status === "absent" || status === "leave") {
      records.push({
        id: `${emp.id}-${today}`,
        userId: emp.id,
        userName: emp.name,
        date: today,
        status,
      })
    } else {
      const checkIn = status === "late" ? "09:15" : "08:45"
      const checkOut = status === "late" ? "18:15" : "18:00"
      const workHours = status === "late" ? 8.0 : 8.25
      
      records.push({
        id: `${emp.id}-${today}`,
        userId: emp.id,
        userName: emp.name,
        date: today,
        checkIn,
        checkOut,
        status,
        workHours,
      })
    }
  })

  // 어제 출퇴근 기록
  employees.forEach((emp, index) => {
    const statuses: AttendanceRecord["status"][] = ["present", "present", "late", "present", "absent", "present", "present", "late", "present", "present", "leave", "present", "present", "present", "present"]
    const status = statuses[index]
    
    if (status === "absent" || status === "leave") {
      records.push({
        id: `${emp.id}-${yesterday}`,
        userId: emp.id,
        userName: emp.name,
        date: yesterday,
        status,
      })
    } else {
      const checkIn = status === "late" ? "09:20" : "08:50"
      const checkOut = status === "late" ? "18:20" : "18:05"
      const workHours = status === "late" ? 8.0 : 8.25
      
      records.push({
        id: `${emp.id}-${yesterday}`,
        userId: emp.id,
        userName: emp.name,
        date: yesterday,
        checkIn,
        checkOut,
        status,
        workHours,
      })
    }
  })

  // 2일 전 출퇴근 기록
  employees.forEach((emp, index) => {
    const statuses: AttendanceRecord["status"][] = ["present", "present", "present", "late", "present", "present", "absent", "present", "present", "late", "present", "present", "present", "present", "present"]
    const status = statuses[index]
    
    if (status === "absent" || status === "leave") {
      records.push({
        id: `${emp.id}-${twoDaysAgo}`,
        userId: emp.id,
        userName: emp.name,
        date: twoDaysAgo,
        status,
      })
    } else {
      const checkIn = status === "late" ? "09:10" : "08:55"
      const checkOut = status === "late" ? "18:10" : "18:00"
      const workHours = status === "late" ? 8.0 : 8.08
      
      records.push({
        id: `${emp.id}-${twoDaysAgo}`,
        userId: emp.id,
        userName: emp.name,
        date: twoDaysAgo,
        checkIn,
        checkOut,
        status,
        workHours,
      })
    }
  })

  // 3일 전 출퇴근 기록
  employees.forEach((emp, index) => {
    const statuses: AttendanceRecord["status"][] = ["present", "late", "present", "present", "present", "present", "present", "present", "leave", "present", "present", "present", "late", "present", "present"]
    const status = statuses[index]
    
    if (status === "absent" || status === "leave") {
      records.push({
        id: `${emp.id}-${threeDaysAgo}`,
        userId: emp.id,
        userName: emp.name,
        date: threeDaysAgo,
        status,
      })
    } else {
      const checkIn = status === "late" ? "09:25" : "08:40"
      const checkOut = status === "late" ? "18:25" : "17:55"
      const workHours = status === "late" ? 8.0 : 8.25
      
      records.push({
        id: `${emp.id}-${threeDaysAgo}`,
        userId: emp.id,
        userName: emp.name,
        date: threeDaysAgo,
        checkIn,
        checkOut,
        status,
        workHours,
      })
    }
  })

  // 4일 전 출퇴근 기록
  employees.forEach((emp, index) => {
    const statuses: AttendanceRecord["status"][] = ["present", "present", "present", "present", "late", "present", "present", "present", "present", "present", "absent", "present", "present", "present", "present"]
    const status = statuses[index]
    
    if (status === "absent" || status === "leave") {
      records.push({
        id: `${emp.id}-${fourDaysAgo}`,
        userId: emp.id,
        userName: emp.name,
        date: fourDaysAgo,
        status,
      })
    } else {
      const checkIn = status === "late" ? "09:05" : "08:50"
      const checkOut = status === "late" ? "18:05" : "18:00"
      const workHours = status === "late" ? 8.0 : 8.17
      
      records.push({
        id: `${emp.id}-${fourDaysAgo}`,
        userId: emp.id,
        userName: emp.name,
        date: fourDaysAgo,
        checkIn,
        checkOut,
        status,
        workHours,
      })
    }
  })

  return records
}

// 초기 데이터 생성 (테스트용)
export function initializeMockAttendance(): void {
  if (typeof window === "undefined") return

  const existingData = localStorage.getItem(ATTENDANCE_KEY)
  if (!existingData || JSON.parse(existingData).length === 0) {
    const mockData = generateMockAttendanceData()
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(mockData))
  }
}
