"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/auth"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = login(username, password)

      if (user) {
        // 역할에 따라 다른 대시보드로 이동
        if (user.role === "worker") {
          router.push("/worker/dashboard")
        } else {
          router.push("/company/dashboard")
        }
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-[#22ccb7]/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
        <CardDescription className="text-center">계정 정보를 입력하여 로그인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-12 text-base"
              aria-label="아이디 입력"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 text-base"
              aria-label="비밀번호 입력"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg" role="alert">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-[#22ccb7] hover:underline font-medium"
            >
              회원가입
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-muted-foreground text-center mb-3">테스트 계정</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="bg-[#f4fdfc] p-3 rounded-lg">
              <p className="font-medium text-foreground mb-1">근로자 계정</p>
              <p>아이디: test01 / 비밀번호: 1234</p>
            </div>
            <div className="bg-[#f4fdfc] p-3 rounded-lg">
              <p className="font-medium text-foreground mb-1">기업 계정</p>
              <p>아이디: test02 / 비밀번호: 1234</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
