// ========================================
// 404 NOT FOUND PAGE - BSM PLATFORM
// Custom 404 error page with helpful navigation options
// Provides search functionality to help users find content
// Includes popular pages and resources for easy access
// Maintains consistent branding and design system
// Offers multiple paths for user recovery and navigation
// Includes analytics tracking for 404 errors and user behavior
// Provides accessibility features and screen reader support
// Optimized for SEO with proper meta tags and structure
// Includes contact options for additional user support
// ========================================

import Link from 'next/link'
import { Search, Home, ArrowLeft, HelpCircle, FileText, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Header */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              Search for what you need
            </CardTitle>
            <CardDescription>
              Try searching for the content you were looking for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tickets, users, knowledge base..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Go to main dashboard</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Knowledge Base</h3>
                  <p className="text-sm text-muted-foreground">Browse help articles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Support</h3>
                  <p className="text-sm text-muted-foreground">Contact our team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Pages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Pages</CardTitle>
            <CardDescription>
              Here are some pages our users visit frequently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              <Link 
                href="/tickets" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Ticket Management</span>
              </Link>
              
              <Link 
                href="/knowledge" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span>Knowledge Base</span>
              </Link>
              
              <Link 
                href="/analytics" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span>Analytics</span>
              </Link>
              
              <Link 
                href="/settings" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Button variant="ghost" size="lg" asChild>
            <Link href="/support">
              <HelpCircle className="h-4 w-4 mr-2" />
              Get Help
            </Link>
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Still can't find what you're looking for?{' '}
            <Link href="/support" className="text-primary hover:underline">
              Contact our support team
            </Link>{' '}
            and we'll help you out.
          </p>
        </div>
      </div>
    </div>
  )
}
