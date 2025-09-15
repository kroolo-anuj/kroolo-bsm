// ========================================
// AUTHENTICATION PROVIDER - BSM PLATFORM
// Centralized authentication state management and user session handling
// Integrates with Supabase Auth for secure user authentication
// Provides user context throughout the application tree
// Handles login, logout, and session persistence automatically
// Includes role-based access control and permission management
// Supports social authentication providers (Google, GitHub, Microsoft)
// Implements automatic token refresh and session validation
// Provides loading states for authentication operations
// Includes error handling and user feedback mechanisms
// ========================================

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'

import { supabase } from '@/lib/config/supabase'
import { User, Organization } from '@/lib/config/supabase'

// ========================================
// TYPE DEFINITIONS
// ========================================

interface AuthUser extends User {
  supabase_user?: SupabaseUser
  organization?: Organization
  permissions?: string[]
  roles?: string[]
}

interface AuthContextType {
  // User state
  user: AuthUser | null
  session: Session | null
  organization: Organization | null
  
  // Loading states
  loading: boolean
  initializing: boolean
  
  // Authentication methods
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: AuthError }>
  signOut: () => Promise<void>
  
  // Social authentication
  signInWithProvider: (provider: 'google' | 'github' | 'microsoft') => Promise<void>
  
  // Password management
  resetPassword: (email: string) => Promise<{ error?: AuthError }>
  updatePassword: (password: string) => Promise<{ error?: AuthError }>
  
  // Profile management
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error?: Error }>
  
  // Permission checks
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  
  // Organization management
  switchOrganization: (organizationId: string) => Promise<void>
  
  // Utility methods
  refreshSession: () => Promise<void>
  isAuthenticated: boolean
}

// ========================================
// CONTEXT CREATION
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ========================================
// HOOK FOR USING AUTH CONTEXT
// ========================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// ========================================
// AUTH PROVIDER COMPONENT
// ========================================

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // State management
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  
  const router = useRouter()

  // ========================================
  // SESSION INITIALIZATION
  // ========================================

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (initialSession) {
          await handleSessionChange(initialSession)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setInitializing(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        if (session) {
          await handleSessionChange(session)
        } else {
          handleSignOut()
        }
        
        setInitializing(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ========================================
  // SESSION HANDLING
  // ========================================

  const handleSessionChange = async (newSession: Session) => {
    try {
      setSession(newSession)
      setLoading(true)

      // Fetch user profile and organization data
      const userProfile = await fetchUserProfile(newSession.user.id)
      
      if (userProfile) {
        setUser(userProfile)
        
        // Fetch organization if user has one
        if (userProfile.organization_id) {
          const orgData = await fetchOrganization(userProfile.organization_id)
          setOrganization(orgData)
        }
      }
    } catch (error) {
      console.error('Error handling session change:', error)
      toast.error('Error loading user profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setSession(null)
    setOrganization(null)
    setLoading(false)
  }

  // ========================================
  // USER PROFILE FETCHING
  // ========================================

  const fetchUserProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          organization:organizations(id, name, slug, plan_type),
          user_roles(role_name, permissions)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      // Transform the data to include permissions and roles
      const userProfile: AuthUser = {
        ...data,
        permissions: data.user_roles?.flatMap((role: any) => 
          Object.keys(role.permissions || {})
        ) || [],
        roles: data.user_roles?.map((role: any) => role.role_name) || []
      }

      return userProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  const fetchOrganization = async (organizationId: string): Promise<Organization | null> => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single()

      if (error) {
        console.error('Error fetching organization:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching organization:', error)
      return null
    }
  }

  // ========================================
  // AUTHENTICATION METHODS
  // ========================================

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Successfully signed in!')
      router.push('/dashboard')
      
      return { error: undefined }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Check your email for the confirmation link!')
      
      return { error: undefined }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message)
      return { error: authError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Successfully signed out!')
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out')
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // SOCIAL AUTHENTICATION
  // ========================================

  const signInWithProvider = async (provider: 'google' | 'github' | 'microsoft') => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      toast.error(`Error signing in with ${provider}`)
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // PASSWORD MANAGEMENT
  // ========================================

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Password reset email sent!')
      return { error: undefined }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message)
      return { error: authError }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })

      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Password updated successfully!')
      return { error: undefined }
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message)
      return { error: authError }
    }
  }

  // ========================================
  // PROFILE MANAGEMENT
  // ========================================

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) {
      return { error: new Error('No user logged in') }
    }

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        toast.error(error.message)
        return { error: new Error(error.message) }
      }

      // Update local state
      setUser({ ...user, ...updates })
      toast.success('Profile updated successfully!')
      
      return { error: undefined }
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // PERMISSION CHECKS
  // ========================================

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false
  }

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  // ========================================
  // ORGANIZATION MANAGEMENT
  // ========================================

  const switchOrganization = async (organizationId: string) => {
    if (!user) return

    setLoading(true)
    
    try {
      // Update user's current organization
      await updateProfile({ organization_id: organizationId })
      
      // Fetch new organization data
      const orgData = await fetchOrganization(organizationId)
      setOrganization(orgData)
      
      toast.success('Organization switched successfully!')
      router.refresh()
    } catch (error) {
      console.error('Error switching organization:', error)
      toast.error('Error switching organization')
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        return
      }

      if (data.session) {
        await handleSessionChange(data.session)
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }

  const isAuthenticated = Boolean(user && session)

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value: AuthContextType = {
    // User state
    user,
    session,
    organization,
    
    // Loading states
    loading,
    initializing,
    
    // Authentication methods
    signIn,
    signUp,
    signOut,
    
    // Social authentication
    signInWithProvider,
    
    // Password management
    resetPassword,
    updatePassword,
    
    // Profile management
    updateProfile,
    
    // Permission checks
    hasPermission,
    hasRole,
    hasAnyRole,
    
    // Organization management
    switchOrganization,
    
    // Utility methods
    refreshSession,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
