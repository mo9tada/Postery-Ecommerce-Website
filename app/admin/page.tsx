"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, DollarSign, Search, Filter, Eye, Edit, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Order {
  id: string
  email: string
  total: number
  status: string
  shipping_address: any
  payment_method: string
  created_at: string
  order_items: OrderItem[]
}

interface OrderItem {
  id: string
  product_name: string
  product_price: number
  quantity: number
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      if (!supabase) {
        // Mock data for demo
        const mockOrders: Order[] = [
          {
            id: "1",
            email: "john@example.com",
            total: 89.99,
            status: "completed",
            shipping_address: {
              firstName: "John",
              lastName: "Doe",
              address: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
            },
            payment_method: "card",
            created_at: new Date().toISOString(),
            order_items: [
              {
                id: "1",
                product_name: "Ferrari F40 1:18 Scale",
                product_price: 89.99,
                quantity: 1,
              },
            ],
          },
          {
            id: "2",
            email: "sarah@example.com",
            total: 154.98,
            status: "shipped",
            shipping_address: {
              firstName: "Sarah",
              lastName: "Smith",
              address: "456 Oak Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90210",
            },
            payment_method: "card",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            order_items: [
              {
                id: "2",
                product_name: "Porsche 911 Turbo 1:24 Scale",
                product_price: 64.99,
                quantity: 1,
              },
              {
                id: "3",
                product_name: "Lamborghini Aventador 1:18 Scale",
                product_price: 89.99,
                quantity: 1,
              },
            ],
          },
          {
            id: "3",
            email: "mike@example.com",
            total: 64.99,
            status: "pending",
            shipping_address: {
              firstName: "Mike",
              lastName: "Johnson",
              address: "789 Pine St",
              city: "Chicago",
              state: "IL",
              zipCode: "60601",
            },
            payment_method: "paypal",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            order_items: [
              {
                id: "4",
                product_name: "Porsche 911 Turbo 1:24 Scale",
                product_price: 64.99,
                quantity: 1,
              },
            ],
          },
        ]
        setOrders(mockOrders)
        calculateStats(mockOrders)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (orderData: Order[]) => {
    const totalOrders = orderData.length
    const totalRevenue = orderData.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orderData.filter((order) => order.status === "pending").length
    const completedOrders = orderData.filter((order) => order.status === "completed").length

    setStats({
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
    })
  }

  const filterOrders = () => {
    let filtered = orders.filter(
      (order) =>
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping_address.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      if (!supabase) {
        // Update mock data
        setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
        return
      }

      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId)

      if (error) throw error

      // Refresh orders
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Postery store</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-black">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{stats.completedOrders}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6 text-black">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6 text-black">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders by email, ID, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="premium-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-black">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address.firstName} {order.shipping_address.lastName} • {order.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()} at{" "}
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">${order.total.toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-2 text-black">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-2 text-black">Items:</h4>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm text-black">
                            <span>
                              {item.product_name} x{item.quantity}
                            </span>
                            <span className="font-medium text-black">${(item.product_price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="text-black">
                      <h4 className="font-medium mb-2">Shipping Address:</h4>
                      <p className="text-sm">
                        {order.shipping_address.address}
                        <br />
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t text-black">
                      <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Orders will appear here once customers start purchasing."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Product management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Customer management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
