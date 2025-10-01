"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTask, getAllTasks, type Task } from "@/lib/tasks"
import { Briefcase, Plus, Calendar } from "lucide-react"

export default function CompanyTasksPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [dueDate, setDueDate] = useState("")
  const [assignedTo] = useState("test01")
  const [assignedToName] = useState("김근로")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    const allTasks = getAllTasks()
    setTasks(allTasks)
  }, [user])

  const reloadTasks = () => {
    const allTasks = getAllTasks()
    setTasks(allTasks)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    createTask(assignedTo, assignedToName, user.id, user.name, title, description, priority, dueDate)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setIsCreating(false)
    reloadTasks()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무지시 관리</h2>
            <p className="text-muted-foreground">직원에게 업무를 지시하고 관리하세요</p>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="bg-[#22ccb7] hover:bg-[#1ab5a3]">
              <Plus className="w-4 h-4 mr-2" />
              업무 지시하기
            </Button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <Card className="border-[#22ccb7]/20">
            <CardHeader>
              <CardTitle className="text-lg">새 업무 지시</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">업무 제목</Label>
                  <Input
                    id="title"
                    placeholder="업무 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">업무 설명</Label>
                  <Textarea
                    id="description"
                    placeholder="업무 내용을 상세히 작성하세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">우선순위</Label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as Task["priority"])}>
                      <SelectTrigger id="priority" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">높음</SelectItem>
                        <SelectItem value="medium">보통</SelectItem>
                        <SelectItem value="low">낮음</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">마감일</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]">
                    지시하기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setTitle("")
                      setDescription("")
                      setPriority("medium")
                      setDueDate("")
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

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-[#22ccb7]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>담당자: {task.assignedToName}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#22ccb7]" />
                          <span>마감: {task.dueDate}</span>
                        </div>
                        <span>•</span>
                        <span>
                          상태:{" "}
                          {task.status === "pending" ? "대기 중" : task.status === "in-progress" ? "진행 중" : "완료"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground mb-4">지시한 업무가 없습니다</p>
                <Button onClick={() => setIsCreating(true)} className="bg-[#22ccb7] hover:bg-[#1ab5a3]">
                  <Plus className="w-4 h-4 mr-2" />첫 업무 지시하기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
