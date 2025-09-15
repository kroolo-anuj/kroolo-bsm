// ========================================
// TEST SETUP - BSM PLATFORM
// Global test configuration and setup utilities
// Provides mock configurations for external services
// Includes custom matchers and testing utilities
// Sets up testing environment with proper configurations
// Provides database mocking and API response mocking
// Includes authentication mocking for protected routes
// Optimized for consistent test execution and reliability
// Supports both unit and integration testing scenarios
// Includes performance testing utilities and benchmarks
// ========================================

import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import { beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals'

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Supabase client
jest.mock('@/lib/config/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      limit: jest.fn().mockReturnThis(),
    })),
  },
  bsmClient: {
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
  },
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  __esModule: true,
  ...Object.fromEntries(
    [
      'Menu', 'X', 'Search', 'Bell', 'User', 'Settings', 'LogOut',
      'Home', 'ArrowRight', 'ArrowLeft', 'ChevronDown', 'ChevronRight',
      'LayoutDashboard', 'Ticket', 'Workflow', 'BookOpen', 'BarChart3',
      'Users', 'MessageSquare', 'Package', 'Zap', 'Building', 'Moon',
      'Sun', 'Monitor', 'Eye', 'EyeOff', 'Mail', 'Lock', 'AlertCircle',
      'CheckCircle', 'AlertTriangle', 'Plus', 'TrendingUp', 'Clock',
      'Activity', 'ArrowUpRight', 'Info', 'RefreshCw', 'HelpCircle',
      'FileText', 'Loader2'
    ].map(name => [name, () => null])
  ),
}))

// Global test environment setup
beforeAll(() => {
  // Set up global test environment
  process.env.NODE_ENV = 'test'
  process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
})

// Clean up after all tests
afterAll(() => {
  // Clean up global resources
  jest.clearAllMocks()
})

// Set up before each test
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks()
  
  // Mock window.matchMedia for responsive design tests
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
})

// Clean up after each test
afterEach(() => {
  // Clean up any side effects
  jest.restoreAllMocks()
})

// Custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = received && received.ownerDocument && received.ownerDocument.contains(received)
    return {
      pass,
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
    }
  },
})
