import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, Calendar, Briefcase } from "lucide-react"

interface Activity {
  id: string
  type: "attendance" | "work-log" | "leave" | "task"
  title: string
  time: string
  description?: string
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "task",
    title: "새로운 업무지시",
    time: "어제 16:30",
    description: "월간 보고서 작성 요청",
  },
  {
    id: "2",
    type: "work-log",
    title: "업무일지 작성",
    time: "어제 18:00",
    description: "일일 업무 내용 기록 완료",
  },
  {
    id: "3",
    type: "attendance",
    title: "출근 완료",
    time: "오늘 09:00",
    description: "정상 출근하였습니다",
  },
  {
    id: "4",
    type: "leave",
    title: "연차 승인",
    time: "2일 전",
    description: "2024-01-25 연차가 승인되었습니다",
  },
]

const getActivityIcon = (type: Activity["type"]) => {
  switch (type) {
    case "attendance":
      return Clock
    case "work-log":
      return FileText
    case "leave":
      return Calendar
    case "task":
      return Briefcase
  }
}

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "attendance":
      return "#23CCB7"
    case "work-log":
      return "#23CCB7"
    case "leave":
      return "#23CCB7"
    case "task":
      return "#23CCB7"
  }
}

export function RecentActivity() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ACTIVITIES.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const color = getActivityColor(activity.type)

            return (
              <div key={activity.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                  {activity.description && <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
