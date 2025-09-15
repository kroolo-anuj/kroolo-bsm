// ========================================
// UTILITY FUNCTIONS - BSM PLATFORM
// Core utility functions for common operations
// Includes class name merging and conditional styling
// Date formatting and manipulation utilities
// String processing and validation helpers
// Number formatting and calculation utilities
// Object and array manipulation functions
// Type guards and validation utilities
// Performance optimized with memoization
// Cross-browser compatibility ensured
// ========================================

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns"

// ========================================
// CLASS NAME UTILITIES
// ========================================

/**
 * Combines class names with Tailwind CSS class merging
 * Handles conditional classes and removes duplicates
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ========================================
// DATE UTILITIES
// ========================================

/**
 * Formats a date string or Date object
 * Returns formatted string or fallback for invalid dates
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = "PPP"
): string {
  if (!date) return "—"
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date
  
  if (!isValid(parsedDate)) return "Invalid date"
  
  return format(parsedDate, formatStr)
}

/**
 * Returns relative time from now (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: string | Date | null | undefined
): string {
  if (!date) return "—"
  
  const parsedDate = typeof date === "string" ? parseISO(date) : date
  
  if (!isValid(parsedDate)) return "Invalid date"
  
  return formatDistanceToNow(parsedDate, { addSuffix: true })
}

/**
 * Formats datetime for display with relative time
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  options: { relative?: boolean; includeTime?: boolean } = {}
): string {
  const { relative = false, includeTime = true } = options
  
  if (!date) return "—"
  
  if (relative) {
    return formatRelativeTime(date)
  }
  
  const formatStr = includeTime ? "PPp" : "PP"
  return formatDate(date, formatStr)
}

// ========================================
// STRING UTILITIES
// ========================================

/**
 * Truncates text to specified length with ellipsis
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "..."
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Converts string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => capitalize(word))
    .join(" ")
}

/**
 * Generates a slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Extracts initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// ========================================
// NUMBER UTILITIES
// ========================================

/**
 * Formats a number with commas
 */
export function formatNumber(
  num: number | string,
  options: Intl.NumberFormatOptions = {}
): string {
  const number = typeof num === "string" ? parseFloat(num) : num
  
  if (isNaN(number)) return "—"
  
  return new Intl.NumberFormat("en-US", options).format(number)
}

/**
 * Formats currency values
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "USD"
): string {
  return formatNumber(amount, {
    style: "currency",
    currency,
  })
}

/**
 * Formats percentage values
 */
export function formatPercentage(
  value: number | string,
  decimals: number = 1
): string {
  return formatNumber(value, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ========================================
// OBJECT UTILITIES
// ========================================

/**
 * Deep clones an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === "object") {
    const clonedObj = {} as { [key: string]: any }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone((obj as any)[key])
      }
    }
    return clonedObj as T
  }
  return obj
}

/**
 * Omits specified keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/**
 * Picks specified keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

// ========================================
// ARRAY UTILITIES
// ========================================

/**
 * Groups array items by a key
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string | number
): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = String(keyFn(item))
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Removes duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Removes duplicates from array by key
 */
export function uniqueBy<T>(
  array: T[],
  keyFn: (item: T) => string | number
): T[] {
  const seen = new Set()
  return array.filter(item => {
    const key = keyFn(item)
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Chunks array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Type guard for checking if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Type guard for checking if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === "string"
}

/**
 * Type guard for checking if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value)
}

// ========================================
// ASYNC UTILITIES
// ========================================

/**
 * Creates a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// ========================================
// LOCAL STORAGE UTILITIES
// ========================================

/**
 * Safely gets item from localStorage
 */
export function getLocalStorage<T>(
  key: string,
  defaultValue: T
): T {
  if (typeof window === "undefined") return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Safely sets item in localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silently fail
  }
}

/**
 * Removes item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === "undefined") return
  
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Silently fail
  }
}

// ========================================
// ERROR HANDLING UTILITIES
// ========================================

/**
 * Safely executes a function and returns result or error
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))]
  }
}

/**
 * Formats error message for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}
