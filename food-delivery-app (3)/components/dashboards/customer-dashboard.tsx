"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { LogOut, Search, Bell, ShoppingBag, Home, History, Heart, CreditCard, User, Utensils, ShoppingCart, Plus, Minus, ArrowLeft, Clock, MapPin, Phone, MessageSquare, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Order status enum to match backend
enum OrderStatus {
  CREATED = "CREATED",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED"
}

// Order item interface
interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

// Order interface
interface Order {
  id?: string;
  customerId: string;
  restaurantId: string;
  items: OrderItem[];
  totalPrice: number;
  status?: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  deliveryAddress: string;
  specialInstructions: string;
  statusHistory?: any[];
  orderImage?: string;
  phoneNumber: string;
  deliveryTimeSlot: string;
}

export default function CustomerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("home")
  const [menuItems, setMenuItems] = useState([])
  const [filteredMenuItems, setFilteredMenuItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState([])
  const [restaurantNames, setRestaurantNames] = useState({})
  const [checkoutStep, setCheckoutStep] = useState(0) // 0: cart, 1: delivery details, 2: payment
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  
  // Checkout form state
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  // Fetch all menu items
  const fetchMenuItems = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:8081/api/v1/menu/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch menu items")
      }

      const data = await response.json()
      setMenuItems(data)
      setFilteredMenuItems(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching menu items")
      console.error(err)
      // For demo purposes, set some sample data if API fails
  
      setMenuItems(sampleMenuItems)
      setFilteredMenuItems(sampleMenuItems)
    } finally {
      setLoading(false)
    }
  }

  // Fetch restaurant names
  const fetchRestaurantNames = async () => {
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
      const namesMap = {}
      data.forEach((restaurant) => {
        namesMap[restaurant.id] = restaurant.name
      })
      setRestaurantNames(namesMap)
    } catch (err) {
      console.error("Error fetching restaurant names:", err)
      // Sample data for demo
      setRestaurantNames({
        1: "Burger Palace",
        2: "Pizza Heaven",
        3: "Sushi World",
        4: "Taco Fiesta",
        5: "Veggie Delight",
        6: "Sweet Treats",
      })
    }
  }

  // Fetch customer orders
  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const customerId = user.id || "1" // Fallback for demo
      const response = await fetch(`http://localhost:8084/api/orders/customer/${customerId}`, {
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
      console.error("Error fetching orders:", err)
      // Sample data for demo
      
    } finally {
      setLoadingOrders(false)
    }
  }

  // Get order details
  const getOrderDetails = async (orderId) => {
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
      setOrderDetails(data)
      setShowOrderDetails(true)
    } catch (err) {
      console.error("Error fetching order details:", err)
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive",
      })
    }
  }

  // Add item to cart
  const addToCart = (item) => {
    // Check if item is already in cart
    const existingItem = cart.find((cartItem) => cartItem.id === item.id)

    if (existingItem) {
      // Increase quantity if already in cart
      setCart(
        cart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)),
      )
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity: 1 }])
    }

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      action: <ToastAction altText="View Cart" onClick={() => setActiveTab("cart")}>View Cart</ToastAction>,
    })
  }

  // Create order
const createOrder = async () => {
  if (cart.length === 0) {
    toast({
      title: "Empty Cart",
      description: "Your cart is empty. Add some items before checkout.",
      variant: "destructive",
    });
    return;
  }

  if (!deliveryAddress || !phoneNumber || !deliveryTimeSlot) {
    toast({
      title: "Missing Information",
      description: "Please fill in all required fields.",
      variant: "destructive",
    });
    return;
  }

  setPaymentProcessing(true);
  setPaymentError("");

  try {
    // Get the restaurant ID from the first item (assuming all items are from the same restaurant)
    const restaurantId = cart[0].restaurantid.toString();

    // Format order items
    const orderItems = cart.map(item => ({
      menuItemId: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Calculate total price
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = 3.99;
    const totalPrice = subtotal + deliveryFee;

    // Create order object
    const order: Order = {
      customerId: user.id || "1", // Fallback for demo
      restaurantId: restaurantId,
      items: orderItems,
      totalPrice: totalPrice,
      deliveryAddress: deliveryAddress,
      specialInstructions: specialInstructions,
      phoneNumber: phoneNumber,
      deliveryTimeSlot: deliveryTimeSlot,
    };

    // Send order creation request
    const response = await fetch("http://localhost:8084/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const createdOrder = await response.json();

    // Initiate payment
    const paymentResponse = await fetch(`http://localhost:8084/api/orders/${createdOrder.order.id}/pay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!paymentResponse.ok) {
      throw new Error("Failed to initiate payment");
    }

    const paymentData = await paymentResponse.json();

    // Redirect to Stripe payment page
    if (paymentData.status === "SUCCESS" && paymentData.sessionUrl) {
      window.location.href = paymentData.sessionUrl;
    } else {
      throw new Error(paymentData.message || "Payment session creation failed");
    }

  } catch (err: any) {
    console.error("Error creating order:", err);
    setPaymentError(err.message || "An error occurred during checkout");
    toast({
      title: "Checkout Failed",
      description: err.message || "An error occurred during checkout",
      variant: "destructive",
    });
  } finally {
    setPaymentProcessing(false);
  }
};

  // Filter menu items based on search term and category
  useEffect(() => {
    if (menuItems.length > 0) {
      let filtered = menuItems

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      // Filter by category
      if (selectedCategory !== "All") {
        // This is a simplified example. In a real app, you'd have category data
        // For now, we'll just filter based on price ranges as a demonstration
        if (selectedCategory === "Under $10") {
          filtered = filtered.filter((item) => item.price < 10)
        } else if (selectedCategory === "Over $10") {
          filtered = filtered.filter((item) => item.price >= 10)
        }
      }

      setFilteredMenuItems(filtered)
    }
  }, [searchTerm, selectedCategory, menuItems])

  // Load initial data
  useEffect(() => {
    fetchMenuItems()
    fetchRestaurantNames()
  }, [])

  // Fetch orders when orders tab is selected
  useEffect(() => {
    if (activeTab === "orders" || activeTab === "history") {
      fetchOrders()
    }
  }, [activeTab])

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case OrderStatus.CREATED:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.CONFIRMED:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.PREPARING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.READY:
        return "bg-orange-100 text-orange-800"
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // Render checkout steps
  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 0: // Cart
        return (
          <div className="space-y-4">
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden mr-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Utensils className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {restaurantNames[item.restaurantid] || `Restaurant #${item.restaurantid}`}
                        </p>
                        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (item.quantity > 1) {
                            setCart(
                              cart.map((cartItem) =>
                                cartItem.id === item.id
                                  ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                  : cartItem,
                              ),
                            )
                          } else {
                            setCart(cart.filter((cartItem) => cartItem.id !== item.id))
                          }
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setCart(
                            cart.map((cartItem) =>
                              cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                            ),
                          )
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Delivery Fee</span>
                    <span>$3.99</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>
                      ${(cart.reduce((total, item) => total + item.price * item.quantity, 0) + 3.99).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-black hover:bg-gray-800 mt-4" 
                  onClick={() => setCheckoutStep(1)}
                >
                  Proceed to Delivery Details
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-4">Add some delicious items to your cart</p>
                <Button onClick={() => setActiveTab("home")} className="bg-black hover:bg-gray-800">
                  Browse Menu
                </Button>
              </div>
            )}
          </div>
        )
      
      case 1: // Delivery Details
        return (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => setCheckoutStep(0)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="Enter your full address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryTimeSlot">Delivery Time *</Label>
                <Select 
                  value={deliveryTimeSlot} 
                  onValueChange={setDeliveryTimeSlot}
                >
                  <SelectTrigger id="deliveryTimeSlot">
                    <SelectValue placeholder="Select delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP">As soon as possible</SelectItem>
                    <SelectItem value="12:00 PM - 12:30 PM">12:00 PM - 12:30 PM</SelectItem>
                    <SelectItem value="12:30 PM - 1:00 PM">12:30 PM - 1:00 PM</SelectItem>
                    <SelectItem value="1:00 PM - 1:30 PM">1:00 PM - 1:30 PM</SelectItem>
                    <SelectItem value="1:30 PM - 2:00 PM">1:30 PM - 2:00 PM</SelectItem>
                    <SelectItem value="5:00 PM - 5:30 PM">5:00 PM - 5:30 PM</SelectItem>
                    <SelectItem value="5:30 PM - 6:00 PM">5:30 PM - 6:00 PM</SelectItem>
                    <SelectItem value="6:00 PM - 6:30 PM">6:00 PM - 6:30 PM</SelectItem>
                    <SelectItem value="6:30 PM - 7:00 PM">6:30 PM - 7:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special instructions for delivery or food preparation"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>$3.99</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>
                  ${(cart.reduce((total, item) => total + item.price * item.quantity, 0) + 3.99).toFixed(2)}
                </span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-black hover:bg-gray-800 mt-4" 
              onClick={() => setCheckoutStep(2)}
              disabled={!deliveryAddress || !phoneNumber || !deliveryTimeSlot}
            >
              Proceed to Payment
            </Button>
          </div>
        )
      
      case 2: // Payment
        return (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => setCheckoutStep(1)}
              disabled={paymentProcessing}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Delivery Details
            </Button>
            
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items ({cart.reduce((total, item) => total + item.quantity, 0)})</span>
                  <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>${(cart.reduce((total, item) => total + item.price * item.quantity, 0) + 3.99).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Delivery Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <span>{deliveryAddress}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{deliveryTimeSlot}</span>
                </div>
                {specialInstructions && (
                  <div className="flex items-start">
                    <MessageSquare className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                    <span>{specialInstructions}</span>
                  </div>
                )}
              </div>
            </div>
            
            {paymentError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span>{paymentError}</span>
                </div>
              </div>
            )}
            
            {paymentSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Payment successful! Your order has been placed.</span>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full bg-black hover:bg-gray-800 mt-4" 
                onClick={createOrder}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-black text-white p-4">
        <div className="flex items-center justify-center h-16 mb-8">
          <h1 className="text-xl font-bold">Speed Fast Food </h1>
        </div>
        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${activeTab === "home" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "orders" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            My Orders
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "history" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("history")}
          >
            <History className="mr-2 h-5 w-5" />
            Order History
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "favorites" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            <Heart className="mr-2 h-5 w-5" />
            Favorites
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${
              activeTab === "payment" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("payment")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Methods
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-gray-800 ${activeTab === "cart" ? "bg-gray-800" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            My Cart
            {cart.length > 0 && (
              <span className="ml-auto bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
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
            <h1 className="text-2xl font-bold">Welcome, {user.fullName || "Customer"}</h1>
            <p className="text-gray-600">What would you like to eat today?</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for dishes..."
                className="w-80 pl-10 pr-4 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                2
              </span>
            </Button>
            <Button variant="outline" size="icon" className="relative" onClick={() => setActiveTab("cart")}>
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </Button>
          </div>
        </div>

        {/* Dashboard content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsContent value="home" className="space-y-6">
            <div className="flex items-center space-x-4 mb-4 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory("All")}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === "Under $10" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory("Under $10")}
              >
                Under $10
              </Button>
              <Button
                variant={selectedCategory === "Over $10" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory("Over $10")}
              >
                Over $10
              </Button>
              <Button
                variant={selectedCategory === "Popular" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory("Popular")}
              >
                Popular
              </Button>
              <Button
                variant={selectedCategory === "New" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedCategory("New")}
              >
                New
              </Button>
            </div>

            <h2 className="text-xl font-bold mb-4">Menu Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.length > 0 ? (
                filteredMenuItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Utensils className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{item.name}</h3>
                        <Badge variant="outline" className="bg-black text-white">
                          ${item.price.toFixed(2)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {restaurantNames[item.restaurantid] || `Restaurant #${item.restaurantid}`}
                        </span>
                        <Button size="sm" onClick={() => addToCart(item)} className="bg-black hover:bg-gray-800">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex justify-center items-center h-40">
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  ) : (
                    <p className="text-gray-500">No menu items found</p>
                  )}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold mb-4 mt-8">Your Recent Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 3).map((order, i) => (
                <Card key={order.id || i}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{restaurantNames[order.restaurantId] || `Restaurant #${order.restaurantId}`}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {order.items.map(item => `${item.name} (${item.quantity})`).join(", ")}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>{order.createdAt ? formatDate(order.createdAt) : "Recent"}</span>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-black"
                        onClick={() => getOrderDetails(order.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold">
                                {restaurantNames[order.restaurantId] || `Restaurant #${order.restaurantId}`}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Order #{order.id?.substring(0, 8)}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Items:</p>
                            <ul className="text-sm text-gray-500 ml-4 list-disc">
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <p className="text-sm font-medium">Total: ${order.totalPrice.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">
                                {order.createdAt ? formatDate(order.createdAt) : "Recent order"}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => getOrderDetails(order.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">Start ordering delicious food!</p>
                    <Button onClick={() => setActiveTab("home")} className="bg-black hover:bg-gray-800">
                      Browse Menu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCheckoutStep()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </div>
                ) : orders.filter(order => order.status === OrderStatus.DELIVERED).length > 0 ? (
                  <div className="space-y-4">
                    {orders
                      .filter(order => order.status === OrderStatus.DELIVERED)
                      .map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-bold">
                                  {restaurantNames[order.restaurantId] || `Restaurant #${order.restaurantId}`}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Order #{order.id?.substring(0, 8)}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Items:</p>
                              <ul className="text-sm text-gray-500 ml-4 list-disc">
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div>
                                <p className="text-sm font-medium">Total: ${order.totalPrice.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">
                                  {order.createdAt ? formatDate(order.createdAt) : "Recent order"}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  // Create a new order with the same items
                                  const newCart = order.items.map(item => ({
                                    id: item.menuItemId,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity,
                                    restaurantid: order.restaurantId
                                  }))
                                  setCart(newCart)
                                  setActiveTab("cart")
                                  toast({
                                    title: "Items added to cart",
                                    description: "Your previous order has been added to your cart",
                                  })
                                }}
                              >
                                Reorder
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No order history</h3>
                    <p className="text-gray-500 mb-4">Your completed orders will appear here</p>
                    <Button onClick={() => setActiveTab("home")} className="bg-black hover:bg-gray-800">
                      Browse Menu
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Restaurants & Dishes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-gray-500 mb-4">Save your favorite restaurants and dishes for quick access</p>
                  <Button onClick={() => setActiveTab("home")} className="bg-black hover:bg-gray-800">
                    Browse Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payment methods</h3>
                  <p className="text-gray-500 mb-4">Add a payment method for faster checkout</p>
                  <Button className="bg-black hover:bg-gray-800">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={user.fullName || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={user.phone || ""} placeholder="Add your phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Default Delivery Address</Label>
                    <Textarea id="address" placeholder="Add your default delivery address" />
                  </div>
                  <Button className="bg-black hover:bg-gray-800">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {orderDetails && `Order #${orderDetails.id?.substring(0, 8)}`}
            </DialogDescription>
          </DialogHeader>
          {orderDetails && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  {restaurantNames[orderDetails.restaurantId] || `Restaurant #${orderDetails.restaurantId}`}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(orderDetails.status)}`}>
                  {orderDetails.status}
                </span>
              </div>
              
              <div className="border-t border-b py-2">
                <h4 className="font-medium mb-2">Items</h4>
                <ul className="space-y-2">
                  {orderDetails.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(orderDetails.totalPrice - 3.99).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${orderDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Delivery Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                    <span>{orderDetails.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{orderDetails.phoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{orderDetails.deliveryTimeSlot}</span>
                  </div>
                  {orderDetails.specialInstructions && (
                    <div className="flex items-start">
                      <MessageSquare className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                      <span>{orderDetails.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Ordered on: {orderDetails.createdAt ? formatDate(orderDetails.createdAt) : "Recent"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
