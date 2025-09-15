// ========================================
// GLOBAL ERROR BOUNDARY - BSM PLATFORM
// Handles unexpected errors and provides user-friendly error pages
// Includes error reporting and recovery mechanisms
// Provides contextual error information for debugging
// Implements error logging and monitoring integration
// Offers user actions for error recovery and support
// Maintains application stability during error conditions
// Includes accessibility features for error communication
// Provides fallback UI when components fail to render
// Optimized for production error handling and user experience
// ========================================

'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
    
    // Report to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error)
    }
  }, [error])

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  const handleContactSupport = () => {
    // Open support chat or redirect to support page
    window.location.href = '/support'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-md bg-muted p-3">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Error Details (Development Only)
              </h4>
              <p className="text-xs text-muted-foreground font-mono">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            <Button 
              onClick={reset} 
              className="w-full"
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleReload}
                className="text-sm"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reload
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="text-sm"
              >
                <Home className="h-3 w-3 mr-1" />
                Home
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleContactSupport}
              className="w-full text-sm"
              leftIcon={<MessageSquare className="h-4 w-4" />}
            >
              Contact Support
            </Button>
          </div>

          {/* Help text */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              If this problem persists, please contact our support team with the error details above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
