"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { type AttendanceRecord } from "@/lib/attendance"

interface CompanyAttendanceCalendarProps {
  allAttendanceRecords: AttendanceRecord[]
  onDateSelect?: (date: Date) => void
}

export function CompanyAttendanceCalendar({ allAttendanceRecords, onDateSelect }: CompanyAttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 달력의 첫 번째 날과 마지막 날 계산
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  // 달력에 표시할 날짜들 생성
  const calendarDays = []
  const current = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    calendarDays.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  // 출퇴근 기록을 날짜별로 그룹화
  const attendanceByDate = new Map<string, AttendanceRecord[]>()
  allAttendanceRecords.forEach(record => {
    const date = new Date(record.date)
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    
    if (!attendanceByDate.has(dateKey)) {
      attendanceByDate.set(dateKey, [])
    }
    attendanceByDate.get(dateKey)!.push(record)
  })

  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "정상"
      case "late":
        return "지각"
      case "absent":
        return "결근"
      case "leave":
        return "연차"
      default:
        return ""
    }
  }

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return "text-[#23CCB7]"
      case "late":
        return "text-[#23CCB7]"
      case "absent":
        return "text-[#23CCB7]"
      case "leave":
        return "text-[#23CCB7]"
      default:
        return "text-gray-600"
    }
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthNames = [
    "1", "2", "3", "4", "5", "6",
    "7", "8", "9", "10", "11", "12"
  ]

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]

  // 선택된 날짜의 출퇴근 기록 가져오기
  const getSelectedDateRecords = () => {
    if (!selectedDate) return []
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    return allAttendanceRecords.filter(record => {
      const recordDate = new Date(record.date)
      const recordDateKey = `${recordDate.getFullYear()}-${recordDate.getMonth()}-${recordDate.getDate()}`
      return recordDateKey === dateKey
    })
  }

  const selectedDateRecords = getSelectedDateRecords()

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#23CCB7]" />
            출퇴근 달력
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              {year}. {monthNames[month]}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
              const dayAttendance = attendanceByDate.get(dateKey) || []
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              const totalCount = dayAttendance.length

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    relative h-16 text-sm rounded-lg transition-colors border
                    ${isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground/50'}
                    ${isTodayDate ? 'bg-[#23CCB7]/10 border-[#23CCB7]/30' : 'border-gray-200 hover:bg-gray-100'}
                    ${dayAttendance.length > 0 ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full p-1">
                    <span className={`text-sm font-medium ${isTodayDate ? 'font-bold' : ''}`}>
                      {date.getDate()}
                    </span>
                    {dayAttendance.length > 0 && (
                      <div className="text-xs font-bold text-[#23CCB7] mt-1">
                        {totalCount}명
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* 범례 */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">범례:</p>
            <div className="flex flex-wrap gap-3">
              <span className="text-sm font-medium text-[#23CCB7]">정상 출근</span>
              <span className="text-sm font-medium text-[#23CCB7]">지각</span>
              <span className="text-sm font-medium text-[#23CCB7]">결근</span>
              <span className="text-sm font-medium text-[#23CCB7]">연차</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 출퇴근 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {selectedDate && selectedDate.toLocaleDateString("ko-KR", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric", 
                  weekday: "long" 
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedDateRecords.length > 0 ? (
              <>
                {/* 통계 요약 */}
                <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#23CCB7]">
                      {selectedDateRecords.filter(r => r.status === "present").length}
                    </div>
                    <div className="text-sm text-muted-foreground">정상</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#23CCB7]">
                      {selectedDateRecords.filter(r => r.status === "late").length}
                    </div>
                    <div className="text-sm text-muted-foreground">지각</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#23CCB7]">
                      {selectedDateRecords.filter(r => r.status === "absent").length}
                    </div>
                    <div className="text-sm text-muted-foreground">결근</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#23CCB7]">
                      {selectedDateRecords.filter(r => r.status === "leave").length}
                    </div>
                    <div className="text-sm text-muted-foreground">연차</div>
                  </div>
                </div>

                {/* 직원별 상세 정보 */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">직원별 상세 정보</h3>
                  {selectedDateRecords.map((record) => (
                    <div key={record.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="h-10 w-10 bg-[#22ccb7] text-white">
                        <AvatarFallback className="bg-[#22ccb7] text-white">
                          {record.userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{record.userName}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>출근: {record.checkIn || "-"}</span>
                          <span>퇴근: {record.checkOut || "-"}</span>
                          {record.workHours && <span>근무: {record.workHours}시간</span>}
                        </div>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                해당 날짜의 출퇴근 기록이 없습니다.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
