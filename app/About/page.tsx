"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Award, Shield, Heart, Star, ArrowRight, Mail, Phone, MapPin } from "lucide-react"

export default function AboutPage() {
    const teamMembers = [
        {
            name: "Moktada Zaidi",
            role: "Founder & CEO",
            image: "/placeholder.svg?height=300&width=300",
            description: "WebMaster And Ensuring The Production Of The Most Premium Products",
        },
        {
            name: "Anas Ben Rhouma",
            role: "Head of Curation",
            image: "/placeholder.svg?height=300&width=300",
            description: "Collecting Orders And Giving The Best Services",
        },
        {
            name: "Rayen Laafif",
            role: "Prod",
            image: "/placeholder.svg?height=300&width=300",
            description: "Ensuring Social Media Development and Promoting",
        },
    ]

    const testimonials = [
        {
            name: "James Parker",
            location: "New York, NY",
            rating: 5,
            comment:
                "The quality of these models is absolutely incredible. Every detail is perfect, and the packaging is museum-quality.",
        },
        {
            name: "Maria Gonzalez",
            location: "Los Angeles, CA",
            rating: 5,
            comment:
                "I've been collecting for 15 years, and Postery has the best selection and authenticity I've ever seen.",
        },
        {
            name: "Robert Kim",
            location: "Chicago, IL",
            rating: 5,
            comment: "Fast shipping, perfect packaging, and the customer service is outstanding. Highly recommended!",
        },
    ]

    const stats = [
        { number: "50,000+", label: "Happy Collectors" },
        { number: "2,500+", label: "Premium Models" },
        { number: "15+", label: "Years Experience" },
        { number: "99.8%", label: "Customer Satisfaction" },
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <Crown className="h-12 w-12 text-amber-500 mr-3" />
                            <Award className="h-12 w-12 text-blue-500" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-700 bg-clip-text text-transparent">
                            About Postery
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                            Passionate Production Of The Most Premium Car Posters In Tunisia
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Our Story
                            </h2>
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    Postery was founded in 2025 in Tunisia by a group of passionate automotive college students who are assuring the production of the most premium car posters in the country.
                                </p>
                                <p>
                                    This business is running in a small garage but is assuring the client sattisfaction and the best quality  
                                </p>
                                <p>
                                    We are hoping to grow this businnes globally and to be the best in the world in this field!
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="premium-card p-8 rounded-2xl">
                                <Image
                                    src="/postery.svg?height=400&width=600"
                                    alt="Postery workshop"
                                    width={600}
                                    height={400}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Values Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Our Values
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">The principles that guide everything we do</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="premium-card text-center group hover:scale-105 transition-all duration-300">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <Shield className="h-8 w-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl text-gray-900">Authenticity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Every model is officially licensed and verified for accuracy. We guarantee the authenticity of every
                                    piece in our collection.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="premium-card text-center group hover:scale-105 transition-all duration-300">
                            <CardHeader>
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                                    <Award className="h-8 w-8 text-amber-600" />
                                </div>
                                <CardTitle className="text-xl text-gray-900">Excellence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    We curate only the finest models from the world's best manufacturers, ensuring museum-quality
                                    craftsmanship in every piece.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="premium-card text-center group hover:scale-105 transition-all duration-300">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                    <Heart className="h-8 w-8 text-green-600" />
                                </div>
                                <CardTitle className="text-xl text-gray-900">Passion</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    We're collectors ourselves. Our passion for automotive excellence drives us to find and share the most
                                    exceptional models.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Meet Our Team
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            The passionate experts behind your premium collecting experience
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="premium-card text-center group hover:scale-105 transition-all duration-300">
                                <CardHeader>
                                    <div className="w-24 h-24 mx-auto mb-4 relative overflow-hidden rounded-full">
                                        <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                                    </div>
                                    <CardTitle className="text-lg text-gray-900">{member.name}</CardTitle>
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                        {member.role}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">{member.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {/* Contact CTA */}
            <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Ready to Start Your Collection?
                        </h2>
                        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                            Join thousands of collectors who trust Postery for their premium car posters. Whether you're just
                            starting or expanding your collection, we're here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                            <Button size="lg" asChild className="premium-accent border-0 text-white font-semibold text-lg px-8 py-4">
                                <Link href="/products">
                                    Browse Collection <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        {/* Contact Info */}
                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            <div className="flex items-center justify-center gap-3 text-gray-600">
                                <Mail className="h-5 w-5" />
                                <span>carpostery@gmail.com</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-gray-600">
                                <Phone className="h-5 w-5" />
                                <span>+21696685112</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-gray-600">
                                <MapPin className="h-5 w-5" />
                                <span>Menzel Temime, NABEUL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
