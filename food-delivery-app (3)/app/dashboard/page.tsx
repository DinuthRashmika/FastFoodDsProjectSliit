"use client"

import { useEffect, useState } from "react"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import RestaurantOwnerDashboard from "@/components/dashboards/restaurant-owner-dashboard"
import CustomerDashboard from "@/components/dashboards/customer-dashboard"
import DeliveryPersonDashboard from "@/components/dashboards/delivery-person-dashboard"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")

    if (!userData) {
      window.location.href = "/"
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("user")
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    )
  }

  if (!user) {
    return null // This will be handled by the useEffect redirect
  }

  // Render dashboard based on user role
  switch (user.role) {
    case "RESTAURANT_ADMIN":
      return <AdminDashboard user={user} />
    case "RESTAURANT_OWNER":
      return <RestaurantOwnerDashboard user={user} />
    case "CUSTOMER":
      return <CustomerDashboard user={user} />
    case "DELIVERY_PERSONNEL":
      return <DeliveryPersonDashboard user={user} />
    default:
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Invalid Role</h1>
            <p>Your account doesn't have a valid role assigned.</p>
            <button
              onClick={() => {
                localStorage.removeItem("user")
                localStorage.removeItem("token")
                window.location.href = "/"
              }}
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Back to Login
            </button>
          </div>
        </div>
      )
  }
}
