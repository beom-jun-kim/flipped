"use client";

import type React from "react";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { WorkerHeader } from "@/components/worker/worker-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserDocuments, type Document } from "@/lib/documents";
import { FileText, Download, Eye } from "lucide-react";

export default function WorkerDocumentsPage() {
  const router = useRouter();
  const user = useMemo(() => getCurrentUser(), []);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard");
      return;
    }

    // localStorage 초기화 후 데이터 로드
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
            입사에 필요한 서류들을 확인하고 관리하세요
          </p>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Card
                key={doc.id}
                className="border-gray-200 hover:border-[#22ccb7]/30 hover:shadow-md transition-all duration-200"
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
                            <span>등록일: {doc.registrationDate}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
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
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {doc.status === "registered" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#22ccb7] hover:bg-[#1ab5a3]"
                          >
                            등록
                          </Button>
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
                    {/* <div className="text-sm text-muted-foreground">
                      {doc.canDownload ? (
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          다운로드 가능
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </div> */}
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
    </div>
  );
}
