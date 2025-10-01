"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { StatsCard } from "@/components/worker/stats-card"
import { QuickActionCard } from "@/components/worker/quick-action-card"
import { RecentActivity } from "@/components/worker/recent-activity"
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar"
import { Clock, FileText, Calendar, Briefcase, ClipboardList, MessageSquare } from "lucide-react"

export default function WorkerDashboard() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard")
    }
  }, [user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#22ccb7] to-[#1ab5a3] text-white rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">안녕하세요, {user.name}님!</h2>
          <p className="text-white/90">오늘도 좋은 하루 되세요</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{user.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              <span>{user.department}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="이번 달 출근일" value="18일" icon={Clock} description="총 22일 중" color="#22ccb7" />
          <StatsCard title="작성한 업무일지" value="15건" icon={FileText} description="이번 달" color="#22ccb7" />
          <StatsCard title="남은 연차" value="12일" icon={Calendar} description="총 15일 중" color="#22ccb7" />
          <StatsCard title="진행 중인 업무" value="3건" icon={Briefcase} description="확인 필요" color="#22ccb7" />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">업무 관리</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="출퇴근 관리"
              description="출근/퇴근 기록 및 현황 확인"
              icon={Clock}
              onClick={() => router.push("/worker/attendance")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="업무일지"
              description="오늘의 업무 내용 작성"
              icon={FileText}
              onClick={() => router.push("/worker/work-log")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="연차 신청"
              description="휴가 및 연차 신청하기"
              icon={Calendar}
              onClick={() => router.push("/worker/leave")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="업무지시"
              description="받은 업무 확인 및 처리"
              icon={Briefcase}
              onClick={() => router.push("/worker/tasks")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="입사서류"
              description="서류 제출 및 관리"
              icon={ClipboardList}
              onClick={() => router.push("/worker/documents")}
              color="#22ccb7"
            />
            <QuickActionCard
              title="쪽지함"
              description="메시지 확인 및 전송"
              icon={MessageSquare}
              onClick={() => router.push("/worker/messages")}
              color="#22ccb7"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </main>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  )
}
