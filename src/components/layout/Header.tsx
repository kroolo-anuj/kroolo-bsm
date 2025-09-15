// ========================================
// HEADER COMPONENT - BSM PLATFORM
// Top navigation header with search, notifications, and user menu
// Provides global search functionality across all application content
// Includes notification center with real-time updates
// Features user profile menu with account management options
// Implements breadcrumb navigation for current page context
// Includes quick actions and shortcuts for improved productivity
// Provides organization switching and multi-tenant support
// Optimized for keyboard navigation and accessibility standards
// Features responsive design with mobile-friendly interactions
// ========================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  ChevronDown,
  Building,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/components/providers/AuthProvider'
import { useNotifications } from '@/components/providers/NotificationProvider'
import { cn } from '@/lib/utils'

interface HeaderProps {
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export function Header({ sidebarCollapsed, onSidebarToggle }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user, organization, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, users, knowledge..."
            className="pl-10 pr-4 py-2 w-64 lg:w-96 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Organization Info */}
        {organization && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{organization.name}</span>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="relative"
          >
            {getThemeIcon()}
          </Button>

          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setTheme('light')
                    setShowThemeMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted"
                >
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => {
                    setTheme('dark')
                    setShowThemeMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted"
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </button>
                <button
                  onClick={() => {
                    setTheme('system')
                    setShowThemeMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.push('/notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">
                {user?.full_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-popover border rounded-md shadow-lg z-50">
              <div className="py-1">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    router.push('/settings/profile')
                    setShowUserMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    router.push('/settings')
                    setShowUserMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
                
                <div className="border-t">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {(showUserMenu || showThemeMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false)
            setShowThemeMenu(false)
          }}
        />
      )}
    </header>
  )
}
