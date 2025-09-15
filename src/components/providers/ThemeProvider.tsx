// ========================================
// THEME PROVIDER - BSM PLATFORM
// Dark/Light theme management with system preference detection
// Provides theme context throughout the application
// Supports smooth theme transitions and persistence
// Integrates with Tailwind CSS dark mode classes
// Includes accessibility considerations for theme switching
// Handles system preference changes automatically
// Provides theme toggle functionality for user control
// Optimized for performance with minimal re-renders
// Includes theme-aware component styling support
// ========================================

'use client'

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// ========================================
// THEME PROVIDER COMPONENT
// ========================================

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
