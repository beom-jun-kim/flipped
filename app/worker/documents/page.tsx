"use client"

import type React from "react"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { WorkerHeader } from "@/components/worker/worker-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { uploadDocument, getUserDocuments, type Document } from "@/lib/documents"
import { FileText, Upload, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function WorkerDocumentsPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<Document["type"]>("other")
  const [fileName, setFileName] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard")
      return
    }

    const userDocs = getUserDocuments(user.id)
    setDocuments(userDocs)
  }, [user])

  const reloadDocuments = () => {
    if (!user) return
    const userDocs = getUserDocuments(user.id)
    setDocuments(userDocs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    uploadDocument(user.id, user.name, title, type, fileName || "document.pdf")
    setTitle("")
    setType("other")
    setFileName("")
    setIsUploading(false)
    reloadDocuments()
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            검토 중
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            승인됨
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">입사서류 관리</h2>
            <p className="text-muted-foreground">필요한 서류를 제출하고 관리하세요</p>
          </div>
          {!isUploading && (
            <Button onClick={() => setIsUploading(true)} className="bg-[#22ccb7] hover:bg-[#1ab5a3]">
              <Upload className="w-4 h-4 mr-2" />
              서류 제출
            </Button>
          )}
        </div>

        {/* Upload Form */}
        {isUploading && (
          <Card className="border-[#22ccb7]/20">
            <CardHeader>
              <CardTitle className="text-lg">서류 제출</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">서류 제목</Label>
                  <Input
                    id="title"
                    placeholder="예: 건강검진 결과서"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">서류 유형</Label>
                  <Select value={type} onValueChange={(value) => setType(value as Document["type"])}>
                    <SelectTrigger id="type" className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resume">이력서</SelectItem>
                      <SelectItem value="certificate">자격증</SelectItem>
                      <SelectItem value="health">건강검진</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">파일 이름</Label>
                  <Input
                    id="file"
                    placeholder="파일명을 입력하세요 (예: document.pdf)"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">실제 파일 업로드는 데모 버전에서 지원되지 않습니다</p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]">
                    제출하기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsUploading(false)
                      setTitle("")
                      setType("other")
                      setFileName("")
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

        {/* Documents List */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">제출한 서류</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <div key={doc.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#22ccb7]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{getTypeLabel(doc.type)}</p>
                          <p className="text-xs text-muted-foreground">
                            제출일: {new Date(doc.uploadedAt).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                    {doc.reviewNote && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">검토 의견</p>
                        <p className="text-sm">{doc.reviewNote}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">제출한 서류가 없습니다</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
