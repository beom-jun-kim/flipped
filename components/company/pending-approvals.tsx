import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Check, X } from "lucide-react"

interface Approval {
  id: string
  type: "leave" | "document"
  employeeName: string
  title: string
  date: string
  description: string
}

const MOCK_APPROVALS: Approval[] = [
  {
    id: "1",
    type: "leave",
    employeeName: "김근로",
    title: "연차 신청",
    date: "2024-01-25",
    description: "개인 사유로 연차 신청합니다",
  },
  {
    id: "2",
    type: "document",
    employeeName: "이직원",
    title: "입사서류 제출",
    date: "2024-01-20",
    description: "건강검진 결과서 제출",
  },
  {
    id: "3",
    type: "leave",
    employeeName: "최근무",
    title: "반차 신청",
    date: "2024-01-22",
    description: "오후 반차 신청",
  },
]

export function PendingApprovals() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">승인 대기 중</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_APPROVALS.map((approval) => (
            <div key={approval.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    approval.type === "leave" ? "bg-orange-100" : "bg-purple-100"
                  }`}
                >
                  {approval.type === "leave" ? (
                    <Calendar className="w-5 h-5 text-orange-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{approval.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {approval.employeeName} · {approval.date}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{approval.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]">
                  <Check className="w-4 h-4 mr-1" />
                  승인
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <X className="w-4 h-4 mr-1" />
                  반려
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
