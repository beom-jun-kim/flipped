"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createWorkLog, getUserWorkLogs, type WorkLog } from "@/lib/work-log"
import { FileText, Plus, MessageSquare, Calendar, Upload, X } from "lucide-react"

export default function WorkerWorkLogPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [taskInput, setTaskInput] = useState("")
  const [tasks, setTasks] = useState<string[]>([])
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [workLogType, setWorkLogType] = useState<string>("일일")

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
    setLogs(userLogs)
  }, [user])

  const reloadWorkLogs = () => {
    if (!user) return
    const userLogs = getUserWorkLogs(user.id)
    setLogs(userLogs)
  }

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, taskInput.trim()])
      setTaskInput("")
    }
  }

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    createWorkLog(user.id, user.name, title, content, tasks)
    setTitle("")
    setContent("")
    setTasks([])
    setAttachedFile(null)
    setWorkLogType("일간")
    setIsCreating(false)
    reloadWorkLogs()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAttachedFile(file)
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무일지</h2>
            <p className="text-muted-foreground">오늘의 업무 내용 기록</p>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="bg-[#22ccb7] hover:bg-[#1ab5a3]">
              <Plus className="w-4 h-4 mr-2" />
              작성하기
            </Button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <Card className="border-[#22ccb7]/20 gap-3">
            <CardHeader>
              <CardTitle className="text-lg">업무일지 작성</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 업무일지 타입 선택 */}
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="workLogType">일지 타입</Label>
                  <select
                    id="workLogType"
                    value={workLogType}
                    onChange={(e) => setWorkLogType(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="일간">일일</option>
                    <option value="주간">주간</option>
                    <option value="월간">월간</option>
                  </select>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="content">업무 내용</Label>
                  <Textarea
                    id="content"
                    placeholder="오늘 수행한 업무 내용을 작성하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                {/* 첨부파일 섹션 */}
                <div className="space-y-2">
                  <Label>첨부파일</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">파일 선택</span>
                      </label>
                    </div>
                    
                    {attachedFile && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachedFile.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(attachedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveFile}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]">
                    저장하기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setTitle("")
                      setContent("")
                      setTasks([])
                      setAttachedFile(null)
                      setWorkLogType("일간")
                    }}
                    className="flex-1 bg-transparent"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Work Logs List */}
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <Card 
                key={log.id} 
                className="border-gray-200 cursor-pointer hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
                onClick={() => router.push(`/worker/work-log/${log.id}`)}
              >
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {/* <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#22ccb7]" />
                      </div> */}
                      <div>
                        <h3 className="font-semibold text-lg mb-1 hover:text-[#22ccb7] transition-colors">{log.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 text-[#22ccb7]" />
                          <span>{log.date}</span>
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
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            !isCreating && (
              <Card className="border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground mb-4">작성된 업무일지가 없습니다</p>
                  <Button onClick={() => setIsCreating(true)} className="bg-[#22ccb7] hover:bg-[#1ab5a3]">
                    <Plus className="w-4 h-4 mr-2" />첫 업무일지 작성하기
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </main>
    </div>
  )
}
