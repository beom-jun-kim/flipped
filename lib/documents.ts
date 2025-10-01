"use client"

export interface Document {
  id: string
  userId: string
  userName: string
  title: string
  type: "contract" | "signature" | "registration" | "insurance" | "welfare" | "other"
  fileName?: string
  uploadedAt?: string
  status: "unregistered" | "signature_completed" | "before_signature" | "registered"
  reviewedBy?: string
  reviewNote?: string
  canDownload?: boolean
  registrationDate?: string
}

const DOCUMENTS_KEY = "documents"

export function getDocuments(): Document[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(DOCUMENTS_KEY)
  if (data) {
    return JSON.parse(data)
  }
  
  // 더미 데이터가 없으면 초기 더미 데이터 생성
  const dummyData = getDummyDocuments()
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(dummyData))
  return dummyData
}


function getDummyDocuments(): Document[] {
  const registrationDate = "2024-09-20"

  return [
    // 김근로 (test01) - 입사 서류 목록
    
    // ✅ 기업이 작성·제공해야 하는 서류 (이미 등록된 상태)
    {
      id: "doc-001",
      userId: "test01",
      userName: "김근로",
      title: "근로계약서",
      type: "contract",
      status: "registered",
      canDownload: true,
      registrationDate: registrationDate
    },
    {
      id: "doc-002",
      userId: "test01",
      userName: "김근로",
      title: "전자 서명 동의서",
      type: "signature",
      status: "signature_completed",
      canDownload: true,
      registrationDate: registrationDate
    },
    {
      id: "doc-003",
      userId: "test01",
      userName: "김근로",
      title: "재택근무 보안서약서",
      type: "signature",
      status: "signature_completed",
      canDownload: true,
      registrationDate: registrationDate
    },
    {
      id: "doc-004",
      userId: "test01",
      userName: "김근로",
      title: "개인정보 활용 동의서",
      type: "signature",
      status: "before_signature"
    },
    {
      id: "doc-005",
      userId: "test01",
      userName: "김근로",
      title: "비밀유지 및 겸업 금지 서약서",
      type: "signature",
      status: "before_signature"
    },
    
    // ✅ 근로자가 직접 발급받아 제출해야 하는 서류 (미등록 상태)
    {
      id: "doc-006",
      userId: "test01",
      userName: "김근로",
      title: "주민등록등본",
      type: "registration",
      status: "unregistered"
    },
    {
      id: "doc-007",
      userId: "test01",
      userName: "김근로",
      title: "산재보험자격이력내역서",
      type: "insurance",
      status: "unregistered"
    },
    {
      id: "doc-008",
      userId: "test01",
      userName: "김근로",
      title: "국민연금가입증명서",
      type: "insurance",
      status: "unregistered"
    },
    {
      id: "doc-009",
      userId: "test01",
      userName: "김근로",
      title: "중증장애인확인서",
      type: "welfare",
      status: "unregistered"
    },
    {
      id: "doc-010",
      userId: "test01",
      userName: "김근로",
      title: "건강보험득실확인서",
      type: "insurance",
      status: "unregistered"
    },
    {
      id: "doc-011",
      userId: "test01",
      userName: "김근로",
      title: "복지카드",
      type: "welfare",
      status: "unregistered"
    },
    {
      id: "doc-012",
      userId: "test01",
      userName: "김근로",
      title: "고용보험자격이력내역서",
      type: "insurance",
      status: "unregistered"
    }
  ]
}

export function saveDocument(doc: Document): void {
  if (typeof window === "undefined") return
  const docs = getDocuments()
  const existingIndex = docs.findIndex((d) => d.id === doc.id)

  if (existingIndex >= 0) {
    docs[existingIndex] = doc
  } else {
    docs.push(doc)
  }

  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs))
}

export function uploadDocument(
  userId: string,
  userName: string,
  title: string,
  type: Document["type"],
  fileName: string,
): Document {
  const doc: Document = {
    id: `doc-${Date.now()}`,
    userId,
    userName,
    title,
    type,
    fileName,
    uploadedAt: new Date().toISOString(),
    status: "unregistered",
  }

  saveDocument(doc)
  return doc
}

export function getUserDocuments(userId: string): Document[] {
  const docs = getDocuments()
  return docs.filter((d) => d.userId === userId).sort((a, b) => {
    const aDate = a.uploadedAt || a.registrationDate || ""
    const bDate = b.uploadedAt || b.registrationDate || ""
    return bDate.localeCompare(aDate)
  })
}

export function getAllDocuments(): Document[] {
  const docs = getDocuments()
  return docs.sort((a, b) => {
    const aDate = a.uploadedAt || a.registrationDate || ""
    const bDate = b.uploadedAt || b.registrationDate || ""
    return bDate.localeCompare(aDate)
  })
}

export function reviewDocument(
  docId: string,
  status: "unregistered" | "signature_completed" | "before_signature" | "registered",
  reviewedBy: string,
  reviewNote?: string,
): void {
  const docs = getDocuments()
  const doc = docs.find((d) => d.id === docId)
  if (doc) {
    doc.status = status
    doc.reviewedBy = reviewedBy
    doc.reviewNote = reviewNote
    saveDocument(doc)
  }
}

// 서류 타입별 등록 주체 구분
export function isCompanyDocument(type: Document["type"]): boolean {
  // 기업이 작성·제공해야 하는 서류: 계약서, 서명 관련
  return ["contract", "signature"].includes(type)
}

export function isWorkerDocument(type: Document["type"]): boolean {
  // 근로자가 직접 발급받아 제출해야 하는 서류: 등록, 보험, 복리후생 관련
  return ["registration", "insurance", "welfare"].includes(type)
}

// 파일 업로드 함수
export function uploadDocumentFile(
  docId: string,
  fileName: string,
  fileContent: string
): void {
  const docs = getDocuments()
  const doc = docs.find((d) => d.id === docId)
  if (doc) {
    doc.fileName = fileName
    doc.uploadedAt = new Date().toISOString()
    doc.status = "registered"
    doc.registrationDate = new Date().toISOString().split('T')[0]
    doc.canDownload = true
    saveDocument(doc)
  }
}
