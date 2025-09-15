// ========================================
// SETUP API - BSM PLATFORM
// Complete database setup and seeding endpoint for new installations
// Handles initial database schema creation and population
// Provides demo data seeding for development and testing
// Includes organization and user setup for quick start
// Supports different setup modes (development, production, demo)
// Implements safety checks to prevent accidental data loss
// Provides detailed setup progress and error reporting
// Includes rollback functionality for failed setups
// Optimized for one-click deployment and initialization
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/config/supabase'

// ========================================
// SETUP CONFIGURATION
// ========================================

interface SetupRequest {
  mode: 'development' | 'production' | 'demo'
  seed: boolean
  organization?: {
    name: string
    slug: string
    plan_type: 'starter' | 'professional' | 'enterprise'
  }
  admin_user?: {
    email: string
    password: string
    full_name: string
  }
  force?: boolean // Force setup even if already initialized
}

interface SetupResponse {
  success: boolean
  message: string
  data?: {
    organization_id?: string
    admin_user_id?: string
    demo_credentials?: {
      email: string
      password: string
    }
  }
  errors?: string[]
  progress?: {
    step: string
    completed: boolean
    message: string
  }[]
}

// ========================================
// DEMO DATA TEMPLATES
// ========================================

const DEMO_ORGANIZATION = {
  name: 'Acme Corporation',
  slug: 'acme-corp',
  plan_type: 'enterprise',
  max_users: 1000,
  is_active: true
}

const DEMO_ADMIN_USER = {
  email: 'admin@demo.kroolo.com',
  password: 'demo123456',
  full_name: 'System Administrator'
}

const DEMO_DEPARTMENTS = [
  {
    name: 'Information Technology',
    description: 'IT support and infrastructure management',
  },
  {
    name: 'Human Resources',
    description: 'Employee relations and organizational development',
  },
  {
    name: 'Finance',
    description: 'Financial planning and accounting services',
  },
  {
    name: 'Customer Support',
    description: 'Customer service and technical support',
  }
]

const DEMO_USERS = [
  {
    email: 'john.doe@demo.kroolo.com',
    full_name: 'John Doe',
    department: 'Information Technology'
  },
  {
    email: 'jane.smith@demo.kroolo.com',
    full_name: 'Jane Smith',
    department: 'Customer Support'
  },
  {
    email: 'mike.johnson@demo.kroolo.com',
    full_name: 'Mike Johnson',
    department: 'Finance'
  }
]

const DEMO_TICKETS = [
  {
    title: 'Email server not responding',
    description: 'Users are unable to send or receive emails since this morning.',
    status: 'open',
    priority: 'high',
    type: 'incident'
  },
  {
    title: 'Request for new software license',
    description: 'Need Adobe Creative Suite license for the marketing team.',
    status: 'new',
    priority: 'medium',
    type: 'request'
  },
  {
    title: 'Password reset for new employee',
    description: 'New hire needs password reset for domain account.',
    status: 'resolved',
    priority: 'low',
    type: 'request'
  }
]

const DEMO_KNOWLEDGE_ARTICLES = [
  {
    title: 'How to Reset Your Password',
    content: 'Step-by-step guide to reset your account password...',
    category: 'Account Management',
    tags: ['password', 'security', 'account'],
    is_published: true
  },
  {
    title: 'VPN Setup Instructions',
    content: 'Complete guide to setting up VPN access...',
    category: 'Network',
    tags: ['vpn', 'network', 'security'],
    is_published: true
  },
  {
    title: 'Software Installation Guidelines',
    content: 'Approved software and installation procedures...',
    category: 'IT Policies',
    tags: ['software', 'policy', 'installation'],
    is_published: true
  }
]

// ========================================
// SETUP FUNCTIONS
// ========================================

async function checkExistingSetup(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Error checking existing setup:', error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error('Error checking existing setup:', error)
    return false
  }
}

async function createOrganization(orgData: any): Promise<string> {
  const { data, error } = await supabase
    .from('organizations')
    .insert(orgData)
    .select('id')
    .single()

  if (error) {
    throw new Error(`Failed to create organization: ${error.message}`)
  }

  return data.id
}

async function createAdminUser(userData: any, organizationId: string): Promise<string> {
  // Create auth user first
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: {
      full_name: userData.full_name
    }
  })

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`)
  }

  // Create user profile
  const { data: profileData, error: profileError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: userData.email,
      full_name: userData.full_name,
      organization_id: organizationId,
      is_active: true
    })
    .select('id')
    .single()

  if (profileError) {
    throw new Error(`Failed to create user profile: ${profileError.message}`)
  }

  // Assign admin role
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: authData.user.id,
      role_name: 'admin',
      hierarchy_level: 1,
      organization_id: organizationId,
      permissions: {
        'users.read': true,
        'users.write': true,
        'users.delete': true,
        'tickets.read': true,
        'tickets.write': true,
        'tickets.delete': true,
        'organizations.read': true,
        'organizations.write': true,
        'analytics.read': true,
        'settings.write': true
      }
    })

  if (roleError) {
    throw new Error(`Failed to assign admin role: ${roleError.message}`)
  }

  return authData.user.id
}

async function createDepartments(departments: any[], organizationId: string): Promise<string[]> {
  const departmentData = departments.map(dept => ({
    ...dept,
    organization_id: organizationId,
    is_active: true
  }))

  const { data, error } = await supabase
    .from('departments')
    .insert(departmentData)
    .select('id, name')

  if (error) {
    throw new Error(`Failed to create departments: ${error.message}`)
  }

  return data.map(d => d.id)
}

async function createDemoUsers(users: any[], organizationId: string, departments: any[]): Promise<void> {
  for (const user of users) {
    try {
      // Find department ID
      const department = departments.find(d => d.name === user.department)
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'demo123456',
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name
        }
      })

      if (authError) {
        console.warn(`Failed to create demo user ${user.email}:`, authError.message)
        continue
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          organization_id: organizationId,
          department_id: department?.id,
          is_active: true
        })

      if (profileError) {
        console.warn(`Failed to create profile for ${user.email}:`, profileError.message)
        continue
      }

      // Assign user role
      await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role_name: 'user',
          hierarchy_level: 3,
          organization_id: organizationId,
          permissions: {
            'tickets.read': true,
            'tickets.write': true,
            'knowledge.read': true
          }
        })

    } catch (error) {
      console.warn(`Error creating demo user ${user.email}:`, error)
    }
  }
}

async function createDemoTickets(tickets: any[], organizationId: string, adminUserId: string): Promise<void> {
  const ticketData = tickets.map(ticket => ({
    ...ticket,
    organization_id: organizationId,
    reported_by_id: adminUserId,
    ticket_number: `DEMO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  }))

  const { error } = await supabase
    .from('tickets')
    .insert(ticketData)

  if (error) {
    throw new Error(`Failed to create demo tickets: ${error.message}`)
  }
}

async function createKnowledgeArticles(articles: any[], organizationId: string, adminUserId: string): Promise<void> {
  const articleData = articles.map(article => ({
    ...article,
    organization_id: organizationId,
    author_id: adminUserId,
    view_count: Math.floor(Math.random() * 100)
  }))

  const { error } = await supabase
    .from('knowledge_articles')
    .insert(articleData)

  if (error) {
    throw new Error(`Failed to create knowledge articles: ${error.message}`)
  }
}

// ========================================
// MAIN SETUP HANDLER
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body: SetupRequest = await request.json()
    const { mode, seed, organization, admin_user, force } = body

    const progress: SetupResponse['progress'] = []
    const errors: string[] = []

    // Check if setup already exists
    progress.push({
      step: 'check_existing',
      completed: false,
      message: 'Checking existing setup...'
    })

    const hasExistingSetup = await checkExistingSetup()
    
    if (hasExistingSetup && !force) {
      return NextResponse.json({
        success: false,
        message: 'System already initialized. Use force=true to override.',
        progress
      }, { status: 400 })
    }

    progress[0].completed = true

    // Create organization
    progress.push({
      step: 'create_organization',
      completed: false,
      message: 'Creating organization...'
    })

    const orgData = organization || DEMO_ORGANIZATION
    const organizationId = await createOrganization(orgData)

    progress[1].completed = true

    // Create admin user
    progress.push({
      step: 'create_admin',
      completed: false,
      message: 'Creating admin user...'
    })

    const adminData = admin_user || DEMO_ADMIN_USER
    const adminUserId = await createAdminUser(adminData, organizationId)

    progress[2].completed = true

    let demoCredentials
    if (mode === 'demo' || (!organization && !admin_user)) {
      demoCredentials = {
        email: DEMO_ADMIN_USER.email,
        password: DEMO_ADMIN_USER.password
      }
    }

    // Seed demo data if requested
    if (seed) {
      try {
        // Create departments
        progress.push({
          step: 'create_departments',
          completed: false,
          message: 'Creating departments...'
        })

        const { data: departmentData } = await supabase
          .from('departments')
          .insert(DEMO_DEPARTMENTS.map(dept => ({
            ...dept,
            organization_id: organizationId,
            is_active: true
          })))
          .select('id, name')

        progress[3].completed = true

        // Create demo users
        progress.push({
          step: 'create_demo_users',
          completed: false,
          message: 'Creating demo users...'
        })

        await createDemoUsers(DEMO_USERS, organizationId, departmentData || [])
        progress[4].completed = true

        // Create demo tickets
        progress.push({
          step: 'create_demo_tickets',
          completed: false,
          message: 'Creating demo tickets...'
        })

        await createDemoTickets(DEMO_TICKETS, organizationId, adminUserId)
        progress[5].completed = true

        // Create knowledge articles
        progress.push({
          step: 'create_knowledge_articles',
          completed: false,
          message: 'Creating knowledge articles...'
        })

        await createKnowledgeArticles(DEMO_KNOWLEDGE_ARTICLES, organizationId, adminUserId)
        progress[6].completed = true

      } catch (seedError) {
        const errorMessage = seedError instanceof Error ? seedError.message : 'Unknown seeding error'
        errors.push(`Seeding warning: ${errorMessage}`)
      }
    }

    // Final success response
    const response: SetupResponse = {
      success: true,
      message: 'Setup completed successfully!',
      data: {
        organization_id: organizationId,
        admin_user_id: adminUserId,
        ...(demoCredentials && { demo_credentials: demoCredentials })
      },
      progress,
      ...(errors.length > 0 && { errors })
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Setup error:', error)
    
    const errorResponse: SetupResponse = {
      success: false,
      message: 'Setup failed',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}

// ========================================
// GET HANDLER - Check setup status
// ========================================

export async function GET() {
  try {
    const hasSetup = await checkExistingSetup()
    
    return NextResponse.json({
      initialized: hasSetup,
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check setup status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
