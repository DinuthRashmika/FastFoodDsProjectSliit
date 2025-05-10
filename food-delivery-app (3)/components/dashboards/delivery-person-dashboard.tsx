"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { LogOut, Bell, MapPin, Truck, History, DollarSign, User, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// @ts-ignore
export default function DeliveryPersonDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("active")

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-black text-white p-4">
        <div className="flex items-center justify-center h-16 mb-8">
          <h1 className="text-xl font-bold">Delivery Dashboard</h1>
        </div>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "active" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("active")}
          >
            <Truck className="mr-2 h-5 w-5" />
            Active Deliveries
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "history" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            <History className="mr-2 h-5 w-5" />
            Delivery History
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "earnings" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("earnings")}
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Earnings
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "profile" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="mr-2 h-5 w-5" />
            My Profile
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "settings" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
        <div className="absolute bottom-4 left-0 w-full px-4">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800" onClick={handleLogout}>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.fullName || "Delivery Person"}</h1>
            <p className="text-gray-600">
              <span className="inline-flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Online - Ready for deliveries
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Dashboard content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Today's Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">8</div>
                  <p className="text-xs text-green-500 mt-1">+2 from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Today's Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$64</div>
                  <p className="text-xs text-green-500 mt-1">+$12 from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.9/5</div>
                  <p className="text-xs text-green-500 mt-1">+0.1 from last week</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Order #3045</h3>
                      <p className="text-sm text-gray-500">Burger Palace</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-gray-100 rounded-full p-2 mr-3">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">123 Main St, Restaurant Row</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gray-100 rounded-full p-2 mr-3">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-gray-500">456 Oak Ave, Apt 7B</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button className="bg-black hover:bg-gray-800">Navigate</Button>
                    <Button variant="outline">Contact Customer</Button>
                    <Button variant="outline">Mark as Delivered</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "3046",
                      restaurant: "Pizza Heaven",
                      address: "789 Pine St",
                      status: "Ready for Pickup",
                      time: "10 min",
                    },
                    {
                      id: "3047",
                      restaurant: "Sushi World",
                      address: "321 Cedar Rd",
                      status: "Preparing",
                      time: "25 min",
                    },
                  ].map((delivery, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Order #{delivery.id}</p>
                        <p className="text-sm text-gray-500">{delivery.restaurant}</p>
                        <p className="text-sm text-gray-500">{delivery.address}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            delivery.status === "Ready for Pickup"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {delivery.status}
                        </span>
                        <p className="text-sm mt-1">{delivery.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Delivery history content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Earnings content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Profile content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Settings content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
