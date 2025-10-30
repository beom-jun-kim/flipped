"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  getAllTodayAttendance,
  getAttendanceRecords,
  initializeMockAttendance,
  type AttendanceRecord,
} from "@/lib/attendance"
import { Clock, Search, Users, CheckCircle2, XCircle, AlertCircle, Calendar, TrendingUp, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { CompanyAttendanceCalendar } from "@/components/company/attendance-calendar"

export default function CompanyAttendancePage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([])
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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
          <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
            정상 출근
          </Badge>
        )
      case "late":
        return (
          <Badge className="bg-[#FFBC0A]/15 text-[#FFBC0A] hover:bg-[#FFBC0A]/15">
            지각
          </Badge>
        )
      case "absent":
        return (
          <Badge className="bg-[#FF6262]/15 text-[#FF6262] hover:bg-[#FF6262]/15">
            결근
          </Badge>
        )
      case "leave":
        return (
          <Badge className="bg-[#7F6FFF]/15 text-[#7F6FFF] hover:bg-[#7F6FFF]/15">
            연차
          </Badge>
        )
    }
  }

  const refreshAttendanceData = async () => {
    setIsRefreshing(true)
    // localStorage 초기화 후 더미 데이터 재생성
    localStorage.removeItem("attendance_records")
    initializeMockAttendance()
    
    // 데이터 새로고침
    const today = getAllTodayAttendance()
    const all = getAttendanceRecords()
    setTodayAttendance(today)
    setAllRecords(all)
    
    // 페이지 초기화
    setCurrentPage(1)
    
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const filteredRecords = todayAttendance.filter((record) =>
    record.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex)

  const presentCount = todayAttendance.filter((r) => r.status === "present" || r.status === "late").length
  const lateCount = todayAttendance.filter((r) => r.status === "late").length
  const absentCount = todayAttendance.filter((r) => r.status === "absent").length

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 검색어 변경 시 첫 페이지로 이동
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#23CCB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">이번 달 출근</p>
                  <p className="text-2xl font-bold">18일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23CCB7]/15">
                  <TrendingUp className="w-5 h-5 text-[#23CCB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">정상 출근</p>
                  <p className="text-2xl font-bold">16일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23CCB7]/15">
                  <Clock className="w-5 h-5 text-[#23CCB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">지각</p>
                  <p className="text-2xl font-bold">2일</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Attendance and Calendar */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 gap-1">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">오늘의 출퇴근 현황</h3>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    {currentTime.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
                  </p>
                  <Button
                    onClick={refreshAttendanceData}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="h-8 px-3"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                    새로고침
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="직원 이름으로 검색..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 h-12"
                />
              </div>

              {/* Attendance List */}
              <div className="space-y-3">
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((record) => (
                    <div key={record.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-10 w-10 bg-[#22ccb7] text-white">
                        <AvatarFallback className="bg-[#22ccb7] text-white">{record.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{record.userName}</p>
                        <div className="hidden sm:flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>출근: {record.checkIn || null}</span>
                          <span>퇴근: {record.checkOut || null}</span>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center pt-4 border-t">
                  {/* <div className="text-sm text-muted-foreground">
                    {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} / {filteredRecords.length}명
                  </div> */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 p-0 ${
                            currentPage === page 
                              ? "bg-[#22ccb7] hover:bg-[#1ab5a3] text-white" 
                              : ""
                          }`}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <CompanyAttendanceCalendar
            allAttendanceRecords={allRecords}
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </div>
      </main>
    </div>
  )
}
