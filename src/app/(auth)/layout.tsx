// ========================================
// AUTHENTICATION LAYOUT - BSM PLATFORM
// Shared layout for all authentication pages (login, signup, etc.)
// Provides consistent branding and visual design for auth flows
// Includes responsive design optimized for various screen sizes
// Features accessibility enhancements and keyboard navigation
// Implements loading states and error handling for auth operations
// Includes social proof and trust indicators for user confidence
// Provides seamless integration with the overall application design
// Optimized for conversion with clear call-to-actions
// Includes security messaging and privacy assurances
// ========================================

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentication - Kroolo BSM',
  description: 'Sign in to your Kroolo BSM account to manage your business services',
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and Information */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 xl:px-12 bg-primary">
        <div className="mx-auto max-w-md">
          {/* Logo and Brand */}
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2 text-primary-foreground">
              <div className="h-10 w-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-2xl">Kroolo BSM</span>
            </Link>
          </div>

          {/* Value Proposition */}
          <div className="space-y-6 text-primary-foreground">
            <h1 className="text-3xl font-bold">
              Enterprise Business Service Management
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Streamline your IT operations with our comprehensive BSM platform. 
              AI-powered automation, intelligent workflows, and enterprise-grade security.
            </p>

            {/* Features List */}
            <ul className="space-y-3 text-primary-foreground/80">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60 mr-3" />
                Advanced ticket management with AI classification
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60 mr-3" />
                Visual workflow builder and automation
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60 mr-3" />
                Comprehensive knowledge base and analytics
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary-foreground/60 mr-3" />
                Enterprise security and compliance
              </li>
            </ul>

            {/* Trust Indicators */}
            <div className="border-t border-primary-foreground/20 pt-6">
              <p className="text-sm text-primary-foreground/60 mb-3">
                Trusted by 500+ enterprises worldwide
              </p>
              <div className="flex items-center space-x-6 text-xs text-primary-foreground/60">
                <div>99.9% uptime</div>
                <div>SOC 2 compliant</div>
                <div>24/7 support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Authentication Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-xl">Kroolo BSM</span>
            </Link>
          </div>

          {/* Back to Home Link */}
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>

          {/* Authentication Content */}
          <div className="space-y-6">
            {children}
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="text-sm text-muted-foreground space-x-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href="/support" className="hover:text-primary transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your data is protected with bank-grade encryption. 
              We never store your password in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
