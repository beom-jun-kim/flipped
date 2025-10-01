"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getAllDocuments, reviewDocument, type Document } from "@/lib/documents"
import { FileText, Clock, CheckCircle2, XCircle, Check, X } from "lucide-react"

export default function CompanyDocumentsPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard")
      return
    }

    const allDocs = getAllDocuments()
    setDocuments(allDocs)
  }, [user])

  const reloadDocuments = () => {
    const allDocs = getAllDocuments()
    setDocuments(allDocs)
  }

  const handleReview = (docId: string, status: "approved" | "rejected") => {
    if (!user) return
    reviewDocument(docId, status, user.name, reviewNote || undefined)
    setReviewNote("")
    setSelectedDoc(null)
    reloadDocuments()
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1 text-yellow-600" />
            검토 중
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1 text-red-600" />
            반려됨
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: Document["type"]) => {
    switch (type) {
      case "resume":
        return "이력서"
      case "certificate":
        return "자격증"
      case "health":
        return "건강검진"
      case "other":
        return "기타"
    }
  }

  if (!user) return null

  const pendingDocs = documents.filter((d) => d.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">입사서류 관리</h2>
          <p className="text-muted-foreground">직원들이 제출한 서류를 검토하고 승인하세요</p>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">검토 대기</p>
                  <p className="text-2xl font-bold">{pendingDocs.length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">승인됨</p>
                  <p className="text-2xl font-bold">{documents.filter((d) => d.status === "approved").length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">반려됨</p>
                  <p className="text-2xl font-bold">{documents.filter((d) => d.status === "rejected").length}건</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">제출된 서류</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#22ccb7]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {doc.userName} · {getTypeLabel(doc.type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            제출일: {new Date(doc.uploadedAt).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>

                    {doc.status === "pending" ? (
                      selectedDoc === doc.id ? (
                        <div className="space-y-3 pt-3 border-t">
                          <div className="space-y-2">
                            <Label htmlFor={`note-${doc.id}`}>검토 의견 (선택사항)</Label>
                            <Textarea
                              id={`note-${doc.id}`}
                              placeholder="검토 의견을 입력하세요"
                              value={reviewNote}
                              onChange={(e) => setReviewNote(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleReview(doc.id, "approved")}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              승인
                            </Button>
                            <Button
                              onClick={() => handleReview(doc.id, "rejected")}
                              className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              반려
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedDoc(null)
                                setReviewNote("")
                              }}
                              className="bg-transparent"
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-3 border-t">
                          <Button
                            onClick={() => setSelectedDoc(doc.id)}
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            검토하기
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="pt-3 border-t space-y-2">
                        {doc.reviewNote && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">검토 의견</p>
                            <p className="text-sm">{doc.reviewNote}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">검토자: {doc.reviewedBy}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">제출된 서류가 없습니다</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
