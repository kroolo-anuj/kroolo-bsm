// ========================================
// HEALTH CHECK API - BSM PLATFORM
// System health monitoring and diagnostics endpoint
// Provides comprehensive health status for all system components
// Includes database connectivity, external service availability
// Monitors system performance metrics and resource usage
// Provides detailed error reporting and troubleshooting information
// Supports both basic and detailed health check responses
// Includes uptime tracking and service availability metrics
// Optimized for monitoring tools and automated health checks
// Provides actionable insights for system administrators
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/config/supabase'

// ========================================
// HEALTH CHECK INTERFACE
// ========================================

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  environment: string
  uptime: number
  services: {
    database: ServiceHealth
    authentication: ServiceHealth
    storage: ServiceHealth
    email: ServiceHealth
    cache: ServiceHealth
  }
  metrics: {
    responseTime: number
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: number
  }
  errors?: string[]
}

interface ServiceHealth {
  status: 'up' | 'down' | 'degraded'
  responseTime?: number
  lastCheck: string
  error?: string
}

// ========================================
// HEALTH CHECK FUNCTIONS
// ========================================

async function checkDatabase(): Promise<ServiceHealth> {
  const startTime = Date.now()
  
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id')
      .limit(1)
    
    if (error) throw error
    
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function checkAuthentication(): Promise<ServiceHealth> {
  const startTime = Date.now()
  
  try {
    // Test auth service by getting current session
    const { error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    return {
      status: 'up',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function checkStorage(): Promise<ServiceHealth> {
  const startTime = Date.now()
  
  try {
    // Test storage by listing buckets (if configured)
    const { data, error } = await supabase.storage.listBuckets()
    
    // Storage might not be configured, so we don't fail on this
    return {
      status: error ? 'degraded' : 'up',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error ? error.message : undefined
    }
  } catch (error) {
    return {
      status: 'degraded',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function checkEmail(): Promise<ServiceHealth> {
  // For now, we'll assume email is working if SMTP is configured
  const hasEmailConfig = !!(
    process.env.SMTP_HOST || 
    process.env.SENDGRID_API_KEY
  )
  
  return {
    status: hasEmailConfig ? 'up' : 'degraded',
    lastCheck: new Date().toISOString(),
    error: hasEmailConfig ? undefined : 'Email service not configured'
  }
}

async function checkCache(): Promise<ServiceHealth> {
  // For now, we'll assume cache is working if Redis is configured
  const hasCacheConfig = !!(
    process.env.REDIS_URL || 
    process.env.UPSTASH_REDIS_REST_URL
  )
  
  return {
    status: hasCacheConfig ? 'up' : 'degraded',
    lastCheck: new Date().toISOString(),
    error: hasCacheConfig ? undefined : 'Cache service not configured'
  }
}

function getCPUUsage(): number {
  // Simple CPU usage estimation (not perfect but gives an idea)
  const startUsage = process.cpuUsage()
  const startTime = process.hrtime()
  
  // Wait a small amount of time
  const endTime = process.hrtime(startTime)
  const endUsage = process.cpuUsage(startUsage)
  
  const totalTime = endTime[0] * 1000000 + endTime[1] / 1000
  const totalUsage = endUsage.user + endUsage.system
  
  return Math.round((totalUsage / totalTime) * 100)
}

// ========================================
// MAIN HEALTH CHECK HANDLER
// ========================================

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const url = new URL(request.url)
  const detailed = url.searchParams.get('detailed') === 'true'
  
  try {
    // Basic health info
    const healthInfo: Partial<HealthCheckResult> = {
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    }

    // If detailed check requested, run all service checks
    if (detailed) {
      const [database, authentication, storage, email, cache] = await Promise.all([
        checkDatabase(),
        checkAuthentication(),
        checkStorage(),
        checkEmail(),
        checkCache()
      ])

      healthInfo.services = {
        database,
        authentication,
        storage,
        email,
        cache
      }

      // Calculate overall status
      const serviceStatuses = Object.values(healthInfo.services).map(s => s.status)
      const hasDown = serviceStatuses.includes('down')
      const hasDegraded = serviceStatuses.includes('degraded')
      
      healthInfo.status = hasDown ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy'

      // Add metrics
      healthInfo.metrics = {
        responseTime: Date.now() - startTime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: getCPUUsage()
      }

      // Collect any errors
      const errors = Object.values(healthInfo.services)
        .filter(s => s.error)
        .map(s => s.error!)
      
      if (errors.length > 0) {
        healthInfo.errors = errors
      }
    } else {
      // Basic health check - just verify database connectivity
      const dbHealth = await checkDatabase()
      healthInfo.status = dbHealth.status === 'up' ? 'healthy' : 'unhealthy'
      healthInfo.metrics = {
        responseTime: Date.now() - startTime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: 0 // Skip CPU calculation for basic check
      }
    }

    // Return appropriate status code
    const statusCode = healthInfo.status === 'healthy' ? 200 : 
                      healthInfo.status === 'degraded' ? 200 : 503

    return NextResponse.json(healthInfo, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    const errorResponse: Partial<HealthCheckResult> = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      metrics: {
        responseTime: Date.now() - startTime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: 0
      },
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

// ========================================
// OPTIONS HANDLER FOR CORS
// ========================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-cache'
    }
  })
}
