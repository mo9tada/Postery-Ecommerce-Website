"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Search, Filter } from "lucide-react"
import { supabase, type Product } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const { dispatch } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, sortBy, filterBy])

  const fetchProducts = async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not configured
        const mockProducts: Product[] = [
          {
            id: "1",
            name: "Ferrari F40 1:18 Scale",
            description:
              "Detailed die-cast model of the iconic Ferrari F40 supercar with opening doors, hood, and detailed engine bay",
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
            description: "Classic Porsche 911 Turbo with opening doors and hood, detailed interior and engine",
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
            description: "Stunning Lamborghini Aventador with detailed interior, opening scissor doors",
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
            description: "Classic BMW M3 E30 racing edition with authentic livery and details",
            price: 54.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Classic Cars",
            brand: "BMW",
            scale: "1:24",
            stock: 20,
            created_at: new Date().toISOString(),
          },
          {
            id: "5",
            name: "Audi R8 V10 1:18 Scale",
            description: "Precision-crafted Audi R8 V10 with detailed V10 engine and interior",
            price: 79.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Sports Cars",
            brand: "Audi",
            scale: "1:18",
            stock: 6,
            created_at: new Date().toISOString(),
          },
          {
            id: "6",
            name: "Mercedes-Benz SLS AMG 1:24 Scale",
            description: "Iconic Mercedes SLS AMG with gullwing doors and detailed interior",
            price: 69.99,
            image_url: "/placeholder.svg?height=300&width=300",
            category: "Luxury Cars",
            brand: "Mercedes-Benz",
            scale: "1:24",
            stock: 14,
            created_at: new Date().toISOString(),
          },
        ]
        setProducts(mockProducts)
        return
      }

      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterBy !== "all") {
      filtered = filtered.filter((product) => product.category === filterBy)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", product })
  }

  const categories = [...new Set(products.map((p) => p.category))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-black">Postery Collection</h1>
        <p className="text-black">Discover our complete range of premium car Posters</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-black text-lg">
            {searchTerm ? "No products found matching your search." : "No products available."}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-black">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image_url || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.stock < 5 && product.stock > 0 && (
                      <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
                    )}
                    {product.stock === 0 && <Badge className="absolute top-2 right-2 bg-red-500">Out of Stock</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{product.brand}</Badge>
                    <Badge className="text-white" variant="outline">{product.scale}</Badge>
                  </div>
                  <p className="text-sm text-white mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-2xl font-bold text-white">${product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button className="flex-1" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/products/${product.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
