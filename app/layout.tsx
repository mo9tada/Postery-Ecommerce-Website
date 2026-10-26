import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"
import { Truck, Award, Shield } from "lucide-react"

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Postery - Premium Car Posters",
  description: "Premium car posters designed and printed in Tunisia, from classic icons to modern supercars.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900 antialiased`}>
        <CartProvider>
          <Header />
          <main>{children}</main>

          {/* Why Choose Postery Section */}
          <section className="py-24 relative bg-white border-t border-gray-100">
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

          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
