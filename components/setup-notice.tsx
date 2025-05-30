import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, ExternalLink, Settings, Crown } from 'lucide-react'
import Link from "next/link"

export default function SetupNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card className="premium-card max-w-2xl mx-auto border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-12 w-12 text-amber-500 mr-3" />
            <Database className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Premium Setup Required
          </CardTitle>
          <p className="text-gray-600 mt-2">Configure your database to unlock the full luxury experience</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <Alert className="glass-effect border-gray-200">
            <Settings className="h-4 w-4" />
            <AlertTitle className="text-gray-900">Supabase Configuration Missing</AlertTitle>
            <AlertDescription className="text-gray-700">
              To use the full functionality of this premium ecommerce site, you need to set up Supabase and add your
              environment variables.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Quick Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                Create a new project at{" "}
                <Link
                  href="https://supabase.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                  target="_blank"
                >
                  supabase.com
                </Link>
              </li>
              <li>Copy your project URL and anon key from the API settings</li>
              <li>
                Add these environment variables to your{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">.env.local</code> file:
                <div className="glass-effect p-4 rounded-lg mt-3 font-mono text-sm text-blue-600 border border-gray-200">
                  NEXT_PUBLIC_SUPABASE_URL=your_project_url
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
                </div>
              </li>
              <li>Create the database tables using the SQL provided in the documentation</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div className="glass-effect p-6 rounded-xl border border-blue-200 bg-blue-50/50">
            <p className="text-blue-700 leading-relaxed">
              <strong className="text-blue-900">Note:</strong> The site is currently running with premium mock data so
              you can preview the design and functionality. Once Supabase is configured, it will use real database
              storage with full ecommerce features.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild className="premium-accent border-0 text-white font-medium">
              <Link href="https://supabase.com" target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Supabase
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="glass-effect border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/products">Continue with Demo</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
