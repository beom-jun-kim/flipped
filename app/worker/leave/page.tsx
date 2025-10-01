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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { createLeaveRequest, getUserLeaveRequests, type LeaveRequest } from "@/lib/leave"
import { Calendar, Plus, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function WorkerLeavePage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [type, setType] = useState<LeaveRequest["type"]>("annual")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard")
      return
    }

    const userRequests = getUserLeaveRequests(user.id)
    setRequests(userRequests)
  }, [user])

  const reloadLeaveRequests = () => {
    if (!user) return
    const userRequests = getUserLeaveRequests(user.id)
    setRequests(userRequests)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    createLeaveRequest(user.id, user.name, type, startDate, endDate, reason)
    setType("annual")
    setStartDate("")
    setEndDate("")
    setReason("")
    setIsCreating(false)
    reloadLeaveRequests()
  }

  const getStatusBadge = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-[#22ccb7]/10 text-[#22ccb7] hover:bg-[#22ccb7]/10">
            <Clock className="w-3 h-3 mr-1" />
            대기 중
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-[#22ccb7]/10 text-[#22ccb7] hover:bg-[#22ccb7]/10">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-[#22ccb7]/10 text-[#22ccb7] hover:bg-[#22ccb7]/10">
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

  const approvedRequests = requests.filter((r) => r.status === "approved")
  const usedDays = approvedRequests.reduce((sum, r) => sum + r.days, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">연차 관리</h2>
            <p className="text-muted-foreground">연차를 신청하고 사용 현황을 확인하세요</p>
          </div>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="bg-[#22ccb7] hover:bg-[#1ab5a3]">
              <Plus className="w-4 h-4 mr-2" />
              신청하기
            </Button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#22ccb7]/10">
                  <Calendar className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">총 연차</p>
                  <p className="text-2xl font-bold">15일</p>
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
                  <p className="text-sm text-muted-foreground">사용한 연차</p>
                  <p className="text-2xl font-bold">{usedDays}일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#22ccb7]/10">
                  <Calendar className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">남은 연차</p>
                  <p className="text-2xl font-bold">{15 - usedDays}일</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        {isCreating && (
          <Card className="border-[#22ccb7]/20">
            <CardHeader>
              <CardTitle className="text-lg">연차 신청</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="type">휴가 유형</Label>
                  <Select value={type} onValueChange={(value) => setType(value as LeaveRequest["type"])}>
                    <SelectTrigger id="type" className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">연차</SelectItem>
                      <SelectItem value="sick">병가</SelectItem>
                      <SelectItem value="half-day">반차</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="startDate">시작일</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <Label htmlFor="endDate">종료일</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col">
                  <Label htmlFor="reason">사유</Label>
                  <Textarea
                    id="reason"
                    placeholder="휴가 사유를 입력하세요"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]">
                    신청하기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setType("annual")
                      setStartDate("")
                      setEndDate("")
                      setReason("")
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

        {/* Requests List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">신청 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{getTypeLabel(request.type)}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.startDate} ~ {request.endDate} ({request.days}일)
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">
                      <span className="text-muted-foreground">사유: </span>
                      {request.reason}
                    </p>
                    {request.reviewedBy && (
                      <p className="text-xs text-muted-foreground">
                        검토자: {request.reviewedBy} · {new Date(request.reviewedAt!).toLocaleDateString("ko-KR")}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">신청 내역이 없습니다</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
