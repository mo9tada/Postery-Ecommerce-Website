"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Product, CartItem } from "@/lib/supabase"

type CartState = {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.product.id === action.product.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === action.product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        }
      }

      const newItems = [...state.items, { id: action.product.id, product: action.product, quantity: 1 }]
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.product.id !== action.productId)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", productId: action.productId })
      }

      const newItems = state.items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: action.quantity } : item,
      )
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    case "LOAD_CART":
      return {
        items: action.items,
        total: action.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", items: cartItems })
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Only save to localStorage on the client side
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cart", JSON.stringify(state.items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [state.items])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    // Return a default state instead of throwing an error
    console.warn("useCart must be used within a CartProvider. Using default cart state.")
    return {
      state: { items: [], total: 0 },
      dispatch: () => {
        console.warn("Cart dispatch called outside of CartProvider")
      },
    }
  }
  return context
}
