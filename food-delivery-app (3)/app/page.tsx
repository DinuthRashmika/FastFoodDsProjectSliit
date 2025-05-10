import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  // Check if user is already logged in
  const isLoggedIn = typeof window !== "undefined" ? localStorage.getItem("user") : null

  if (isLoggedIn) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Fast Food App</h1>
        <LoginForm />
      </div>
    </main>
  )
}
