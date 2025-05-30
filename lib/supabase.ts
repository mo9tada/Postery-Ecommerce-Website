import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.",
  )
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  brand: string
  scale: string
  created_at: string
}

export type CartItem = {
  id: string
  product: Product
  quantity: number
}

export type Order = {
  id: string
  user_id: string
  total: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product: Product
}
