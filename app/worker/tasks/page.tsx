"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { Card, CardContent } from "@/components/ui/card"
import { getUserTasks, initializeMockTasks, type Task } from "@/lib/tasks"
import { Briefcase, Calendar } from "lucide-react"

export default function WorkerTasksPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard")
      return
    }

    initializeMockTasks()
    const userTasks = getUserTasks(user.id)
    setTasks(userTasks)
  }, [user])

  const reloadTasks = () => {
    if (!user) return
    const userTasks = getUserTasks(user.id)
    setTasks(userTasks)
  }


  if (!user) return null


  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">업무지시</h2>
          <p className="text-muted-foreground">받은 업무 확인 및 처리</p>
        </div>


        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card 
                key={task.id} 
                className="border-gray-200 cursor-pointer hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
                onClick={() => router.push(`/worker/tasks/${task.id}`)}
              >
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#22ccb7]/10 flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-[#22ccb7]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 transition-colors">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-[#22ccb7]" />
                        <span>지시일: {task.dueDate}</span>
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
                <p className="text-muted-foreground">받은 업무지시가 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
