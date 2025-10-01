"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getAllWorkLogs, addFeedback, type WorkLog } from "@/lib/work-log"
import { FileText, MessageSquare, Calendar, Send } from "lucide-react"

export default function CompanyWorkLogPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [selectedLog, setSelectedLog] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    const allLogs = getAllWorkLogs()
    setLogs(allLogs)
  }, [user])

  const reloadLogs = () => {
    const allLogs = getAllWorkLogs()
    setLogs(allLogs)
  }

  const handleAddFeedback = (logId: string) => {
    if (feedbackText.trim()) {
      addFeedback(logId, feedbackText.trim())
      setFeedbackText("")
      setSelectedLog(null)
      reloadLogs()
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">업무일지 관리</h2>
          <p className="text-muted-foreground">직원들의 업무일지를 확인하고 피드백을 제공하세요</p>
        </div>

        {/* Work Logs List */}
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <Card key={log.id} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#22ccb7]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{log.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{log.userName}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-[#22ccb7]" />
                            <span>{log.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">업무 내용</p>
                      <p className="text-sm whitespace-pre-wrap">{log.content}</p>
                    </div>

                    {log.tasks.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">완료한 작업</p>
                        <div className="space-y-2">
                          {log.tasks.map((task, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-[#22ccb7] rounded-full" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {log.feedback ? (
                      <div className="bg-[#f4fdfc] p-4 rounded-lg border border-[#22ccb7]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-[#22ccb7]" />
                          <p className="text-sm font-medium text-[#22ccb7]">내가 작성한 피드백</p>
                        </div>
                        <p className="text-sm">{log.feedback}</p>
                      </div>
                    ) : selectedLog === log.id ? (
                      <div className="space-y-3 pt-4 border-t">
                        <Label htmlFor={`feedback-${log.id}`}>피드백 작성</Label>
                        <Textarea
                          id={`feedback-${log.id}`}
                          placeholder="직원에게 전달할 피드백을 작성하세요"
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAddFeedback(log.id)}
                            className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            피드백 전송
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedLog(null)
                              setFeedbackText("")
                            }}
                            className="flex-1 bg-transparent"
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => setSelectedLog(log.id)}
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <MessageSquare className="w-4 h-4 mr-2 text-[#22ccb7]" />
                          피드백 작성하기
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground">작성된 업무일지가 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
