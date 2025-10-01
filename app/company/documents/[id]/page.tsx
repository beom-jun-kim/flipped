"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser, getWorkers, type User } from "@/lib/auth";
import { CompanyHeader } from "@/components/company/company-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUserDocuments, isCompanyDocument, uploadDocumentFile, type Document } from "@/lib/documents";
import { FileText, Download, Eye, ArrowLeft, Upload } from "lucide-react";

export default function CompanyDocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useMemo(() => getCurrentUser(), []);
  const [worker, setWorker] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard");
      return;
    }

    const workers = getWorkers();
    const foundWorker = workers.find((w) => w.id === params.id);

    if (foundWorker) {
      setWorker(foundWorker);
      const userDocs = getUserDocuments(foundWorker.id);
      setDocuments(userDocs);
    } else {
      router.push("/company/documents");
    }
  }, [user, params.id]);

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "unregistered":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            미등록
          </Badge>
        );
      case "signature_completed":
        return (
          <Badge className="bg-[#22ccb7] text-white hover:bg-[#22ccb7]">
            서명완료
          </Badge>
        );
      case "before_signature":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            서명 전
          </Badge>
        );
      case "registered":
        return (
          <Badge className="bg-[#22ccb7] text-white hover:bg-[#22ccb7]">
            등록
          </Badge>
        );
    }
  };

  const getTypeLabel = (type: Document["type"]) => {
    switch (type) {
      case "contract":
        return "근로계약서";
      case "signature":
        return "서명";
      case "registration":
        return "등록";
      case "insurance":
        return "보험";
      case "welfare":
        return "복리후생";
      case "other":
        return "기타";
    }
  };

  const handleOpenUploadModal = (doc: Document) => {
    setSelectedDoc(doc);
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitFile = () => {
    if (!selectedDoc || !selectedFile) return;

    // 파일 업로드 시뮬레이션
    uploadDocumentFile(selectedDoc.id, selectedFile.name, "file-content");
    
    // 문서 목록 새로고침
    if (worker) {
      const userDocs = getUserDocuments(worker.id);
      setDocuments(userDocs);
    }
    
    // 모달 닫기 및 상태 초기화
    setIsUploadModalOpen(false);
    setSelectedDoc(null);
    setSelectedFile(null);
  };

  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setSelectedDoc(null);
    setSelectedFile(null);
  };

  if (!user || !worker) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">입사서류 상세</h2>
            <p className="text-muted-foreground">
              {worker.name}님의 입사서류를 확인하고 관리하세요
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/company/documents")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Button>
        </div>

        {/* Worker Info */}
        <Card className="border-gray-200">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#22ccb7]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{worker.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {worker.company} · {worker.department} · {worker.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  입사일: {worker.joinDate || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Card
                key={doc.id}
                className="border-gray-200 hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
              >
                <CardContent>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#22ccb7]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{getTypeLabel(doc.type)}</span>
                          {doc.registrationDate && (
                            <>
                              <span>•</span>
                              <span>등록일: {doc.registrationDate}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {getStatusBadge(doc.status)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* 기업이 등록해야 할 서류이고 미등록 상태일 때만 등록 버튼 표시 */}
                      {isCompanyDocument(doc.type) && doc.status === "unregistered" && (
                        <Button
                          size="sm"
                          className="bg-[#22ccb7] hover:bg-[#1ab5a3]"
                          onClick={() => handleOpenUploadModal(doc)}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          등록
                        </Button>
                      )}
                      
                      {/* 등록된 서류는 열람/다운로드 버튼 표시 */}
                      {doc.status === "registered" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            열람
                          </Button>
                          {doc.canDownload && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              다운로드
                            </Button>
                          )}
                        </>
                      )}
                      
                      {/* 서명 완료된 서류는 열람 버튼만 표시 */}
                      {doc.status === "signature_completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          열람
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-muted-foreground">
                  {worker.name}님의 입사 서류가 없습니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* 파일 업로드 모달 */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>서류 등록</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {selectedDoc?.title} 서류를 등록하세요
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">파일 선택</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#22ccb7] file:text-white hover:file:bg-[#1ab5a3]"
                />
              </div>
              
              {selectedFile && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ 선택된 파일: {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    크기: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSubmitFile}
                disabled={!selectedFile}
                className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3]"
              >
                제출
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
