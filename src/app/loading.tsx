// ========================================
// GLOBAL LOADING COMPONENT - BSM PLATFORM
// Provides consistent loading UI across the entire application
// Displays during route transitions and data fetching operations
// Includes animated spinner and loading message
// Optimized for accessibility with proper ARIA attributes
// Responsive design that works on all device sizes
// Integrates with the application's design system
// Provides smooth loading experience for users
// Includes fallback content for screen readers
// Performance optimized with minimal resource usage
// ========================================

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-label="Loading application"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Animated spinner */}
        <Loader2 
          className="h-8 w-8 animate-spin text-primary" 
          aria-hidden="true"
        />
        
        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            Loading Kroolo BSM
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait while we prepare your workspace
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">
        Loading application content, please wait...
      </span>
    </div>
  )
}
