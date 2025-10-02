"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getWorkers, type User } from "@/lib/auth"
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
  const [assignedTo, setAssignedTo] = useState("")
  const [assignedToName, setAssignedToName] = useState("")
  const [workers, setWorkers] = useState<User[]>([])

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
    
    const workersList = getWorkers()
    setWorkers(workersList)
  }, [user])

  const reloadTasks = () => {
    const allTasks = getAllTasks()
    setTasks(allTasks)
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !assignedTo || !assignedToName) return

    createTask(assignedTo, assignedToName, user.id, user.name, title, description, priority, dueDate)
    setTitle("")
    setDescription("")
    setPriority("medium")
    setDueDate("")
    setAssignedTo("")
    setAssignedToName("")
    setIsCreating(false)
    reloadTasks()
  }

  const handleWorkerSelect = (workerId: string) => {
    const selectedWorker = workers.find(worker => worker.id === workerId)
    if (selectedWorker) {
      setAssignedTo(selectedWorker.id)
      setAssignedToName(selectedWorker.name)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무지시 관리</h2>
            <p className="text-muted-foreground">직원 업무 지시 및 관리</p>
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
          <Card className="border-gray-200 bg-white gap-0">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-[#22ccb7]" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">새 업무 지시</CardTitle>
                  <p className="text-sm text-muted-foreground">직원에게 업무를 지시하세요</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 담당자 선택 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">담당자</h3>
                  <Select value={assignedTo} onValueChange={handleWorkerSelect} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="근로자를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker.id} value={worker.id}>
                          {worker.name} ({worker.department} - {worker.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 업무 제목 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">업무 제목</h3>
                  <Input
                    id="title"
                    placeholder="업무 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                {/* 업무 내용 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">업무 내용</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Textarea
                      id="description"
                      placeholder="업무 내용을 상세히 작성하세요"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={6}
                      className="bg-transparent border-none resize-none focus:ring-0 focusring-offset-0 p-0"
                    />
                  </div>
                </div>

                {/* 버튼 */}
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
                      setAssignedTo("")
                      setAssignedToName("")
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
              <Card 
                key={task.id} 
                className="border-gray-200 cursor-pointer hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
                onClick={() => router.push(`/company/tasks/${task.id}`)}
              >
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-[#22ccb7]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>근로자 : {task.assignedToName}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#22ccb7]" />
                          <span>지시일: {task.dueDate}</span>
                        </div>
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
