"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { StatsCard } from "@/components/worker/stats-card"
import { QuickActionCard } from "@/components/worker/quick-action-card"
import { EmployeeList } from "@/components/company/employee-list"
import { PendingApprovals } from "@/components/company/pending-approvals"
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar"
import { Users, Clock, Calendar, FileText, Briefcase, MessageSquare } from "lucide-react"

export default function CompanyDashboard() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
    }
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
          <h3 className="text-lg font-semibold mb-4">빠른 실행</h3>
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
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <EmployeeList />
          <PendingApprovals />
        </div>
      </main>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  )
}
