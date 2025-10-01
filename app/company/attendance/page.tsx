"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  getAllTodayAttendance,
  getAttendanceRecords,
  initializeMockAttendance,
  type AttendanceRecord,
} from "@/lib/attendance"
import { Clock, Search, Users, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

export default function CompanyAttendancePage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([])
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    initializeMockAttendance()
    const today = getAllTodayAttendance()
    const all = getAttendanceRecords()
    setTodayAttendance(today)
    setAllRecords(all)

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [user])

  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
            정상
          </Badge>
        )
      case "late":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="w-3 h-3 mr-1 text-yellow-600" />
            지각
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1 text-red-600" />
            결근
          </Badge>
        )
      case "leave":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1 text-blue-600" />
            연차
          </Badge>
        )
    }
  }

  const filteredRecords = todayAttendance.filter((record) =>
    record.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const presentCount = todayAttendance.filter((r) => r.status === "present" || r.status === "late").length
  const lateCount = todayAttendance.filter((r) => r.status === "late").length
  const absentCount = todayAttendance.filter((r) => r.status === "absent").length

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">출퇴근 관리</h2>
          <p className="text-muted-foreground">직원들의 출퇴근 현황을 확인하세요</p>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전체 직원</p>
                  <p className="text-2xl font-bold">25명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">출근</p>
                  <p className="text-2xl font-bold">{presentCount}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">지각</p>
                  <p className="text-2xl font-bold">{lateCount}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">결근</p>
                  <p className="text-2xl font-bold">{absentCount}명</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance */}
        <Card className="border-gray-200">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">오늘의 출퇴근 현황</h3>
              <p className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="직원 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Attendance List */}
            <div className="space-y-3">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <div key={record.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <Avatar className="h-10 w-10 bg-[#22ccb7] text-white">
                      <AvatarFallback className="bg-[#22ccb7] text-white">{record.userName[0]}</AvatarFallback>
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
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "검색 결과가 없습니다" : "오늘의 출퇴근 기록이 없습니다"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
