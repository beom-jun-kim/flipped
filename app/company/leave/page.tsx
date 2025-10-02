"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllLeaveRequests, updateLeaveStatus, initializeMockLeaveRequests, type LeaveRequest } from "@/lib/leave"
import { Calendar, Clock, CheckCircle2, XCircle, Check, X } from "lucide-react"

export default function CompanyLeavePage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [requests, setRequests] = useState<LeaveRequest[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    initializeMockLeaveRequests()
    const allRequests = getAllLeaveRequests()
    setRequests(allRequests)
  }, [user])

  const reloadRequests = () => {
    const allRequests = getAllLeaveRequests()
    setRequests(allRequests)
  }

  const handleReview = (requestId: string, status: "approved" | "rejected") => {
    if (!user) return
    updateLeaveStatus(requestId, status, user.name)
    reloadRequests()
  }

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
            <Clock className="w-3 h-3 mr-1" />
            대기 중
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
            <XCircle className="w-3 h-3 mr-1" />
            반려됨
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: LeaveRequest["type"]) => {
    switch (type) {
      case "annual":
        return "연차"
      case "sick":
        return "병가"
      case "half-day":
        return "반차"
    }
  }

  if (!user) return null

  const pendingRequests = requests.filter((r) => r.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">연차 관리</h2>
            <p className="text-muted-foreground">직원 연차 신청 검토 및 승인</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#22ccb7]/10">
                  <Clock className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">승인 대기</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">승인됨</p>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "approved").length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#22ccb7]/10">
                  <XCircle className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">반려됨</p>
                  <p className="text-2xl font-bold">{requests.filter((r) => r.status === "rejected").length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">연차 신청 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-[#22ccb7]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{request.userName}</h3>
                            <span className="text-sm text-muted-foreground">· {getTypeLabel(request.type)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {request.startDate} ~ {request.endDate} {/* ({request.days}일) */}
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">사유: </span>
                            {request.reason}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {request.status === "pending" ? (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button
                          onClick={() => handleReview(request.id, "approved")}
                          className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          승인
                        </Button>
                        <Button
                          onClick={() => handleReview(request.id, "rejected")}
                          variant="outline"
                          className="flex-1 bg-transparent text-[#22ccb7] border-[#22ccb7] hover:bg-[#22ccb7]/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          반려
                        </Button>
                      </div>
                    ) : (
                      request.reviewedBy && (
                        <p className="text-xs text-muted-foreground pt-3 border-t">
                          검토자: {request.reviewedBy} · {new Date(request.reviewedAt!).toLocaleDateString("ko-KR")}
                        </p>
                      )
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">연차 신청 내역이 없습니다</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
