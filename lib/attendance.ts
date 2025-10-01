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

// 초기 데이터 생성 (테스트용)
export function initializeMockAttendance(): void {
  if (typeof window === "undefined") return

  // 항상 빈 배열로 초기화하여 오늘 기록이 없는 상태로 시작
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify([]))
}
