"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { StatsCard } from "@/components/worker/stats-card"
import { QuickActionCard } from "@/components/worker/quick-action-card"
import { EmployeeList } from "@/components/company/employee-list"
import { PendingApprovals } from "@/components/company/pending-approvals"
import { ChatButton } from "@/components/accessibility/accessibility-toolbar"
import { Button } from "@/components/ui/button"
import { Users, Clock, Calendar, FileText, Briefcase, MessageSquare, X } from "lucide-react"

export default function CompanyDashboard() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
    }

    // 배너 표시 상태 확인
    const today = new Date().toDateString()
    const hiddenToday = localStorage.getItem("companyBannerHiddenToday")
    if (hiddenToday === today) {
      setShowBanner(false)
    }
  }, [user])

  const handleHideBannerToday = () => {
    const today = new Date().toDateString()
    localStorage.setItem("companyBannerHiddenToday", today)
    setShowBanner(false)
  }

  const handleCloseBanner = () => {
    setShowBanner(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 배너 팝업 */}
        {showBanner && (
          <div className="bg-gradient-to-r from-[#22ccb7] to-[#1ab5a3] text-white rounded-xl p-6 md:px-8 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto">
              <div className="md:flex items-end justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">📋 관리자 공지</h2>
                  <p className="text-lg mb-2">2024년 연말 직원 관리 일정 안내</p>
                  <div className="text-base font-medium break-keep">
                    <p>1. 12월 25일(수) - 크리스마스 휴무일 직원 관리</p>
                    <p>2. 12월 30일(월) ~ 1월 1일(수) - 연말연시 휴무 관리</p>
                    <p>3. 1월 2일(목)부터 정상 근무 관리</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-4 md:mt-0">
                  <Button
                    onClick={handleHideBannerToday}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 text-base p-0 border py-2 px-4"
                  >
                    오늘 하루 보지 않기
                  </Button>
                  <Button
                    onClick={handleCloseBanner}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1 border py-2 px-4 text-base"
                  >
                    닫기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#22ccb7] to-[#1ab5a3] text-white rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">안녕하세요, {user.name}님!</h2>
          <p className="text-white/90">오늘의 직원 관리 현황을 확인하세요</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{user.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{user.department}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="전체 직원" value="25명" icon={Users} description="재직 중" color="#22ccb7" />
          <StatsCard title="오늘 출근" value="22명" icon={Clock} description="88% 출근율" color="#22ccb7" />
          <StatsCard title="승인 대기" value="3건" icon={Calendar} description="확인 필요" color="#22ccb7" />
          <StatsCard title="미확인 업무일지" value="5건" icon={FileText} description="검토 필요" color="#22ccb7" />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">업무 관리</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="출퇴근 관리"
              description="직원 출퇴근 현황 확인"
              icon={Clock}
              onClick={() => router.push("/company/attendance")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="업무일지 관리"
              description="직원 업무일지 확인 및 피드백"
              icon={FileText}
              onClick={() => router.push("/company/work-log")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="연차 관리"
              description="연차 신청 승인 및 관리"
              icon={Calendar}
              onClick={() => router.push("/company/leave")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="업무지시"
              description="직원에게 업무 지시하기"
              icon={Briefcase}
              onClick={() => router.push("/company/tasks")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="입사서류 관리"
              description="직원 서류 확인 및 관리"
              icon={FileText}
              onClick={() => router.push("/company/documents")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="쪽지함"
              description="직원과 메시지 주고받기"
              icon={MessageSquare}
              onClick={() => router.push("/company/messages")}
              color="#22ccb7"
            />
            {/* <QuickActionCard
              title="채팅"
              description="실시간 채팅하기"
              icon={MessageSquare}
              onClick={() => router.push("/company/chat")}
              color="#22ccb7"
            /> */}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <EmployeeList />
          <PendingApprovals />
        </div>
      </main>

      {/* Chat Button */}
      <ChatButton />
    </div>
  )
}
