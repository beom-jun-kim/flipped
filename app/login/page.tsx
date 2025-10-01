import { LoginForm } from "@/components/auth/login-form"
import { ChatButton } from "@/components/accessibility/accessibility-toolbar"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f4fdfc] to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#22ccb7] mb-2">장애인 인사관리 플랫폼</h1>
          <p className="text-muted-foreground">모두를 위한 접근성 높은 근무 환경</p>
        </div>
        <LoginForm />
      </div>
      <ChatButton />
    </main>
  )
}
