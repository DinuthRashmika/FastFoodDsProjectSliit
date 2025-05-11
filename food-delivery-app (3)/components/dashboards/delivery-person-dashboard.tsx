"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Bell, MapPin, Truck, History, Clock, CheckCircle, Navigation } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { useToast } from "@/components/ui/use-toast"

interface Location {
    latitude: number
    longitude: number
}

interface Delivery {
    id: string
    orderId: string
    restaurantId: string
    restaurantLocation: Location
    customerLocation: Location
    customerAddress: string
    driverId: string | null
    status: "PENDING" | "ASSIGNED" | "PICKED_UP" | "DELIVERED" | "CANCELLED"
    createdAt: string
    updatedAt: string
}

interface User {
    id: string
    fullName: string
    email: string
}

const DeliveryMap = dynamic(() => import("@/components/delivery-map"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">Loading map...</div>,
})

export default function DeliveryPersonDashboard({ user }: { user: User }) {
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("pending")
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showMap, setShowMap] = useState(false)
    const [isAccepting, setIsAccepting] = useState(false)

    const fetchDeliveries = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("http://localhost:8087/deliveries")

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`)
            }

            const data = await response.json()
            setDeliveries(data)
            setError(null)
        } catch (err) {
            console.error("Failed to fetch deliveries:", err)
            setError("Failed to load deliveries. Please try again later.")
            setDeliveries([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDeliveries()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        window.location.href = "/"
    }

    const handleViewDeliveryDetails = (delivery: Delivery) => {
        setSelectedDelivery(delivery)
        setShowMap(true)
    }

    const closeDeliveryDetails = () => {
        setShowMap(false)
    }

    const getGoogleMapsUrl = (delivery: Delivery | null) => {
        if (!delivery) return "https://www.google.com/maps"
        const { restaurantLocation, customerLocation } = delivery
        return `https://www.google.com/maps/dir/?api=1&origin=${restaurantLocation.latitude},${restaurantLocation.longitude}&destination=${customerLocation.latitude},${customerLocation.longitude}&travelmode=driving`
    }

    const handleAcceptDelivery = async (deliveryId: string) => {
        try {
            setIsAccepting(true)
            const response = await fetch(`http://localhost:8087/deliveries/${deliveryId}/accpet`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({
                    driverId: user.id
                })
            })

            if (!response.ok) {
                throw new Error(`Failed to accept delivery: ${response.status}`)
            }

            await fetchDeliveries()

            toast({
                title: "Delivery Accepted",
                description: "You have successfully accepted the delivery",
            })

            setShowMap(false)
        } catch (err) {
            console.error("Error accepting delivery:", err)
            toast({
                title: "Error",
                description: "Failed to accept delivery",
                variant: "destructive",
            })
        } finally {
            setIsAccepting(false)
        }
    }

    const pendingDeliveries = deliveries.filter(d => d.status === "PENDING")
    const assignedDeliveries = deliveries.filter(d => d.status === "ASSIGNED")
    const completedDeliveries = deliveries.filter(d => d.status === "DELIVERED")

    const getStatusBadge = (status: string) => {
        switch(status) {
            case "PENDING":
                return <Badge variant="secondary">Pending</Badge>
            case "ASSIGNED":
                return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>
            case "PICKED_UP":
                return <Badge className="bg-yellow-100 text-yellow-800">Picked Up</Badge>
            case "DELIVERED":
                return <Badge className="bg-green-100 text-green-800">Delivered</Badge>
            case "CANCELLED":
                return <Badge variant="destructive">Cancelled</Badge>
            default:
                return <Badge variant="outline">Unknown</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-black text-white p-4">
                <div className="flex items-center justify-center h-16 mb-8">
                    <h1 className="text-xl font-bold">Delivery Dashboard</h1>
                </div>
                <nav className="space-y-2">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-white hover:bg-gray-800 ${
                            activeTab === "pending" ? "bg-gray-800" : ""
                        }`}
                        onClick={() => setActiveTab("pending")}
                    >
                        <Clock className="mr-2 h-5 w-5" />
                        Pending Deliveries
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-white hover:bg-gray-800 ${
                            activeTab === "assigned" ? "bg-gray-800" : ""
                        }`}
                        onClick={() => setActiveTab("assigned")}
                    >
                        <Truck className="mr-2 h-5 w-5" />
                        Assigned Deliveries
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start text-white hover:bg-gray-800 ${
                            activeTab === "history" ? "bg-gray-800" : ""
                        }`}
                        onClick={() => setActiveTab("history")}
                    >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Delivery History
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
                        <h1 className="text-2xl font-bold">Welcome, {user?.fullName || "Driver"}</h1>
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
                {pendingDeliveries.length}
              </span>
                        </Button>
                    </div>
                </div>

                {/* Dashboard content */}
                <Tabs value={activeTab} className="space-y-4">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="pending" onClick={() => setActiveTab("pending")}>
                            <Clock className="mr-2 h-4 w-4" /> Pending
                        </TabsTrigger>
                        <TabsTrigger value="assigned" onClick={() => setActiveTab("assigned")}>
                            <Truck className="mr-2 h-4 w-4" /> Assigned
                        </TabsTrigger>
                        <TabsTrigger value="history" onClick={() => setActiveTab("history")}>
                            <CheckCircle className="mr-2 h-4 w-4" /> History
                        </TabsTrigger>
                    </TabsList>

                    {/* Pending Deliveries Tab */}
                    <TabsContent value="pending" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-500">Pending Deliveries</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{pendingDeliveries.length}</div>
                                    <p className="text-xs text-gray-500 mt-1">Waiting for driver assignment</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-500">Assigned Deliveries</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{assignedDeliveries.length}</div>
                                    <p className="text-xs text-gray-500 mt-1">Currently assigned</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-500">Completed Today</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{completedDeliveries.length}</div>
                                    <p className="text-xs text-gray-500 mt-1">Deliveries completed</p>
                                </CardContent>
                            </Card>
                        </div>

                        {isLoading ? (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : error ? (
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-red-500">{error}</div>
                                </CardContent>
                            </Card>
                        ) : pendingDeliveries.length > 0 ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending Delivery Requests</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pendingDeliveries.map((delivery) => (
                                            <div key={delivery.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg">Order #{delivery.orderId}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Created: {new Date(delivery.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(delivery.status)}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-start">
                                                        <div className="bg-gray-100 rounded-full p-2 mr-3">
                                                            <MapPin className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">Delivery Address</p>
                                                            <p className="text-sm text-gray-500">{delivery.customerAddress}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <Button
                                                        className="bg-black hover:bg-gray-800"
                                                        onClick={() => handleViewDeliveryDetails(delivery)}
                                                    >
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => window.open(getGoogleMapsUrl(delivery), '_blank')}
                                                    >
                                                        <Navigation className="mr-2 h-4 w-4" />
                                                        Navigate
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleAcceptDelivery(delivery.id)}
                                                        disabled={isAccepting}
                                                    >
                                                        {isAccepting ? "Processing..." : "Accept Delivery"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <p className="text-gray-500">No pending deliveries found</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Assigned Deliveries Tab */}
                    <TabsContent value="assigned">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assigned Deliveries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center p-6">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                    </div>
                                ) : assignedDeliveries.length > 0 ? (
                                    <div className="space-y-4">
                                        {assignedDeliveries.map((delivery) => (
                                            <div key={delivery.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg">Order #{delivery.orderId}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            Assigned: {new Date(delivery.updatedAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(delivery.status)}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm font-medium">Delivery to:</p>
                                                        <p className="text-sm text-gray-500">{delivery.customerAddress}</p>
                                                    </div>
                                                    <Button onClick={() => handleViewDeliveryDetails(delivery)}>View Details</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 p-6 text-center">No assigned deliveries available</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center p-6">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                    </div>
                                ) : completedDeliveries.length > 0 ? (
                                    <div className="space-y-4">
                                        {completedDeliveries.map((delivery) => (
                                            <div key={delivery.id} className="border-b pb-4">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">Order #{delivery.orderId}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Delivered on {new Date(delivery.updatedAt).toLocaleDateString()} at{" "}
                                                            {new Date(delivery.updatedAt).toLocaleTimeString()}
                                                        </p>
                                                        <p className="text-sm text-gray-500">To: {delivery.customerAddress}</p>
                                                    </div>
                                                    {getStatusBadge(delivery.status)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 p-6 text-center">No delivery history available</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Delivery Details Dialog with Map */}
                <Dialog open={showMap} onOpenChange={setShowMap}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedDelivery?.status === "PENDING" ? "Delivery Request" : "Delivery Details"}
                            </DialogTitle>
                            <DialogDescription>
                                Order #{selectedDelivery?.orderId}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-2">Delivery Information</h3>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Status:</span> {selectedDelivery?.status.replace("_", " ")}
                                    </p>
                                    <p>
                                        <span className="font-medium">Created:</span> {selectedDelivery?.createdAt ? new Date(selectedDelivery.createdAt).toLocaleString() : "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Last Updated:</span> {selectedDelivery?.updatedAt ? new Date(selectedDelivery.updatedAt).toLocaleString() : "N/A"}
                                    </p>

                                    <div className="mt-4">
                                        <h4 className="font-medium mb-1">Delivery Address:</h4>
                                        <p className="text-sm">{selectedDelivery?.customerAddress}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[400px] relative">
                                {selectedDelivery && (
                                    <DeliveryMap
                                        restaurantLocation={{
                                            lat: selectedDelivery.restaurantLocation.latitude,
                                            lng: selectedDelivery.restaurantLocation.longitude
                                        }}
                                        customerLocation={{
                                            lat: selectedDelivery.customerLocation.latitude,
                                            lng: selectedDelivery.customerLocation.longitude
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={closeDeliveryDetails}>
                                Close
                            </Button>
                            {selectedDelivery?.status === "PENDING" && (
                                <Button
                                    className="bg-black hover:bg-gray-800"
                                    onClick={() => handleAcceptDelivery(selectedDelivery.id)}
                                    disabled={isAccepting}
                                >
                                    {isAccepting ? "Processing..." : "Accept Delivery"}
                                </Button>
                            )}
                            <Button
                                className="bg-black hover:bg-gray-800"
                                onClick={() => window.open(getGoogleMapsUrl(selectedDelivery), '_blank')}
                            >
                                <Navigation className="mr-2 h-4 w-4" />
                                Navigate
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}