"use client";

import type React from "react";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { WorkerHeader } from "@/components/worker/worker-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUserDocuments, isWorkerDocument, uploadDocumentFile, type Document } from "@/lib/documents";
import { FileText, Download, Eye, Upload, ExternalLink } from "lucide-react";

// 기관 URL 매핑
const INSTITUTION_URLS = {
  "산재보험": {
    name: "고용산재보험 토탈서비스",
    url: "https://total.comwel.or.kr/",
    description: "산재보험 관련 서류 발급"
  },
  "국민연금 가입증명서": {
    name: "국민연금공단",
    url: "https://www.nps.or.kr/gate.do",
    description: "국민연금 가입증명서 발급"
  },
  "중증장애인확인서": {
    name: "정부24",
    url: "https://www.gov.kr/portal/service/serviceInfo/B55258300013",
    description: "중증장애인확인서 발급"
  },
  "건강보험자격득실확인서": {
    name: "국민건강보험공단",
    url: "https://www.nhis.or.kr/nhis/index.do",
    description: "건강보험자격득실확인서 발급"
  },
  "고용보험자격이력내역서": {
    name: "정부24",
    url: "https://www.gov.kr/portal/service/serviceInfo/B49000100050",
    description: "고용보험자격이력내역서 발급"
  }
} as const;

export default function WorkerDocumentsPage() {
  const router = useRouter();
  const user = useMemo(() => getCurrentUser(), []);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard");
      return;
    }

    // localStorage 초기화 후 새로운 데이터 로드
    if (typeof window !== "undefined") {
      localStorage.removeItem("documents");
    }

    const userDocs = getUserDocuments(user.id);
    setDocuments(userDocs);
  }, [user]);

  const reloadDocuments = () => {
    if (!user) return;
    const userDocs = getUserDocuments(user.id);
    setDocuments(userDocs);
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
    reloadDocuments();
    
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

  const handleOpenInstitutionLink = (docTitle: string) => {
    const institution = INSTITUTION_URLS[docTitle as keyof typeof INSTITUTION_URLS];
    if (institution) {
      window.open(institution.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getInstitutionInfo = (docTitle: string) => {
    return INSTITUTION_URLS[docTitle as keyof typeof INSTITUTION_URLS];
  };

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">입사서류</h2>
          <p className="text-muted-foreground">
            입사에 필요한 서류 확인 및 관리
          </p>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Card
                key={doc.id}
                className="border-gray-200 hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200 py-0"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-[#22ccb7]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lggrid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {doc.registrationDate && (
                            <span>{doc.registrationDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
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
                      {getStatusBadge(doc.status)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* 기관 링크 버튼 - 해당 서류가 기관 URL에 매핑되어 있는 경우에만 표시 */}
                      {getInstitutionInfo(doc.title) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          onClick={() => handleOpenInstitutionLink(doc.title)}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          {getInstitutionInfo(doc.title)?.name}
                        </Button>
                      )}

                      {/* 근로자가 등록해야 할 서류이고 미등록 상태일 때만 등록 버튼 표시 */}
                      {isWorkerDocument(doc.type) && doc.status === "unregistered" && (
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
                <p className="text-muted-foreground">입사 서류가 없습니다</p>
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
              {/* 기관 링크 정보 표시 */}
              {selectedDoc && getInstitutionInfo(selectedDoc.title) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 mb-2">
                    💡 {getInstitutionInfo(selectedDoc.title)?.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    onClick={() => handleOpenInstitutionLink(selectedDoc.title)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {getInstitutionInfo(selectedDoc.title)?.name}에서 발급받기
                  </Button>
                </div>
              )}
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
