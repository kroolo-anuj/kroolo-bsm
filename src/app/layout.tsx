// ========================================
// ROOT LAYOUT - BSM PLATFORM
// Main application layout with authentication and theming
// Provides global context providers for the entire application
// Includes metadata configuration for SEO and social sharing
// Sets up authentication, theme, and notification providers
// Configures global error boundaries and loading states
// Implements responsive design with mobile-first approach
// Includes analytics and monitoring service integrations
// Provides accessibility enhancements and ARIA support
// Optimized for performance with font loading strategies
// ========================================

import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ModalProvider } from '@/components/providers/ModalProvider'
import { NotificationProvider } from '@/components/providers/NotificationProvider'

import './globals.css'

// ========================================
// FONT CONFIGURATION
// ========================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

// ========================================
// METADATA CONFIGURATION
// ========================================

export const metadata: Metadata = {
  title: {
    default: 'Kroolo BSM - Enterprise Business Service Management',
    template: '%s | Kroolo BSM'
  },
  description: 'Complete ITSM solution with AI-powered automation, workflow management, and multi-tenant architecture. Streamline your business services with advanced ticketing, knowledge base, and analytics.',
  keywords: [
    'BSM',
    'ITSM',
    'Service Management',
    'Ticketing System',
    'Workflow Automation',
    'Knowledge Base',
    'Enterprise Software',
    'AI Automation',
    'Multi-tenant',
    'Analytics Dashboard'
  ],
  authors: [{ name: 'Kroolo BSM Team' }],
  creator: 'Kroolo',
  publisher: 'Kroolo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Kroolo BSM - Enterprise Business Service Management',
    description: 'Complete ITSM solution with AI-powered automation, workflow management, and multi-tenant architecture.',
    siteName: 'Kroolo BSM',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kroolo BSM Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kroolo BSM - Enterprise Business Service Management',
    description: 'Complete ITSM solution with AI-powered automation, workflow management, and multi-tenant architecture.',
    images: ['/assets/images/twitter-image.png'],
    creator: '@kroolo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

// ========================================
// ROOT LAYOUT COMPONENT
// ========================================

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Performance hints */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
      </head>
      <body 
        className={`
          min-h-screen bg-background font-sans antialiased
          selection:bg-primary/20 selection:text-primary-foreground
        `}
        suppressHydrationWarning
      >
        {/* Global Providers Hierarchy */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <NotificationProvider>
              <ModalProvider>
                {/* Main Application Content */}
                <div className="relative flex min-h-screen flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                </div>
                
                {/* Global Toast Notifications */}
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName="!top-16"
                  containerStyle={{
                    top: 20,
                    left: 20,
                    bottom: 20,
                    right: 20,
                  }}
                  toastOptions={{
                    // Default options
                    className: '',
                    duration: 4000,
                    style: {
                      background: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'calc(var(--radius) - 2px)',
                      fontSize: '14px',
                      padding: '12px 16px',
                    },
                    
                    // Success notifications
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: 'hsl(var(--success))',
                        secondary: 'hsl(var(--success-foreground))',
                      },
                    },
                    
                    // Error notifications
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: 'hsl(var(--destructive))',
                        secondary: 'hsl(var(--destructive-foreground))',
                      },
                    },
                    
                    // Loading notifications
                    loading: {
                      duration: Infinity,
                    },
                  }}
                />
                
                {/* Skip to main content link for accessibility */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
                >
                  Skip to main content
                </a>
              </ModalProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Development tools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <>
            {/* React Query DevTools */}
            <div id="react-query-devtools" />
            
            {/* Accessibility testing indicator */}
            <div 
              className="fixed bottom-4 left-4 z-50 rounded-full bg-yellow-500 p-2 text-xs font-mono text-yellow-900 opacity-50 hover:opacity-100"
              title="Development Mode Active"
            >
              DEV
            </div>
          </>
        )}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Analytics Script - Only in production */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
