"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Truck,
  LogOut,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash,
  Eye,
  RefreshCw,
  Utensils,
  DollarSign,
  ClipboardList,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RestaurantOwnerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [selectedMenuItem, setSelectedMenuItem] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [restaurantDetails, setRestaurantDetails] = useState(null)
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false)
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [driverAvailability, setDriverAvailability] = useState({})

  // Add a new state for the available drivers dialog
  const [isViewDriversDialogOpen, setIsViewDriversDialogOpen] = useState(false)
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)

  const [menuForm, setMenuForm] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    restaurantid: "",
    imageUrl: "",
  })

  // Fetch restaurant details
  const fetchRestaurantDetails = async () => {
    setLoading(true)
    setError("")
    try {
      // Assuming the user object has the restaurant ID
      const restaurantId = user.id || localStorage.getItem("restaurantId")

      if (!restaurantId) {
        throw new Error("Restaurant ID not found")
      }

      const response = await fetch(`http://localhost:8081/api/v1/restaurant/getuserbyid/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details")
      }

      const data = await response.json()
      setRestaurantDetails(data)

      // Set the restaurant ID in the menu form
      setMenuForm((prev) => ({
        ...prev,
        restaurantid: restaurantId,
      }))
    } catch (err) {
      setError(err.message || "An error occurred while fetching restaurant details")
      console.error(err)
      // For demo purposes, set some sample data if API fails
      setRestaurantDetails({
        id: user.id || 1,
        name: "Your Restaurant",
        address: "123 Main St",
        phone: "555-1234",
        email: user.email || "restaurant@example.com",
        city: "New York",
        state: "NY",
        zip: "10001",
        photoUrl: "/placeholder.svg?height=100&width=100",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch menu items for this restaurant
  const fetchMenuItems = async () => {
    setLoading(true)
    setError("")
    try {
      const restaurantId = restaurantDetails?.id || user.id || localStorage.getItem("restaurantId")

      if (!restaurantId) {
        throw new Error("Restaurant ID not found")
      }

      // Fetch all menu items and filter by restaurant ID
      const response = await fetch("http://localhost:8081/api/v1/menu/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch menu items")
      }

      const data = await response.json()
      // Filter menu items for this restaurant
      const filteredMenuItems = data.filter((item) => item.restaurantid.toString() === restaurantId.toString())
      setMenuItems(filteredMenuItems)
    } catch (err) {
      setError(err.message || "An error occurred while fetching menu items")
      console.error(err)
      // For demo purposes, set some sample data if API fails
      setMenuItems([
        {
          id: 1,
          name: "Cheeseburger",
          description: "Delicious burger with cheese",
          price: 8.99,
          restaurantid: restaurantDetails?.id || user.id || 1,
          imageUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          name: "French Fries",
          description: "Crispy golden fries",
          price: 3.99,
          restaurantid: restaurantDetails?.id || user.id || 1,
          imageUrl: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 3,
          name: "Chicken Sandwich",
          description: "Grilled chicken with lettuce and mayo",
          price: 7.99,
          restaurantid: restaurantDetails?.id || user.id || 1,
          imageUrl: "/placeholder.svg?height=100&width=100",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders for this restaurant
  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const restaurantId = restaurantDetails?.id || user.id || localStorage.getItem("restaurantId")

      if (!restaurantId) {
        throw new Error("Restaurant ID not found")
      }

      const response = await fetch(`http://localhost:8084/api/orders/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching orders")
      console.error(err)
      // For demo purposes, set some sample data if API fails
      setOrders([
        {
          id: "1",
          customerId: "101",
          restaurantId: restaurantDetails?.id || user.id || "1",
          items: [
            { menuItemId: "1", name: "Cheeseburger", quantity: 2, price: 8.99 },
            { menuItemId: "2", name: "French Fries", quantity: 1, price: 3.99 },
          ],
          totalPrice: 21.97,
          status: "CONFIRMED",
          createdAt: "2023-06-15T14:30:00",
          updatedAt: "2023-06-15T14:35:00",
          deliveryAddress: "123 Main St, Apt 4B",
          specialInstructions: "Extra ketchup please",
          phoneNumber: "555-1234",
          deliveryTimeSlot: "18:00-18:30",
        },
        {
          id: "2",
          customerId: "102",
          restaurantId: restaurantDetails?.id || user.id || "1",
          items: [
            { menuItemId: "3", name: "Chicken Sandwich", quantity: 1, price: 7.99 },
            { menuItemId: "2", name: "French Fries", quantity: 1, price: 3.99 },
          ],
          totalPrice: 11.98,
          status: "PREPARING",
          createdAt: "2023-06-15T15:00:00",
          updatedAt: "2023-06-15T15:10:00",
          deliveryAddress: "456 Oak Ave",
          specialInstructions: "",
          phoneNumber: "555-5678",
          deliveryTimeSlot: "19:00-19:30",
        },
        {
          id: "3",
          customerId: "103",
          restaurantId: restaurantDetails?.id || user.id || "1",
          items: [
            { menuItemId: "1", name: "Cheeseburger", quantity: 1, price: 8.99 },
            { menuItemId: "3", name: "Chicken Sandwich", quantity: 1, price: 7.99 },
          ],
          totalPrice: 16.98,
          status: "DELIVERED",
          createdAt: "2023-06-15T13:00:00",
          updatedAt: "2023-06-15T13:45:00",
          deliveryAddress: "789 Pine Rd",
          specialInstructions: "No pickles",
          phoneNumber: "555-9012",
          deliveryTimeSlot: "13:30-14:00",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Check driver availability
  const checkDriverAvailability = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:8087/drivers/${driverId}/availability`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to check driver availability")
      }

      const data = await response.json()
      return data.available
    } catch (err) {
      console.error(`Error checking availability for driver ${driverId}:`, err)
      return false // Default to unavailable if there's an error
    }
  }

  // Also update the fetchDrivers function to only get available drivers for assignment
  const fetchDrivers = async () => {
    setLoading(true)
    setError("")
    try {
      // Try to use the available drivers endpoint first
      const response = await fetch("http://localhost:8087/drivers/available", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        // Fall back to filtering if the endpoint doesn't exist
        const allDriversResponse = await fetch("http://localhost:8087/drivers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!allDriversResponse.ok) {
          throw new Error("Failed to fetch drivers")
        }

        const allDrivers = await allDriversResponse.json()
        const availableDriversList = []

        for (const driver of allDrivers) {
          const isAvailable = await checkDriverAvailability(driver.id)
          if (isAvailable) {
            availableDriversList.push({ ...driver, available: true })
          }
        }

        setDrivers(availableDriversList)
      } else {
        // Use the available drivers directly
        const availableDriversData = await response.json()
        setDrivers(availableDriversData.map((driver) => ({ ...driver, available: true })))
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching drivers")
      console.error(err)
      // For demo purposes, set some sample data if API fails
      setDrivers([
        {
          id: "1",
          name: "John Doe",
          vehicleNumber: "ABC-1234",
          phoneNumber: "555-1111",
          currentLocation: { latitude: 37.7749, longitude: -122.4194 },
          available: true,
        },
        {
          id: "2",
          name: "Jane Smith",
          vehicleNumber: "DEF-5678",
          phoneNumber: "555-2222",
          currentLocation: { latitude: 37.7833, longitude: -122.4167 },
          available: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Replace the fetchAvailableDrivers function with this optimized version that only gets available drivers
  const fetchAvailableDrivers = async () => {
    setLoadingDrivers(true)
    setError("")
    try {
      // Fetch all drivers without filtering
      const response = await fetch("http://localhost:8087/drivers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch drivers")
      }

      const allDrivers = await response.json()

      // Check availability for each driver but don't filter out unavailable ones
      const driversWithAvailability = []

      for (const driver of allDrivers) {
        try {
          const availabilityResponse = await fetch(`http://localhost:8087/drivers/${driver.id}/availability`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })

          let isAvailable = false
          if (availabilityResponse.ok) {
            const availabilityData = await availabilityResponse.json()
            isAvailable = availabilityData.available
          }

          // Add all drivers to the list, with their availability status
          driversWithAvailability.push({
            ...driver,
            available: isAvailable,
          })
        } catch (err) {
          console.error(`Error checking availability for driver ${driver.id}:`, err)
          // Still add the driver even if availability check fails
          driversWithAvailability.push({
            ...driver,
            available: false,
          })
        }
      }

      setAvailableDrivers(driversWithAvailability)
      setIsViewDriversDialogOpen(true)
    } catch (err) {
      setError(err.message || "An error occurred while fetching drivers")
      console.error(err)
      // For demo purposes, set some sample data if API fails
      setAvailableDrivers([
        {
          id: "1",
          name: "John Doe",
          vehicleNumber: "ABC-1234",
          phoneNumber: "555-1111",
          currentLocation: { latitude: 37.7749, longitude: -122.4194 },
          available: true,
        },
        {
          id: "2",
          name: "Jane Smith",
          vehicleNumber: "DEF-5678",
          phoneNumber: "555-2222",
          currentLocation: { latitude: 37.7833, longitude: -122.4167 },
          available: false,
        },
        {
          id: "3",
          name: "Bob Johnson",
          vehicleNumber: "GHI-9012",
          phoneNumber: "555-3333",
          currentLocation: { latitude: 37.7694, longitude: -122.4862 },
          available: true,
        },
        {
          id: "4",
          name: "Sarah Williams",
          vehicleNumber: "JKL-3456",
          phoneNumber: "555-4444",
          currentLocation: { latitude: 37.7831, longitude: -122.4039 },
          available: false,
        },
      ])
      setIsViewDriversDialogOpen(true)
    } finally {
      setLoadingDrivers(false)
    }
  }

  // Add menu item
  const addMenuItem = async () => {
    setLoading(true)
    setError("")
    try {
      const restaurantId = restaurantDetails?.id || user.id || localStorage.getItem("restaurantId")

      if (!restaurantId) {
        throw new Error("Restaurant ID not found")
      }

      const response = await fetch(`http://localhost:8081/api/v1/menu/add/${restaurantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(menuForm),
      })

      if (!response.ok) {
        throw new Error("Failed to add menu item")
      }

      // Refresh menu items
      fetchMenuItems()
      // Reset form
      setMenuForm({
        id: "",
        name: "",
        description: "",
        price: 0,
        restaurantid: restaurantId,
        imageUrl: "",
      })
      setIsMenuDialogOpen(false)
    } catch (err) {
      setError(err.message || "An error occurred while adding menu item")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Update menu item
  const updateMenuItem = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8081/api/v1/menu/update/${menuForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(menuForm),
      })

      if (!response.ok) {
        throw new Error("Failed to update menu item")
      }

      // Refresh menu items
      fetchMenuItems()
      // Reset form
      setMenuForm({
        id: "",
        name: "",
        description: "",
        price: 0,
        restaurantid: restaurantDetails?.id || user.id || localStorage.getItem("restaurantId"),
        imageUrl: "",
      })
      setIsEditMode(false)
      setIsMenuDialogOpen(false)
    } catch (err) {
      setError(err.message || "An error occurred while updating menu item")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Delete menu item
  const deleteMenuItem = async (menuId) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8081/api/v1/menu/delete/${menuId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete menu item")
      }

      // Refresh menu items
      fetchMenuItems()
    } catch (err) {
      setError(err.message || "An error occurred while deleting menu item")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8084/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: status ,
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Refresh orders
      fetchOrders()
    } catch (err) {
      setError(err.message || "An error occurred while updating order status")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Assign driver to delivery
  const assignDriver = async (orderId, driverId) => {
    setLoading(true)
    setError("")
    try {
      // First create a delivery
      const createDeliveryResponse = await fetch("http://localhost:8087/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          orderId: orderId,
          restaurantId: restaurantDetails?.id || user.id || localStorage.getItem("restaurantId"),
          restaurantLocation: { latitude: 37.7749, longitude: -122.4194 }, // Default location
          customerLocation: { latitude: 37.7833, longitude: -122.4167 }, // Default location
          customerAddress: orders.find((o) => o.id === orderId)?.deliveryAddress || "",
          status: "PENDING",
        }),
      })

      if (!createDeliveryResponse.ok) {
        throw new Error("Failed to create delivery")
      }

      const deliveryData = await createDeliveryResponse.json()
      const deliveryId = deliveryData.id

      // Then assign driver to the delivery
      const assignDriverResponse = await fetch(`http://localhost:8087/deliveries/${deliveryId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ driverId }),
      })

      if (!assignDriverResponse.ok) {
        throw new Error("Failed to assign driver")
      }

      // Update order status to READY
      await updateOrderStatus(orderId, "READY")

      // Close dialog
      setIsAssignDriverDialogOpen(false)
      setSelectedOrderForDriver(null)
    } catch (err) {
      setError(err.message || "An error occurred while assigning driver")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Handle menu form input change
  const handleMenuInputChange = (e) => {
    const { name, value } = e.target
    setMenuForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  // Open menu form for editing
  const openEditMenuForm = (menuItem) => {
    setMenuForm({
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      restaurantid: menuItem.restaurantid,
      imageUrl: menuItem.imageUrl,
    })
    setIsEditMode(true)
    setIsMenuDialogOpen(true)
  }

  // Open menu form for adding
  const openAddMenuForm = () => {
    setMenuForm({
      id: "",
      name: "",
      description: "",
      price: 0,
      restaurantid: restaurantDetails?.id || user.id || localStorage.getItem("restaurantId"),
      imageUrl: "",
    })
    setIsEditMode(false)
    setIsMenuDialogOpen(true)
  }

  // Open assign driver dialog
  const openAssignDriverDialog = (order) => {
    setSelectedOrderForDriver(order)
    fetchDrivers()
    setIsAssignDriverDialogOpen(true)
  }

  // Load initial data
  useEffect(() => {
    fetchRestaurantDetails()
  }, [])

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "menu") {
      fetchMenuItems()
    } else if (activeTab === "orders") {
      fetchOrders()
    }
  }, [activeTab, restaurantDetails])

  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("restaurantId")
    window.location.href = "/"
  }

  // Calculate statistics for overview
  const totalOrders = orders.length
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    )
  }).length

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const pendingOrders = orders.filter(
    (order) => order.status === "CREATED" || order.status === "CONFIRMED" || order.status === "PREPARING",
  ).length

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-black text-white p-4">
        <div className="flex items-center justify-center h-16 mb-8">
          <h1 className="text-xl font-bold">Restaurant Dashboard</h1>
        </div>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "overview" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${activeTab === "menu" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            <Utensils className="mr-2 h-5 w-5" />
            Menu
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "orders" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Orders
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "revenue" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("revenue")}
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Revenue
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "customers" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("customers")}
          >
            <Users className="mr-2 h-5 w-5" />
            Customers
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
            <h1 className="text-2xl font-bold">
              Welcome, {user.fullName || restaurantDetails?.name || "Restaurant Owner"}
            </h1>
            <p className="text-gray-600">Restaurant Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                {pendingOrders}
              </span>
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Dashboard content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Today's Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{todayOrders}</div>
                  <p className="text-xs text-green-500 mt-1">+8% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-green-500 mt-1">+12% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Active Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{menuItems.length}</div>
                  <p className="text-xs text-gray-500 mt-1">2 new items added</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Customer Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.8/5</div>
                  <p className="text-xs text-green-500 mt-1">+0.2 from last week</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">Customer {order.customerId}</p>
                        </div>
                        <div className="text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "CREATED"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "DELIVERED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="text-sm font-medium">4.7 ★</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Menu Management</CardTitle>
                <div className="flex space-x-2">
                  <Button onClick={openAddMenuForm} variant="outline" size="sm" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                  <Button
                    onClick={() => fetchMenuItems()}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMenuItems.length > 0 ? (
                          filteredMenuItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 overflow-hidden">
                                    <img
                                      src={item.imageUrl || "/placeholder.svg?height=100&width=100"}
                                      alt={item.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => openEditMenuForm(item)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteMenuItem(item.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                              {menuItems.length === 0 ? "No menu items found" : "No matching menu items found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menu Form Dialog */}
            <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{isEditMode ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input id="name" name="name" value={menuForm.name} onChange={handleMenuInputChange} required />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={menuForm.description}
                        onChange={handleMenuInputChange}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={menuForm.price}
                        onChange={handleMenuInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={menuForm.imageUrl}
                        onChange={handleMenuInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMenuDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={isEditMode ? updateMenuItem : addMenuItem} disabled={loading}>
                      {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Management</CardTitle>
                <Button
                  onClick={() => fetchOrders()}
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map((order,index) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${order.totalPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === "DELIVERED"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "CONFIRMED" || order.status === "PREPARING"
                                        ? "bg-blue-100 text-blue-800"
                                        : order.status === "READY"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order)
                                      setIsOrderDialogOpen(true)
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Select
                                    defaultValue={order.status}
                                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                                  >
                                    <SelectTrigger className="h-8 w-32">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="CREATED">Created</SelectItem>
                                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                      <SelectItem value="PREPARING">Preparing</SelectItem>
                                      <SelectItem value="READY">Ready</SelectItem>
                                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchAvailableDrivers}
                                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                  >
                                    <Truck className="h-4 w-4 mr-1" />
                                    View All Drivers
                                  </Button>
                                  {(order.status === "READY" || order.status === "PREPARING") && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openAssignDriverDialog(order)}
                                      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                    >
                                      <Truck className="h-4 w-4 mr-1" />
                                      Assign Delivery
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                              {orders.length === 0 ? "No orders found" : "No matching orders found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">Order #{selectedOrder.id}</h3>
                        <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge
                        className={`${
                          selectedOrder.status === "DELIVERED"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.status === "CONFIRMED" || selectedOrder.status === "PREPARING"
                              ? "bg-blue-100 text-blue-800"
                              : selectedOrder.status === "READY"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedOrder.status}
                      </Badge>
                    </div>

                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Customer Information</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Customer ID:</span> {selectedOrder.customerId}
                        </div>
                        <div>
                          <span className="text-gray-500">Phone:</span> {selectedOrder.phoneNumber}
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Delivery Address:</span> {selectedOrder.deliveryAddress}
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Delivery Time Slot:</span> {selectedOrder.deliveryTimeSlot}
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <div>${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 font-medium">
                          <div>Total</div>
                          <div>${selectedOrder.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.specialInstructions && (
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Special Instructions</h4>
                        <p className="text-sm">{selectedOrder.specialInstructions}</p>
                      </div>
                    )}

                    <DialogFooter>
                      <div className="flex space-x-2">
                        <Select
                          defaultValue={selectedOrder.status}
                          onValueChange={(value) => {
                            updateOrderStatus(selectedOrder.id, value)
                            setIsOrderDialogOpen(false)
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CREATED">Created</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="PREPARING">Preparing</SelectItem>
                            <SelectItem value="READY">Ready</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                          </SelectContent>
                        </Select>

                        {(selectedOrder.status === "READY" || selectedOrder.status === "PREPARING") && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              openAssignDriverDialog(selectedOrder)
                              setIsOrderDialogOpen(false)
                            }}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Assign Driver
                          </Button>
                        )}
                      </div>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Assign Driver Dialog */}
            <Dialog open={isAssignDriverDialogOpen} onOpenChange={setIsAssignDriverDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Driver to Order #{selectedOrderForDriver?.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Select an available driver to deliver this order.</p>

                  {loading ? (
                    <div className="flex justify-center items-center h-20">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {drivers.length > 0 ? (
                        drivers.map((driver) => (
                          <div key={driver.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                              <div>
                                <p className="font-medium">{driver.name}</p>
                                <p className="text-xs text-gray-500">
                                  {driver.vehicleNumber} • {driver.phoneNumber}
                                </p>
                                <Badge
                                  className={
                                    driver.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }
                                >
                                  {driver.available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => assignDriver(selectedOrderForDriver.id, driver.id)}
                              disabled={loading || !driver.available}
                            >
                              Assign
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-4 border rounded-md">
                          <p className="text-gray-500">No available drivers found.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-green-500 mt-1">+15% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Average Order Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"}
                        </div>
                        <p className="text-xs text-green-500 mt-1">+5% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-green-500 mt-1">+20% from last month</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="h-80 bg-gray-100 rounded-md p-4 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Sales Last 12 Months</h3>
                    <div className="flex-1 flex items-end space-x-1">
                      {/* January */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '40%' }}
                            title="January: 240 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Jan</span>
                      </div>

                      {/* February */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '35%' }}
                            title="February: 210 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Feb</span>
                      </div>

                      {/* March */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '50%' }}
                            title="March: 300 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Mar</span>
                      </div>

                      {/* April */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '55%' }}
                            title="April: 330 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Apr</span>
                      </div>

                      {/* May */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '60%' }}
                            title="May: 360 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">May</span>
                      </div>

                      {/* June */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '75%' }}
                            title="June: 450 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Jun</span>
                      </div>

                      {/* July */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '80%' }}
                            title="July: 480 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Jul</span>
                      </div>

                      {/* August */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '70%' }}
                            title="August: 420 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Aug</span>
                      </div>

                      {/* September */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '65%' }}
                            title="September: 390 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Sep</span>
                      </div>

                      {/* October */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '85%' }}
                            title="October: 510 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Oct</span>
                      </div>

                      {/* November */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '90%' }}
                            title="November: 540 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Nov</span>
                      </div>

                      {/* December */}
                      <div className="flex-1 flex flex-col items-center">
                        <div
                            className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors"
                            style={{ height: '95%' }}
                            title="December: 570 units"
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">Dec</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-4">Revenue by Menu Item</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {menuItems.slice(0, 5).map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{Math.floor(Math.random() * 50) + 10}</td>
                            <td className="px-4 py-2">
                              ${(item.price * (Math.floor(Math.random() * 50) + 10)).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Customer management content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Restaurant settings content would go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* View Available Drivers Dialog */}
        <Dialog open={isViewDriversDialogOpen} onOpenChange={setIsViewDriversDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>All Delivery Drivers</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">All delivery drivers and their current availability status.</p>

              {loadingDrivers ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <div className="space-y-2">
                  {availableDrivers.length > 0 ? (
                    availableDrivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-xs text-gray-500">
                              {driver.vehicleNumber} • {driver.phoneNumber}
                            </p>
                            <Badge
                              className={driver.available ? "bg-green-100 text-green-800" : "bg-green-100 text-green-800"}
                            >
                              {driver.available ? "Online ": "Online"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>Current Location:</p>
                          <p className="text-xs">
                            Lat: {driver.currentLocation?.latitude.toFixed(4) || "N/A"}, Lng:{" "}
                            {driver.currentLocation?.longitude.toFixed(4) || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 border rounded-md">
                      <p className="text-gray-500">No available drivers found at the moment.</p>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDriversDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
