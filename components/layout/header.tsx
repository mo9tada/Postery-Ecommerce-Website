"use client"

import Link from "next/link"
import { ShoppingCart, User, Search, Menu, Crown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function Header() {
  const { state } = useCart()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!supabase || !mounted) {
      return
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  // Don't render cart count until mounted to avoid hydration mismatch
  const cartItemCount = mounted ? state.items.reduce((sum, item) => sum + item.quantity, 0) : 0

  return (
    <header className="glass-effect premium-shadow sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <img width="60" height="60"
              src="/postery.svg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
              Postery
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search premium car figures..."
                className="pl-10 glass-effect border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-red-700/20"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-red-700 transition-all duration-200"
              >
            <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              Products
            </Link>
            </Button>
            <Button
                variant="ghost"
                className="text-gray-700 hover:text-gray-900 hover:bg-red-700 transition-all duration-200"
              >
            <Link href="/About" className="relative">
              About
            </Link>
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-gray-900 hover:bg-red-700 transition-all duration-200"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs premium-accent border-0 text-white">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:text-gray-900 hover:bg-red-700 transition-all duration-200"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect border-gray-200 premium-shadow">
                  <DropdownMenuItem asChild className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                    <Link href="/products">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100">
                    <Link href="/cart">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  asChild
                  className="text-gray-700 hover:text-gray-900 hover:bg-red-500 transition-all duration-200"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="premium-accent border-0 text-white font-medium transition-all duration-200">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
