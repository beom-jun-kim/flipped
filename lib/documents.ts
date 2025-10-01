"use client"

export interface Document {
  id: string
  userId: string
  userName: string
  title: string
  type: "resume" | "certificate" | "health" | "other"
  fileName: string
  uploadedAt: string
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewNote?: string
}

const DOCUMENTS_KEY = "documents"

export function getDocuments(): Document[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(DOCUMENTS_KEY)
  return data ? JSON.parse(data) : []
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
    status: "pending",
  }

  saveDocument(doc)
  return doc
}

export function getUserDocuments(userId: string): Document[] {
  const docs = getDocuments()
  return docs.filter((d) => d.userId === userId).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
}

export function getAllDocuments(): Document[] {
  const docs = getDocuments()
  return docs.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
}

export function reviewDocument(
  docId: string,
  status: "approved" | "rejected",
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
