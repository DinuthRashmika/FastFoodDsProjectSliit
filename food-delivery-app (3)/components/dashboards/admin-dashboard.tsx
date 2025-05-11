"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Store,
  ShoppingBag,
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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [deliveries, setDeliveries] = useState([])

  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [selectedMenu, setSelectedMenu] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const [restaurantForm, setRestaurantForm] = useState({
    id: "",
    name: "",
    username: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    zip: "",
    password: "",
    photoUrl: "",
  })

  const [menuForm, setMenuForm] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    restaurantid: "",
    imageUrl: "",
  })

  const [orderForm, setOrderForm] = useState({
    id: "",
    customerId: "",
    restaurantId: "",
    items: [],
    totalPrice: 0,
    status: "CREATED",
    deliveryAddress: "",
    specialInstructions: "",
    phoneNumber: "",
    deliveryTimeSlot: "",
  })

  const [deliveryForm, setDeliveryForm] = useState({
    id: "",
    orderId: "",
    restaurantId: "",
    restaurantLocation: { latitude: 0, longitude: 0 },
    customerLocation: { latitude: 0, longitude: 0 },
    customerAddress: "",
    driverId: "",
    status: "PENDING",
  })

  const [isEditMode, setIsEditMode] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isRestaurantDialogOpen, setIsRestaurantDialogOpen] = useState(false)
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false)

  // ==================== USER MANAGEMENT ====================

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8082/api/v1/auth/getalluser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching users")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user by ID
  const fetchUserById = async (userId) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8082/api/v1/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user details")
      }

      const data = await response.json()
      setSelectedUser(data)
      setIsUserDialogOpen(true)
    } catch (err) {
      setError(err.message || "An error occurred while fetching user details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ==================== RESTAURANT MANAGEMENT ====================

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8081/api/v1/restaurant/getall", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants")
      }

      const data = await response.json()
      setRestaurants(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching restaurants")
      console.error(err)
      // For demo purposes, set some sample data if API fails
    } finally {
      setLoading(false)
    }
  }

  // Fetch restaurant by ID
  const fetchRestaurantById = async (restaurantId) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8081/api/v1/restaurant/getuserbyid/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details")
      }

      const data = await response.json()

      // Set the restaurant form data for editing
      setRestaurantForm({
        id: data.id,
        name: data.name || "",
        username: data.username || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
        password: "", // Don't populate password for security reasons
        photoUrl: data.photoUrl || "",
      })

      setSelectedRestaurant(data)
      setIsRestaurantDialogOpen(true)
    } catch (err) {
      setError(err.message || "An error occurred while fetching restaurant details")
      console.error(err)
      // For demo purposes, find the restaurant in our local state
      const restaurant = restaurants.find((r) => r.id === restaurantId)
      if (restaurant) {
        // Set the restaurant form data for editing
        setRestaurantForm({
          id: restaurant.id,
          name: restaurant.name || "",
          username: restaurant.username || "",
          address: restaurant.address || "",
          phone: restaurant.phone || "",
          email: restaurant.email || "",
          city: restaurant.city || "",
          state: restaurant.state || "",
          zip: restaurant.zip || "",
          password: "", // Don't populate password for security reasons
          photoUrl: restaurant.photoUrl || "",
        })

        setSelectedRestaurant(restaurant)
        setIsRestaurantDialogOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }

  // Add restaurant
  const addRestaurant = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8081/api/v1/restaurant/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(restaurantForm),
      })

      if (!response.ok) {
        throw new Error("Failed to add restaurant")
      }

      // Refresh restaurant list
      fetchRestaurants()
      // Reset form
      setRestaurantForm({
        id: "",
        name: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        openingHours: "",
        cuisineType: "",
      })
      setIsRestaurantDialogOpen(false)
    } catch (err) {
      setError(err.message || "An error occurred while adding restaurant")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Update restaurant
  const updateRestaurant = async () => {
    setLoading(true)
    setError("")
    try {
      // Create a copy of the form data
      const formData = { ...restaurantForm }

      // If password is empty, remove it from the request
      if (!formData.password) {
        delete formData.password
      }

      const response = await fetch(`http://localhost:8081/api/v1/restaurant/update/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update restaurant")
      }

      // Refresh restaurant list
      fetchRestaurants()
      // Reset form
      setRestaurantForm({
        id: "",
        name: "",
        username: "",
        address: "",
        phone: "",
        email: "",
        city: "",
        state: "",
        zip: "",
        password: "",
        photoUrl: "",
      })
      setIsEditMode(false)
      setIsRestaurantDialogOpen(false)
    } catch (err) {
      setError(err.message || "An error occurred while updating restaurant")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Delete restaurant
  const deleteRestaurant = async (restaurantId) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) {
      return
    }

    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8081/api/v1/restaurant/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: restaurantId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete restaurant")
      }

      // Refresh restaurant list
      fetchRestaurants()
    } catch (err) {
      setError(err.message || "An error occurred while deleting restaurant")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ==================== MENU MANAGEMENT ====================

  // Fetch all menus
  const fetchMenus = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8081/api/v1/menu/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch menus")
      }

      const data = await response.json()
      setMenus(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching menus")
      console.error(err)
      // For demo purposes, set some sample data if API fails
    } finally {
      setLoading(false)
    }
  }

  // Add menu item
  const addMenuItem = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8081/api/v1/menu/add/${menuForm.restaurantid}`, {
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

      // Refresh menu list
      fetchMenus()
      // Reset form
      setMenuForm({
        id: "",
        name: "",
        description: "",
        price: 0,
        restaurantid: "",
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

      // Refresh menu list
      fetchMenus()
      // Reset form
      setMenuForm({
        id: "",
        name: "",
        description: "",
        price: 0,
        restaurantid: "",
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

      // Refresh menu list
      fetchMenus()
    } catch (err) {
      setError(err.message || "An error occurred while deleting menu item")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ==================== ORDER MANAGEMENT ====================

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      // Since there's no endpoint to get all orders, we'll use a placeholder
      // In a real app, you would have an endpoint for this
    } catch (err) {
      setError(err.message || "An error occurred while fetching orders")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch order by ID
  const fetchOrderById = async (orderId) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8084/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch order details")
      }

      const data = await response.json()
      setSelectedOrder(data)
      setIsOrderDialogOpen(true)
    } catch (err) {
      setError(err.message || "An error occurred while fetching order details")
      console.error(err)
      // For demo purposes, find the order in our local state
      const order = orders.find((o) => o.id === orderId)
      if (order) {
        setSelectedOrder(order)
        setIsOrderDialogOpen(true)
      }
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
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      // Refresh orders list
      fetchOrders()
    } catch (err) {
      setError(err.message || "An error occurred while updating order status")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ==================== DELIVERY MANAGEMENT ====================

  // Fetch all drivers
  const fetchDrivers = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8087/drivers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch drivers")
      }

      const data = await response.json()
      setDrivers(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching drivers")
      console.error(err)
      // For demo purposes, set some sample data if API fails
    } finally {
      setLoading(false)
    }
  }

  // Fetch all deliveries
  const fetchDeliveries = async () => {
    setLoading(true)
    setError("")
    try {
      // Since there's no endpoint to get all deliveries, we'll use a placeholder
      // In a real app, you would have an endpoint for this
    } catch (err) {
      setError(err.message || "An error occurred while fetching deliveries")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Create delivery
  const createDelivery = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8087/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(deliveryForm),
      })

      if (!response.ok) {
        throw new Error("Failed to create delivery")
      }

      // Refresh deliveries list
      fetchDeliveries()
      // Reset form
      setDeliveryForm({
        id: "",
        orderId: "",
        restaurantId: "",
        restaurantLocation: { latitude: 0, longitude: 0 },
        customerLocation: { latitude: 0, longitude: 0 },
        customerAddress: "",
        driverId: "",
        status: "PENDING",
      })
      setIsDeliveryDialogOpen(false)
    } catch (err) {
      setError(err.message || "An error occurred while creating delivery")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Assign driver to delivery
  const assignDriver = async (deliveryId, driverId) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`http://localhost:8087/deliveries/${deliveryId}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ driverId }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign driver")
      }

      // Refresh deliveries list
      fetchDeliveries()
    } catch (err) {
      setError(err.message || "An error occurred while assigning driver")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ==================== FORM HANDLERS ====================

  // Handle restaurant form input change
  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target
    setRestaurantForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle menu form input change
  const handleMenuInputChange = (e) => {
    const { name, value } = e.target
    setMenuForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) : value,
    }))
  }

  // Open restaurant form for editing
  const openEditRestaurantForm = (restaurant) => {
    setRestaurantForm({
      id: restaurant.id,
      name: restaurant.name || "",
      username: restaurant.username || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      email: restaurant.email || "",
      city: restaurant.city || "",
      state: restaurant.state || "",
      zip: restaurant.zip || "",
      password: "", // Don't populate password for security reasons
      photoUrl: restaurant.photoUrl || "",
    })
    setIsEditMode(true)
    setIsRestaurantDialogOpen(true)
  }

  // Open restaurant form for adding
  const openAddRestaurantForm = () => {
    setRestaurantForm({
      id: "",
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
      openingHours: "",
      cuisineType: "",
    })
    setIsEditMode(false)
    setIsRestaurantDialogOpen(true)
  }

  // Open menu form for editing
  const openEditMenuForm = (menu) => {
    setMenuForm({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      restaurantid: menu.restaurantid,
      imageUrl: menu.imageUrl,
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
      restaurantid: "",
      imageUrl: "",
    })
    setIsEditMode(false)
    setIsMenuDialogOpen(true)
  }

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
    } else if (activeTab === "restaurants") {
      fetchRestaurants()
    } else if (activeTab === "menus") {
      fetchMenus()
      fetchRestaurants() // For restaurant dropdown in menu form
    } else if (activeTab === "orders") {
      fetchOrders()
    } else if (activeTab === "delivery") {
      fetchDeliveries()
      fetchDrivers()
    }
  }, [activeTab])

  // Filter users based on search term
  const filteredUsers = users.filter(
      (user) =>
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants.filter(
      (restaurant) =>
          restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter menus based on search term
  const filteredMenus = menus.filter(
      (menu) =>
          menu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          menu.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter orders based on search term
  const filteredOrders = orders.filter(
      (order) =>
          order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.restaurantId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter deliveries based on search term
  const filteredDeliveries = deliveries.filter(
      (delivery) =>
          delivery.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.driverId?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
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
                className={`w-full justify-start text-white hover:bg-gray-800 ${
                    activeTab === "users" ? "bg-gray-800" : ""
                }`}
                onClick={() => setActiveTab("users")}
            >
              <Users className="mr-2 h-5 w-5" />
              Users
            </Button>
            <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-gray-800 ${
                    activeTab === "restaurants" ? "bg-gray-800" : ""
                }`}
                onClick={() => setActiveTab("restaurants")}
            >
              <Store className="mr-2 h-5 w-5" />
              Restaurants
            </Button>
            <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-gray-800 ${
                    activeTab === "menus" ? "bg-gray-800" : ""
                }`}
                onClick={() => setActiveTab("menus")}
            >
              <Utensils className="mr-2 h-5 w-5" />
              Menus
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
              <h1 className="text-2xl font-bold">Welcome, {user.fullName || "Admin"}</h1>
              <p className="text-gray-600">System Administrator</p>
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
                3
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
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
              <TabsTrigger value="menus">Menus</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,248</div>
                    <p className="text-xs text-green-500 mt-1">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Active Restaurants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">156</div>
                    <p className="text-xs text-green-500 mt-1">+5% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">3,427</div>
                    <p className="text-xs text-green-500 mt-1">+18% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$24,389</div>
                    <p className="text-xs text-green-500 mt-1">+7% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["dinuth", "rashmika", "kavishka", "shenal", "ruwantha"].map((name,i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                              <td className="px-1 py-2 whitespace-nowrap text-sm text-gray-500">
                                <img
                                    className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
                                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                    alt="User"
                                />
                              </td>
                              <div className="px-5 ">
                                <p className="font-medium">{name}</p>
                                <p className="text-sm text-gray-500">{name}@gmail.com</p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">{i+1} hours ago</div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">Order {1000 + i}</p>
                              <p className="text-sm text-gray-500">Restaurant {i}</p>
                            </div>
                            <div className="text-sm">
                          <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                  i % 3 === 0
                                      ? "bg-yellow-100 text-yellow-800"
                                      : i % 3 === 1
                                          ? "bg-green-100 text-green-800"
                                          : "bg-blue-100 text-blue-800"
                              }`}
                          >
                            {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Delivered" : "In Progress"}
                          </span>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button
                      onClick={() => fetchUsers()}
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
                              Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.length > 0 ? (
                              filteredUsers.map((user, i) => (
                                  <tr key={user.id || i}>
                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <img
                                          className="flex-shrink-0 h-10 w-10 rounded-full object-cover"
                                          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                          alt="User"
                                      />
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                          <div className="text-sm text-gray-500">{user.username}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="mr-2"
                                          onClick={() => fetchUserById(user.id)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                  {users.length === 0 ? "No users found" : "No matching users found"}
                                </td>
                              </tr>
                          )}
                          </tbody>
                        </table>
                      </div>
                  )}
                </CardContent>
              </Card>

              {/* User Details Dialog */}
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                  </DialogHeader>
                  {selectedUser && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <img
                              className="h-24 w-24 rounded-full bg-gray-200"
                              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                              alt="User"
                          />{" "}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Full Name</Label>
                            <p>{selectedUser.fullName}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Username</Label>
                            <p>{selectedUser.username}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Email</Label>
                            <p>{selectedUser.email}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Phone</Label>
                            <p>{selectedUser.phoneNumber}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Role</Label>
                            <p>{selectedUser.role}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Location</Label>
                            <p>{selectedUser.location}</p>
                          </div>
                        </div>
                      </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="restaurants" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Restaurant Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button onClick={openAddRestaurantForm} variant="outline" size="sm" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Restaurant
                    </Button>
                    <Button
                        onClick={() => fetchRestaurants()}
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
                              Id
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                          {filteredRestaurants.length > 0 ? (
                              filteredRestaurants.map((restaurant, i) => (
                                  <tr key={restaurant.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{i + 1}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {restaurant.address}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div>{restaurant.phone}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div className="flex space-x-4">

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => deleteRestaurant(restaurant.id)}
                                        >
                                          <Trash className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                  {restaurants.length === 0 ? "No restaurants found" : "No matching restaurants found"}
                                </td>
                              </tr>
                          )}
                          </tbody>
                        </table>
                      </div>
                  )}
                </CardContent>
              </Card>

              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                  </DialogHeader>
                  {selectedUser && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <img
                              className="h-24 w-24 rounded-full bg-gray-200"
                              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                              alt="User"
                          />{" "}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Full Name</Label>
                            <p>{selectedUser.fullName}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Username</Label>
                            <p>{selectedUser.username}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Email</Label>
                            <p>{selectedUser.email}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Phone</Label>
                            <p>{selectedUser.phoneNumber}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Role</Label>
                            <p>{selectedUser.role}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Location</Label>
                            <p>{selectedUser.location}</p>
                          </div>
                        </div>
                      </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Restaurant Form Dialog */}
              <Dialog open={isRestaurantDialogOpen} onOpenChange={setIsRestaurantDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit User" : "Add Restruent"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={restaurantForm.name}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            value={restaurantForm.username}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            name="address"
                            value={restaurantForm.address}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={restaurantForm.phone}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      {!isEditMode && (
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={restaurantForm.email}
                                onChange={handleRestaurantInputChange}
                                required
                            />
                          </div>
                      )}
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            value={restaurantForm.city}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                            id="state"
                            name="state"
                            value={restaurantForm.state}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                            id="zip"
                            name="zip"
                            value={restaurantForm.zip}
                            onChange={handleRestaurantInputChange}
                            required
                        />
                      </div>
                      {!isEditMode && (
                          <div className="col-span-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={restaurantForm.password}
                                onChange={handleRestaurantInputChange}
                                required
                            />
                          </div>
                      )}
                      <div className="col-span-2">
                        <Label htmlFor="photoUrl">Photo URL</Label>
                        <Input
                            id="photoUrl"
                            name="photoUrl"
                            value={restaurantForm.photoUrl}
                            onChange={handleRestaurantInputChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRestaurantDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={isEditMode ? updateRestaurant : addRestaurant} disabled={loading}>
                        {loading ? "Saving..." : isEditMode ? "Update" : "Add"}
                      </Button>
                    </DialogFooter>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="menus" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Menu Management</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                        onClick={() => fetchMenus()}
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
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Restaurant
                            </th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                          {filteredMenus.length > 0 ? (
                              filteredMenus.map((menu) => (
                                  <tr key={menu.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 overflow-hidden">
                                          <img
                                              src={menu.imageUrl || "/placeholder.svg"}
                                              alt={menu.name}
                                              className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{menu.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      ${menu.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {restaurants.find((r) => r.id === menu.restaurantid)?.name || menu.restaurantid}
                                    </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                  {menus.length === 0 ? "No menu items found" : "No matching menu items found"}
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
                        <Label htmlFor="restaurantid">Restaurant</Label>
                        <Select
                            value={menuForm.restaurantid.toString()}
                            onValueChange={(value) => setMenuForm({ ...menuForm, restaurantid: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select restaurant" />
                          </SelectTrigger>
                          <SelectContent>
                            {restaurants.map((restaurant) => (
                                <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                                  {restaurant.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
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
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Restaurant
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
                              filteredOrders.map((order) => (
                                  <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {restaurants.find((r) => r.id.toString() === order.restaurantId)?.name ||
                                          order.restaurantId}
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
                                        <Button variant="outline" size="sm" onClick={() => fetchOrderById(order.id)}>
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
                                      </div>
                                    </td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
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
                        </DialogFooter>
                      </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Deliveries</CardTitle>
                    <Button
                        onClick={() => fetchDeliveries()}
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
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Driver
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDeliveries.length > 0 ? (
                                filteredDeliveries.map((delivery) => (
                                    <tr key={delivery.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{delivery.id}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        #{delivery.orderId}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {drivers.find((d) => d.id === delivery.driverId)?.name ||
                                            delivery.driverId ||
                                            "Unassigned"}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          delivery.status === "COMPLETED"
                                              ? "bg-green-100 text-green-800"
                                              : delivery.status === "IN_PROGRESS"
                                                  ? "bg-blue-100 text-blue-800"
                                                  : delivery.status === "ASSIGNED"
                                                      ? "bg-yellow-100 text-yellow-800"
                                                      : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {delivery.status}
                                  </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                          <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                setSelectedDelivery(delivery)
                                                setIsDeliveryDialogOpen(true)
                                              }}
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          {!delivery.driverId && (
                                              <Select onValueChange={(value) => assignDriver(delivery.id, value)}>
                                                <SelectTrigger className="h-8 w-32">
                                                  <SelectValue placeholder="Assign Driver" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {drivers
                                                      .filter((driver) => driver.available)
                                                      .map((driver) => (
                                                          <SelectItem key={driver.id} value={driver.id}>
                                                            {driver.name}
                                                          </SelectItem>
                                                      ))}
                                                </SelectContent>
                                              </Select>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    {deliveries.length === 0 ? "No deliveries found" : "No matching deliveries found"}
                                  </td>
                                </tr>
                            )}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Drivers</CardTitle>
                    <Button
                        onClick={() => fetchDrivers()}
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
                                Driver
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {drivers.length > 0 ? (
                                drivers.map((driver) => (
                                    <tr key={driver.id}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200"></div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                            <div className="text-xs text-gray-500">ID: {driver.id}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {driver.vehicleNumber}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {driver.phoneNumber}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          driver.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                      }`}
                                  >
                                    {driver.available ? "Available" : "Busy"}
                                  </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setSelectedDriver(driver)
                                              setIsDriverDialogOpen(true)
                                            }}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No drivers found
                                  </td>
                                </tr>
                            )}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Details Dialog */}
              <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delivery Details</DialogTitle>
                  </DialogHeader>
                  {selectedDelivery && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold">Delivery #{selectedDelivery.id}</h3>
                            <p className="text-sm text-gray-500">{new Date(selectedDelivery.createdAt).toLocaleString()}</p>
                          </div>
                          <Badge
                              className={`${
                                  selectedDelivery.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : selectedDelivery.status === "IN_PROGRESS"
                                          ? "bg-blue-100 text-blue-800"
                                          : selectedDelivery.status === "ASSIGNED"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {selectedDelivery.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Order ID</Label>
                            <p>#{selectedDelivery.orderId}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Restaurant ID</Label>
                            <p>#{selectedDelivery.restaurantId}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Driver</Label>
                            <p>
                              {drivers.find((d) => d.id === selectedDelivery.driverId)?.name ||
                                  selectedDelivery.driverId ||
                                  "Unassigned"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Customer Address</Label>
                            <p>{selectedDelivery.customerAddress}</p>
                          </div>
                        </div>

                        <div className="border rounded-md p-4">
                          <h4 className="font-medium mb-2">Locations</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label className="text-xs text-gray-500">Restaurant Location</Label>
                              <p>
                                Lat: {selectedDelivery.restaurantLocation.latitude.toFixed(4)}, Lng:{" "}
                                {selectedDelivery.restaurantLocation.longitude.toFixed(4)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">Customer Location</Label>
                              <p>
                                Lat: {selectedDelivery.customerLocation.latitude.toFixed(4)}, Lng:{" "}
                                {selectedDelivery.customerLocation.longitude.toFixed(4)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Driver Details Dialog */}
              <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Driver Details</DialogTitle>
                  </DialogHeader>
                  {selectedDriver && (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="h-24 w-24 rounded-full bg-gray-200"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500">Name</Label>
                            <p>{selectedDriver.name}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">ID</Label>
                            <p>{selectedDriver.id}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Vehicle Number</Label>
                            <p>{selectedDriver.vehicleNumber}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Phone</Label>
                            <p>{selectedDriver.phoneNumber}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Status</Label>
                            <Badge variant={selectedDriver.available ? "success" : "destructive"}>
                              {selectedDriver.available ? "Available" : "Busy"}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Current Location</Label>
                            <p>
                              Lat: {selectedDriver.currentLocation.latitude.toFixed(4)}, Lng:{" "}
                              {selectedDriver.currentLocation.longitude.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>System settings content would go here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
