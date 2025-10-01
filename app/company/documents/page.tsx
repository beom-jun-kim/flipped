"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { CompanyHeader } from "@/components/company/company-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllDocuments, type Document } from "@/lib/documents"
import { getWorkers, type User } from "@/lib/auth"
import { FileText, CheckCircle2, Download, ChevronLeft, ChevronRight } from "lucide-react"

export default function CompanyDocumentsPage() {
  const router = useRouter()
  const user = useMemo(() => getCurrentUser(), [])
  const [documents, setDocuments] = useState<Document[]>([])
  const [workers, setWorkers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
    
    const workersList = getWorkers()
    setWorkers(workersList)
  }, [user])

  const reloadDocuments = () => {
    const allDocs = getAllDocuments()
    setDocuments(allDocs)
  }

  // 근로자별 서류 상태 계산
  const getWorkerDocumentStatus = (workerId: string) => {
    const workerDocs = documents.filter(doc => doc.userId === workerId)
    if (workerDocs.length === 0) return "미등록"
    
    const allRegistered = workerDocs.every(doc => doc.status === "registered")
    return allRegistered ? "등록완료" : "미등록"
  }

  // 근로자별 서류 개수 계산
  const getWorkerDocumentCount = (workerId: string) => {
    return documents.filter(doc => doc.userId === workerId).length
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(workers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedWorkers = workers.slice(startIndex, endIndex)

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "unregistered":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            미등록
          </Badge>
        )
      case "signature_completed":
        return (
          <Badge className="bg-[#22ccb7] text-white hover:bg-[#22ccb7]">
            서명완료
          </Badge>
        )
      case "before_signature":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            서명 전
          </Badge>
        )
      case "registered":
        return (
          <Badge className="bg-[#22ccb7] text-white hover:bg-[#22ccb7]">
            등록
          </Badge>
        )
    }
  }

  const getTypeLabel = (type: Document["type"]) => {
    switch (type) {
      case "contract":
        return "근로계약서"
      case "signature":
        return "서명"
      case "registration":
        return "등록"
      case "insurance":
        return "보험"
      case "welfare":
        return "복리후생"
      case "other":
        return "기타"
    }
  }

  if (!user) return null

  const registeredWorkers = workers.filter(worker => getWorkerDocumentStatus(worker.id) === "등록완료")
  const unregisteredWorkers = workers.filter(worker => getWorkerDocumentStatus(worker.id) === "미등록")

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">입사서류 관리</h2>
          <p className="text-muted-foreground">직원들의 입사서류를 확인하고 관리하세요</p>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">전체 근로자</p>
                  <p className="text-2xl font-bold">{workers.length}명</p>
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
                  <p className="text-sm text-muted-foreground">등록완료</p>
                  <p className="text-2xl font-bold">{registeredWorkers.length}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#22ccb7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">미등록</p>
                  <p className="text-2xl font-bold">{unregisteredWorkers.length}명</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workers List */}
        <div className="space-y-4">
          {paginatedWorkers.length > 0 ? (
            paginatedWorkers.map((worker) => {
              const status = getWorkerDocumentStatus(worker.id)
              const docCount = getWorkerDocumentCount(worker.id)
              
              return (
                <Card
                  key={worker.id}
                  className="border-gray-200 cursor-pointer hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
                  onClick={() => router.push(`/company/documents/${worker.id}`)}
                >
                  <CardContent>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#22ccb7]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{worker.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            <span>입사일: {worker.joinDate || "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <Badge 
                          className={
                            status === "등록완료" 
                              ? "bg-[#22ccb7] text-white hover:bg-[#22ccb7]" 
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {status}
                        </Badge>
                        {status === "등록완료" && docCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // 다운로드 로직 구현
                            }}
                            className="text-[#22ccb7] hover:text-[#1ab5a3]"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground">근로자가 없습니다</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(1)}
              className={currentPage === 1 ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : ""}
            >
              1
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
