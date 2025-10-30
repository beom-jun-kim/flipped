"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ChatButton } from "@/components/accessibility/accessibility-toolbar"
import { Building2, Users, CheckCircle2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])

  useEffect(() => {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    if (user) {
      if (user.role === "worker") {
        router.push("/worker/dashboard")
      } else {
        router.push("/company/dashboard")
      }
    }
  }, [user])

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f4fdfc] to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4 leading-tight">
            <span className="text-[#22ccb7]">모두를 위한</span>
            <br />
            인사관리 플랫폼
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance mb-6 break-keep">
            장애인 근로자와 기업을 위한 편안한 근무 환경을 제공합니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold bg-[#22ccb7] text-white cursor-pointer"
              onClick={() => router.push("/login")}
            >
              로그인
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-semibold border-[#22ccb7] text-[#22ccb7] cursor-pointer"
              onClick={() => router.push("/register")}
            >
              회원가입
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-7">주요 기능</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#22ccb7]/10">
              <div className="w-12 h-12 bg-[#f4fdfc] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#22ccb7]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">근로자를 위한 기능</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>간편한 출퇴근 관리</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>업무일지 작성 및 조회</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>연차 신청 및 관리</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>접근성 강화 기능</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#22ccb7]/10">
              <div className="w-12 h-12 bg-[#f4fdfc] rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-[#22ccb7]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">기업을 위한 기능</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>직원 출퇴근 현황 관리</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>업무지시 및 피드백</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>연차 승인 관리</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7] flex-shrink-0 mt-0.5" />
                  <span>입사서류 관리</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-[#22ccb7] text-white rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-lg mb-4 opacity-90 break-keep">편안한 근무 환경으로 모두가 함께 성장하는 조직을 만들어보세요</p>
          <Button
            size="lg"
            variant="secondary"
            className="h-14 px-8 text-base font-semibold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            시작하기
          </Button>
        </div>
      </section>

      <ChatButton />
    </main>
  )
}
