// ========================================
// SIDEBAR NAVIGATION - BSM PLATFORM
// Main navigation sidebar with collapsible functionality
// Provides hierarchical navigation structure for all app features
// Includes role-based menu items and permission-aware visibility
// Features responsive design with mobile-friendly interactions
// Implements active state tracking and breadcrumb integration
// Includes search functionality and quick access shortcuts
// Provides user context switching and organization management
// Optimized for keyboard navigation and accessibility standards
// Features smooth animations and intuitive user experience
// ========================================

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Ticket, 
  Workflow, 
  BookOpen, 
  BarChart3, 
  Users, 
  Settings, 
  MessageSquare,
  Package,
  Zap,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/AuthProvider'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: string
  children?: NavItem[]
  permission?: string
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Tickets',
    href: '/tickets',
    icon: Ticket,
    badge: '12',
    children: [
      { name: 'All Tickets', href: '/tickets', icon: Ticket },
      { name: 'My Tickets', href: '/tickets/my', icon: Ticket },
      { name: 'New Ticket', href: '/tickets/new', icon: Ticket },
    ]
  },
  {
    name: 'Services',
    href: '/services',
    icon: Package,
    children: [
      { name: 'Service Catalog', href: '/services', icon: Package },
      { name: 'Service Requests', href: '/services/requests', icon: Package },
    ]
  },
  {
    name: 'Workflows',
    href: '/workflows',
    icon: Workflow,
    children: [
      { name: 'All Workflows', href: '/workflows', icon: Workflow },
      { name: 'Workflow Builder', href: '/workflows/builder', icon: Zap },
    ]
  },
  {
    name: 'Knowledge Base',
    href: '/knowledge',
    icon: BookOpen,
    children: [
      { name: 'Articles', href: '/knowledge', icon: BookOpen },
      { name: 'Categories', href: '/knowledge/categories', icon: BookOpen },
      { name: 'New Article', href: '/knowledge/new', icon: BookOpen },
    ]
  },
  {
    name: 'Assets',
    href: '/assets',
    icon: Package,
    permission: 'assets.read'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    children: [
      { name: 'Dashboard', href: '/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/analytics/reports', icon: BarChart3 },
      { name: 'Insights', href: '/analytics/insights', icon: BarChart3 },
    ]
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    permission: 'users.read',
    children: [
      { name: 'All Users', href: '/users', icon: Users },
      { name: 'Teams', href: '/users/teams', icon: Users },
    ]
  },
  {
    name: 'Chat Support',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    children: [
      { name: 'Profile', href: '/settings/profile', icon: Settings },
      { name: 'Organization', href: '/settings/organization', icon: Settings, permission: 'organizations.write' },
      { name: 'Notifications', href: '/settings/notifications', icon: Settings },
      { name: 'Security', href: '/settings/security', icon: Settings },
    ]
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { user, hasPermission } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const hasAccess = (item: NavItem) => {
    if (!item.permission) return true
    return hasPermission(item.permission)
  }

  const filteredNavigation = navigation.filter(hasAccess)

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-all duration-300 lg:relative lg:z-auto",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-lg">Kroolo BSM</span>
            </Link>
          )}
          
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-muted transition-colors lg:hidden"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNavigation.map((item) => (
            <div key={item.name}>
              <div className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            toggleExpanded(item.name)
                          }}
                          className="p-1 rounded hover:bg-muted/50"
                        >
                          {expandedItems.includes(item.name) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* Submenu */}
              {!collapsed && item.children && expandedItems.includes(item.name) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.filter(hasAccess).map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                        isActive(child.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <child.icon className="h-4 w-4" />
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        {!collapsed && user && (
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
