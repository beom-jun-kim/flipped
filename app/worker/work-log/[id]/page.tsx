"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createWorkLog, getUserWorkLogs, type WorkLog } from "@/lib/work-log"
import { FileText, MessageSquare, Calendar, ArrowLeft, Edit } from "lucide-react"

export default function WorkLogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const user = useMemo(() => getCurrentUser(), [])
  const [workLog, setWorkLog] = useState<WorkLog | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard")
      return
    }

    const userLogs = getUserWorkLogs(user.id)
    const log = userLogs.find(log => log.id === params.id)
    
    if (log) {
      setWorkLog(log)
    } else {
      router.push("/worker/work-log")
    }
  }, [user, params.id])

  if (!user || !workLog) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무일지 상세</h2>
            <p className="text-muted-foreground">업무일지 내용을 확인하세요</p>
          </div>
          <Button 
            onClick={() => router.push(`/worker/work-log/edit/${workLog.id}`)}
            className="bg-[#22ccb7] hover:bg-[#1ab5a3]"
          >
            <Edit className="w-4 h-4 mr-2" />
            수정하기
          </Button>
        </div>

        {/* Work Log Detail */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {/* <div className="w-12 h-12 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#22ccb7]" />
                </div> */}
                <div>
                  <CardTitle className="text-xl mb-2">{workLog.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#22ccb7]" />
                      <span>{workLog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>작성자: {workLog.userName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* 업무 내용 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">업무 내용</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{workLog.content}</p>
              </div>
            </div>

            {/* 완료한 작업 */}
            {workLog.tasks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">완료한 작업</h3>
                <div className="space-y-2">
                  {workLog.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-[#22ccb7] rounded-full flex-shrink-0" />
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 관리자 피드백 */}
            {workLog.feedback && (
              <div className="bg-[#f4fdfc] p-6 rounded-lg border border-[#22ccb7]/20">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-[#22ccb7]" />
                  <h3 className="text-lg font-semibold text-[#22ccb7]">관리자 피드백</h3>
                </div>
                <p className="text-sm leading-relaxed">{workLog.feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 목록으로 버튼 */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/worker/work-log")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Button>
        </div>
      </main>
    </div>
  )
}

