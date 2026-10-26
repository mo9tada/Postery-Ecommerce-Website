"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, ArrowLeft, Star, Shield, Truck, RotateCcw, Heart, Share2, Minus, Plus } from "lucide-react"
import { supabase, type Product } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { dispatch } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      if (!supabase) {
        // Mock product data for demo
        const mockProduct: Product = {
          id: params.id as string,
          name: "Ferrari F40 1:18 Scale Premium Edition",
          description:
            "This exceptional 1:18 scale Ferrari F40 model captures every curve of the legend in a gallery-quality print. Every detail has been meticulously recreated from the original blueprints, featuring opening doors, hood, and trunk, detailed engine bay, authentic interior with working steering wheel, and premium paint finish that captures the iconic Ferrari red.",
          price: 89.99,
          image_url: "/placeholder.svg?height=600&width=600",
          category: "Sports Cars",
          brand: "Ferrari",
          scale: "1:18",
          stock: 15,
          created_at: new Date().toISOString(),
        }
        setProduct(mockProduct)
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from("products").select("*").eq("id", params.id).single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      router.push("/products")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch({ type: "ADD_ITEM", product })
      }
    }
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const productImages = [
    product.image_url || "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gray-700">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="premium-card rounded-xl overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.stock < 5 && product.stock > 0 && (
                <Badge className="absolute top-4 right-4 premium-accent border-0 text-white">
                  Only {product.stock} left
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge className="absolute top-4 right-4 bg-red-500 border-0 text-white">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`premium-card rounded-lg overflow-hidden aspect-square relative ${selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {product.brand}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                {product.scale}
              </Badge>
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                {product.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-gray-500 ml-2">(127 reviews)</span>
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-6">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-black" />
                    </Button>
                    <span className="w-12 text-center font-medium text-black">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(quantity + 1)}
                      disabled={quantity >= (product.stock || 0)}
                    >
                      <Plus className="h-4 w-4 text-black" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">{product.stock} available</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 premium-button- border-0 text-white font-medium"
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                <Button asChild className="w-full premium-accent border-0 text-white font-medium" size="lg">
                  <Link href="/checkout">Buy Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 premium-card rounded-lg">
              <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Authentic Quality</p>
            </div>
            <div className="text-center p-4 premium-card rounded-lg">
              <Truck className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center p-4 premium-card rounded-lg">
              <RotateCcw className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
