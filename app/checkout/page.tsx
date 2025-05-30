"use client"

import type React from "react"
import { supabase } from "@/lib/supabase"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Truck, Shield, Lock, ArrowLeft, CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("apple")
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "TN",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const subtotal = state.total
  const shipping = 7
  const tax = 0
  const total = subtotal + shipping + tax

  const createOrder = async () => {
    try {
      // Modified order data structure to match your database schema
      const orderData = {
        // Try different field names for email that might exist in your schema
        email: formData.email, // Most likely column name
        // email_address: formData.email, // Alternative column name
        // customer_email: formData.email, // Another alternative

        total: total,
        status: "completed",
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment_method: paymentMethod,
      }

      if (!supabase) {
        // Generate a mock order ID for demo
        const mockOrderId = "CF-" + Math.random().toString(36).substr(2, 9).toUpperCase()
        setOrderId(mockOrderId)
        return mockOrderId
      }

      // Create order in Supabase
      const { data: order, error: orderError } = await supabase.from("orders").insert([orderData]).select().single()

      if (orderError) {
        const errorMessage =
          typeof orderError === "string"
            ? orderError
            : orderError.message || JSON.stringify(orderError) || "Unknown error"
        throw new Error(`Order creation failed: ${errorMessage}`)
      }

      if (!order) {
        throw new Error("No order data returned from database")
      }

      // Create order items
      const orderItems = state.items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        const errorMessage =
          typeof itemsError === "string"
            ? itemsError
            : itemsError.message || JSON.stringify(itemsError) || "Unknown error"
        throw new Error(`Failed to add order items: ${errorMessage}`)
      }

      setOrderId(order.id)
      return order.id
    } catch (error: any) {
      console.error("Error creating order:", error)
      // Re-throw with a more user-friendly message if it's a generic error
      if (error.message) {
        throw error
      } else {
        throw new Error("Failed to create order. Please try again.")
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setErrorMessage("") // Clear any previous errors

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create the order
      const newOrderId = await createOrder()

      if (!newOrderId) {
        throw new Error("Failed to create order")
      }

      // Clear the cart
      dispatch({ type: "CLEAR_CART" })
      setOrderComplete(true)
    } catch (error: any) {
      console.error("Order creation failed:", error)
      setErrorMessage(error.message || "Failed to process your order. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (state.items.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <Button asChild>
            <a href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </a>
          </Button>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="premium-card p-12 rounded-2xl">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase! Your order has been confirmed and will be shipped within 2-3 business days.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Order #{orderId}</p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-red-600">
                  <a href="/products">Continue Shopping</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order securely</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <p>{errorMessage}</p>
              </div>
            )}
            {/* Contact Information */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-black">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="premium-card">
              <CardHeader className="text-black">
                <CardTitle className="flex items-center gap-2 text-black">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-black">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TN">Tunis</SelectItem>
                        <SelectItem value="BA">Ben Arous</SelectItem>
                        <SelectItem value="AR">Ariana</SelectItem>
                        <SelectItem value="MN">Manouba</SelectItem>
                        <SelectItem value="NB">Nabeul</SelectItem>
                        <SelectItem value="KF">Kef</SelectItem>
                        <SelectItem value="MH">Mahdia</SelectItem>
                        <SelectItem value="SS">Sousse</SelectItem>
                        <SelectItem value="MR">Monastir</SelectItem>
                        <SelectItem value="MD">Medenine</SelectItem>
                        <SelectItem value="GB">Gabes</SelectItem>
                        <SelectItem value="GF">Gafsa</SelectItem>
                        <SelectItem value="SL">Seliana</SelectItem>
                        <SelectItem value="KS">Kasserine</SelectItem>
                        <SelectItem value="SF">Sfax</SelectItem>
                        <SelectItem value="SB">Sidi Bouzid</SelectItem>
                        <SelectItem value="TT">Tataouin</SelectItem>
                        <SelectItem value="TO">Tozeur</SelectItem>
                        <SelectItem value="KB">Kabeli</SelectItem>
                        <SelectItem value="BJ">Beja</SelectItem>
                        <SelectItem value="JN">Jendouba</SelectItem>
                        <SelectItem value="BZ">Bizerte</SelectItem>
                        <SelectItem value="ZG">Zaghouen</SelectItem>
                        <SelectItem value="KN">Kairouaen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">Tunisia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-black">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="apple" id="apple" />
                    <Label htmlFor="apple" className="cursor-pointer">
                      Cash
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
              <Lock className="h-4 w-4 text-green-600" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-black">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-black">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.product.image_url || "/placeholder.svg?height=64&width=64"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{`$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full border-0 text-white font-medium bg-red-600"
                size="lg"
                disabled={processing}
                onClick={handleSubmit}
              >
                {processing ? "Processing..." : `Complete Order - $${total.toFixed(2)}`}
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  <span>Free Returns</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
