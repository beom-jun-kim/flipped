"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getAllWorkLogs, addFeedback, initializeMockWorkLogs, type WorkLog } from "@/lib/work-log"
import { FileText, MessageSquare, Calendar, Send, CheckCircle } from "lucide-react"

export default function CompanyWorkLogPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [selectedLog, setSelectedLog] = useState<string | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<string>("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    initializeMockWorkLogs()
    const allLogs = getAllWorkLogs()
    setLogs(allLogs)
  }, [user])

  const reloadLogs = () => {
    const allLogs = getAllWorkLogs()
    setLogs(allLogs)
  }

  const handleAddFeedback = (logId: string) => {
    const feedback = selectedFeedback || feedbackText.trim()
    if (feedback) {
      addFeedback(logId, feedback)
      setFeedbackText("")
      setSelectedFeedback("")
      setSelectedLog(null)
      reloadLogs()
    }
  }

  const feedbackOptions = [
    {
      id: "훌륭한 업무입니다!",
      label: "훌륭한 업무입니다!",
      message: "정말 훌륭한 업무를 해주셨습니다. 세심한 부분까지 잘 고려해주셔서 감사합니다. 앞으로도 이런 수준의 업무를 기대하겠습니다."
    },
    {
      id: "good",
      label: "훌륭한 업무입니다!",
      message: "업무를 잘 수행해주셨습니다. 몇 가지 개선할 점이 있다면 더욱 좋을 것 같습니다. 계속해서 좋은 성과를 보여주세요."
    },
    
    {
      id: "custom",
      label: "직접 작성",
      message: ""
    }
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무일지 관리</h2>
            <p className="text-muted-foreground">직원들의 업무일지를 확인하고 피드백을 제공하세요</p>
          </div>
        </div>

        {/* Work Logs List */}
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <Card 
                key={log.id} 
                className="border-gray-200 cursor-pointer hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
              >
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 hover:text-[#22ccb7] transition-colors">{log.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium text-[#22ccb7]">{log.userName}</span>
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

                    {log.feedback && (
                      <div className="bg-[#f4fdfc] p-4 rounded-lg border border-[#22ccb7]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-[#22ccb7]" />
                          <p className="text-sm font-medium text-[#22ccb7]">관리자 피드백</p>
                        </div>
                        <p className="text-sm">{log.feedback}</p>
                      </div>
                    )}

                    {!log.feedback && (
                      <div className="pt-5 border-t">
                        {selectedLog === log.id ? (
                          <div className="space-y-2 flex flex-col">
                            <Label>피드백 선택</Label>
                            <div className="space-y-3">
                              {feedbackOptions.map((option) => (
                                <div key={option.id} className="relative">
                                  <input
                                    type="radio"
                                    id={`${log.id}-${option.id}`}
                                    name={`feedback-${log.id}`}
                                    value={option.id}
                                    checked={selectedFeedback === option.id}
                                    onChange={(e) => {
                                      setSelectedFeedback(e.target.value)
                                      if (option.id !== "custom") {
                                        setFeedbackText(option.message)
                                      } else {
                                        setFeedbackText("")
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                  <label
                                    htmlFor={`${log.id}-${option.id}`}
                                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                      selectedFeedback === option.id
                                        ? "border-[#22ccb7] bg-[#22ccb7]/5"
                                        : "border-gray-200 hover:border-[#22ccb7]/50 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                      selectedFeedback === option.id
                                        ? "border-[#22ccb7] bg-[#22ccb7]"
                                        : "border-gray-300"
                                    }`}>
                                      {selectedFeedback === option.id && (
                                        <CheckCircle className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm mb-1">{option.label}</div>
                                      {option.message && option.id !== "custom" && (
                                        <div className="text-xs text-muted-foreground leading-relaxed">
                                          {option.message}
                                        </div>
                                      )}
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </div>

                            {selectedFeedback === "custom" && (
                              <div className="space-y-2 flex flex-col mt-3">
                                <Label htmlFor={`feedback-${log.id}`}>직접 작성</Label>
                                <Textarea
                                  id={`feedback-${log.id}`}
                                  placeholder="직원에게 전달할 피드백을 작성하세요"
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAddFeedback(log.id)}
                                disabled={!selectedFeedback || (selectedFeedback === "custom" && !feedbackText.trim())}
                                className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                피드백 전송
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedLog(null)
                                  setFeedbackText("")
                                  setSelectedFeedback("")
                                }}
                                className="flex-1 bg-transparent"
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setSelectedLog(log.id)}
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            <MessageSquare className="w-4 h-4 mr-2 text-[#22ccb7]" />
                            피드백 작성하기
                          </Button>
                        )}
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
