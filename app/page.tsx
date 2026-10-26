"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowRight, Shield, Truck, Award } from 'lucide-react'
import { supabase, type Product } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"
import SetupNotice from "@/components/setup-notice"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { dispatch } = useCart()

  useEffect(() => {
    setMounted(true)
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not configured
        const mockProducts: Product[] = [
          {
            id: "1",
            name: "Ferrari F40 1:18 Scale",
            description: "Detailed poster of the iconic Ferrari F40 supercar",
            price: 89.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Sports Cars",
            brand: "Ferrari",
            scale: "1:18",
            stock: 15,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Porsche 911 Turbo 1:24 Scale",
            description: "Classic Porsche 911 Turbo with opening doors and hood",
            price: 64.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Sports Cars",
            brand: "Porsche",
            scale: "1:24",
            stock: 8,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Lamborghini Aventador 1:18 Scale",
            description: "Stunning Lamborghini Aventador with detailed interior",
            price: 95.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Sports Cars",
            brand: "Lamborghini",
            scale: "1:18",
            stock: 12,
            created_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "BMW M3 E30 1:24 Scale",
            description: "Classic BMW M3 E30 racing edition",
            price: 54.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Classic Cars",
            brand: "BMW",
            scale: "1:24",
            stock: 20,
            created_at: new Date().toISOString(),
          },
        ]
        setFeaturedProducts(mockProducts)
        return
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(8)
        .order("created_at", { ascending: false })

      if (error) throw error
      setFeaturedProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setFeaturedProducts([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    if (mounted) {
      dispatch({ type: "ADD_ITEM", product })
    }
  }

  if (!supabase) {
    return <SetupNotice />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading premium car figures...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-blue-50/30 to-indigo-100/50"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-700 bg-clip-text text-transparent leading-tight">
              Premium Car Figures Collection
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Discover the world's finest collection of car posters. From legendary classics to modern
              supercars, each piece is crafted with exceptional detail and authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" asChild className="premium-accent border-0 text-white font-semibold text-lg px-8 py-4">
                <Link href="/products">
                  Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-effect border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-lg px-8 py-4"
              >
                View Categories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Why Choose Postery
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the difference with our premium service and authentic collectibles
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="premium-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Truck className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Free Premium Shipping</h3>
              <p className="text-gray-600 leading-relaxed">
                Complimentary white-glove delivery on orders over $50. Your collectibles arrive safely and securely.
              </p>
            </div>
            <div className="text-center group">
              <div className="premium-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Award className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Authentic Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Every model is officially licensed and crafted with museum-quality attention to detail.
              </p>
            </div>
            <div className="text-center group">
              <div className="premium-card w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Lifetime Guarantee</h3>
              <p className="text-gray-600 leading-relaxed">
                We stand behind every piece with our comprehensive lifetime quality guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 relative bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Featured Collection
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked premium models that represent the pinnacle of automotive artistry
            </p>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="premium-card max-w-md mx-auto p-8 rounded-2xl">
                <p className="text-gray-600 text-lg mb-4">No products available yet.</p>
                <p className="text-sm text-gray-500">Add some products through the admin panel to get started!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="premium-card group hover:scale-105 transition-all duration-500 border-0 overflow-hidden"
                >
                  <CardHeader className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {product.stock < 5 && product.stock > 0 && (
                        <Badge className="absolute top-3 right-3 premium-accent border-0 text-white">Low Stock</Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge className="absolute top-3 right-3 bg-red-500 border-0 text-white">Out of Stock</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="glass-effect border-gray-200 text-gray-700">
                        {product.brand}
                      </Badge>
                      <Badge variant="outline" className="border-gray-300 text-gray-600">
                        {product.scale}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-3">
                    <Button
                      className="flex-1 premium-button border-0 text-white font-medium"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="glass-effect border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Link href={`/products/${product.id}`}>View</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Button size="lg" asChild className="premium-button border-0 text-white font-semibold text-lg px-8 py-4">
              <Link href="/products">
                View Complete Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
