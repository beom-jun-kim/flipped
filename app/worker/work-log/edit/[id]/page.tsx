"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createWorkLog, getUserWorkLogs, saveWorkLog, type WorkLog } from "@/lib/work-log"
import { FileText, Upload, X, ArrowLeft } from "lucide-react"

export default function EditWorkLogPage() {
  const router = useRouter()
  const params = useParams()
  const user = useMemo(() => getCurrentUser(), [])
  const [workLog, setWorkLog] = useState<WorkLog | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tasks, setTasks] = useState<string[]>([])
  const [taskInput, setTaskInput] = useState("")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [workLogType, setWorkLogType] = useState<string>("일간")

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
      setTitle(log.title)
      setContent(log.content)
      setTasks(log.tasks)
    } else {
      router.push("/worker/work-log")
    }
  }, [user, params.id])

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setTasks([...tasks, taskInput.trim()])
      setTaskInput("")
    }
  }

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAttachedFile(file)
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !workLog) return

    const updatedLog: WorkLog = {
      ...workLog,
      title,
      content,
      tasks,
    }

    saveWorkLog(updatedLog)
    router.push(`/worker/work-log/${workLog.id}`)
  }

  if (!user || !workLog) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무일지 수정</h2>
            <p className="text-muted-foreground">업무일지 내용을 수정하세요</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/worker/work-log/${workLog.id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            취소
          </Button>
        </div>

        {/* Edit Form */}
        <Card className="border-[#22ccb7]/20 gap-3">
          <CardHeader>
            <CardTitle className="text-lg">업무일지 수정</CardTitle>
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
                  <option value="일간">일간</option>
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

              {/* 완료한 작업 */}
              <div className="space-y-2">
                {tasks.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">{task}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTask(index)}
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          삭제
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                  수정 완료
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/worker/work-log/${workLog.id}`)}
                  className="flex-1 bg-transparent"
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
