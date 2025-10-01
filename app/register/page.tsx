import { RegisterForm } from "@/components/auth/register-form"
import { AccessibilityToolbar } from "@/components/accessibility/accessibility-toolbar"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f4fdfc] to-white">
      <RegisterForm />
      <AccessibilityToolbar />
    </main>
  )
}
