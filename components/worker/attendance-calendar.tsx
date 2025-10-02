"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type AttendanceRecord } from "@/lib/attendance"

interface AttendanceCalendarProps {
  attendanceHistory: AttendanceRecord[]
  todayRecord?: AttendanceRecord | null
  onDateSelect?: (date: Date) => void
}

export function AttendanceCalendar({ attendanceHistory, todayRecord, onDateSelect }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  // 출퇴근 기록을 날짜별로 매핑
  const attendanceMap = new Map<string, AttendanceRecord>()
  attendanceHistory.forEach(record => {
    const date = new Date(record.date)
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    attendanceMap.set(dateKey, record)
  })

  // 오늘 날짜의 출퇴근 상태를 실시간으로 반영
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  if (todayRecord) {
    attendanceMap.set(todayKey, todayRecord)
    console.log('달력에 오늘 기록 반영:', todayRecord) // 테스트용 로그
  }

  const getStatusText = (record: AttendanceRecord) => {
    // 오늘 날짜인 경우 더 구체적인 상태 표시
    const recordDate = new Date(record.date)
    const isTodayRecord = recordDate.toDateString() === today.toDateString()
    
    if (isTodayRecord) {
      if (record.checkIn && record.checkOut) {
        return "퇴근"
      } else if (record.checkIn) {
        return "출근"
      }
    }
    
    switch (record.status) {
      case "present":
        return "출근"
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

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
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
              const attendance = attendanceMap.get(dateKey)
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    relative h-16 text-sm rounded-lg transition-colors border
                    ${isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground/50'}
                    ${isTodayDate ? 'bg-[#23CCB7]/10 border-[#23CCB7]/30' : 'border-gray-200 hover:bg-gray-100'}
                    ${attendance ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full p-1">
                    <span className={`text-sm font-medium ${isTodayDate ? 'font-bold' : ''}`}>
                      {date.getDate()}
                    </span>
                    {attendance && (
                      <span className="text-xs font-bold text-[#23CCB7] mt-1 leading-tight">
                        {getStatusText(attendance)}
                      </span>
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
              <span className="text-sm font-bold text-[#23CCB7]">출근</span>
              <span className="text-sm font-bold text-[#23CCB7]">퇴근</span>
              <span className="text-sm font-bold text-[#23CCB7]">지각</span>
              <span className="text-sm font-bold text-[#23CCB7]">결근</span>
              <span className="text-sm font-bold text-[#23CCB7]">연차</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
