"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Custom hook to check if user is authenticated
export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
    }
  }, [router])
}

// Function to get user from localStorage
export function getUser() {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Function to get user role
export function getUserRole() {
  const user = getUser()
  return user?.role || null
}

// Function to logout user
export function logout() {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  window.location.href = "/"
}
