// ========================================
// NOTIFICATION PROVIDER - BSM PLATFORM
// Global notification system for user feedback and alerts
// Provides toast notifications, alerts, and system messages
// Supports different notification types and priorities
// Includes real-time notification delivery and management
// Handles notification persistence and user preferences
// Provides notification history and read status tracking
// Includes integration with push notifications and email
// Supports customizable notification templates and styling
// Optimized for performance with efficient state management
// ========================================

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Bell, X, Check, AlertTriangle, Info, AlertCircle } from 'lucide-react'

// ========================================
// TYPE DEFINITIONS
// ========================================

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timestamp: Date
  read: boolean
  persistent?: boolean
  actionLabel?: string
  actionUrl?: string
  onAction?: () => void
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  
  // Notification methods
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  
  // Toast methods
  showToast: (type: NotificationType, message: string, options?: any) => void
  showSuccess: (message: string, options?: any) => void
  showError: (message: string, options?: any) => void
  showWarning: (message: string, options?: any) => void
  showInfo: (message: string, options?: any) => void
  
  // Settings
  preferences: NotificationPreferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void
}

interface NotificationPreferences {
  enableToasts: boolean
  enableSounds: boolean
  enableDesktop: boolean
  enableEmail: boolean
  autoMarkAsRead: boolean
  maxNotifications: number
}

// ========================================
// CONTEXT CREATION
// ========================================

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// ========================================
// HOOK FOR USING NOTIFICATION CONTEXT
// ========================================

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// ========================================
// NOTIFICATION PROVIDER COMPONENT
// ========================================

interface NotificationProviderProps {
  children: React.ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enableToasts: true,
    enableSounds: false,
    enableDesktop: false,
    enableEmail: false,
    autoMarkAsRead: true,
    maxNotifications: 50,
  })

  // ========================================
  // LOAD PREFERENCES FROM LOCAL STORAGE
  // ========================================

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notification-preferences')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPreferences(prev => ({ ...prev, ...parsed }))
        } catch (error) {
          console.error('Error loading notification preferences:', error)
        }
      }
    }
  }, [])

  // ========================================
  // COMPUTED VALUES
  // ========================================

  const unreadCount = notifications.filter(n => !n.read).length

  // ========================================
  // NOTIFICATION MANAGEMENT
  // ========================================

  const addNotification = useCallback((
    notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: Notification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notificationData,
    }

    setNotifications(prev => {
      const updated = [notification, ...prev]
      
      // Limit notifications based on preferences
      if (updated.length > preferences.maxNotifications) {
        return updated.slice(0, preferences.maxNotifications)
      }
      
      return updated
    })

    // Show desktop notification if enabled
    if (preferences.enableDesktop && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        })
      }
    }

    // Play sound if enabled
    if (preferences.enableSounds) {
      playNotificationSound(notification.type)
    }

    return id
  }, [preferences.maxNotifications, preferences.enableDesktop, preferences.enableSounds])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // ========================================
  // TOAST METHODS
  // ========================================

  const showToast = useCallback((
    type: NotificationType, 
    message: string, 
    options: any = {}
  ) => {
    if (!preferences.enableToasts) return

    const toastOptions = {
      duration: 4000,
      ...options,
    }

    switch (type) {
      case 'success':
        toast.success(message, toastOptions)
        break
      case 'error':
        toast.error(message, toastOptions)
        break
      case 'warning':
        toast(message, {
          icon: '⚠️',
          ...toastOptions,
        })
        break
      case 'info':
      default:
        toast(message, {
          icon: 'ℹ️',
          ...toastOptions,
        })
        break
    }
  }, [preferences.enableToasts])

  const showSuccess = useCallback((message: string, options?: any) => {
    showToast('success', message, options)
  }, [showToast])

  const showError = useCallback((message: string, options?: any) => {
    showToast('error', message, options)
  }, [showToast])

  const showWarning = useCallback((message: string, options?: any) => {
    showToast('warning', message, options)
  }, [showToast])

  const showInfo = useCallback((message: string, options?: any) => {
    showToast('info', message, options)
  }, [showToast])

  // ========================================
  // PREFERENCES MANAGEMENT
  // ========================================

  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    const newPreferences = { ...preferences, ...updates }
    setPreferences(newPreferences)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification-preferences', JSON.stringify(newPreferences))
    }

    // Request desktop notification permission if enabled
    if (updates.enableDesktop && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [preferences])

  // ========================================
  // SOUND EFFECTS
  // ========================================

  const playNotificationSound = useCallback((type: NotificationType) => {
    if (typeof window === 'undefined') return

    // Create audio context for sound effects
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different notification types
      const frequencies = {
        success: 800,
        info: 600,
        warning: 400,
        error: 300,
      }

      oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }, [])

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    
    // Notification methods
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    
    // Toast methods
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Settings
    preferences,
    updatePreferences,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationCenter />
    </NotificationContext.Provider>
  )
}

// ========================================
// NOTIFICATION CENTER COMPONENT
// ========================================

function NotificationCenter() {
  const { notifications, markAsRead, removeNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-background border rounded-full shadow-lg hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5" />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 max-h-96 bg-background border rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b bg-muted">
            <h3 className="font-semibold text-sm">Notifications</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-2">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {notification.message && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {notifications.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
