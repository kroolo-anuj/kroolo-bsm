// ========================================
// UNIFIED BSM CLIENT - Complete CRUD Operations
// ========================================

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface Organization {
  id?: string
  name: string
  slug: string
  plan_type?: string
  max_users?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface User {
  id?: string
  email: string
  full_name: string
  organization_id: string
  department_id?: string
  is_active?: boolean
  last_login_at?: string
  created_at?: string
  updated_at?: string
}

export interface Department {
  id?: string
  name: string
  description?: string
  organization_id: string
  parent_department_id?: string
  head_user_id?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface UserRole {
  id?: string
  user_id: string
  role_name: string
  hierarchy_level?: number
  permissions?: Record<string, any>
  organization_id: string
  created_at?: string
  updated_at?: string
}

export interface Ticket {
  id?: string
  ticket_number?: string
  title: string
  description?: string
  status?: string
  priority?: string
  type?: string
  organization_id: string
  department_id?: string
  reported_by_id?: string
  assignee_id?: string
  resolved_at?: string
  created_at?: string
  updated_at?: string
}

export interface TicketComment {
  id?: string
  ticket_id: string
  user_id: string
  comment: string
  is_internal?: boolean
  created_at?: string
}

export interface ActivityLog {
  id?: string
  organization_id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id: string
  details?: Record<string, any>
  created_at?: string
}

export interface KnowledgeArticle {
  id?: string
  title: string
  content: string
  category?: string
  tags?: string[]
  organization_id: string
  author_id?: string
  is_published?: boolean
  view_count?: number
  created_at?: string
  updated_at?: string
}

export interface QueryFilters {
  organization_id?: string
  department_id?: string
  user_id?: string
  status?: string
  priority?: string
  type?: string
  is_active?: boolean
  search?: string
  limit?: number
  offset?: number
  order_by?: string
  order_direction?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
  success: boolean
}

// ========================================
// UNIFIED BSM CLIENT CLASS
// ========================================

export class UnifiedBSMClient {
  private supabase: SupabaseClient
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  // ========================================
  // GENERIC CRUD OPERATIONS
  // ========================================

  /**
   * Generic create method for any entity
   */
  async create<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      return {
        data: result,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  /**
   * Generic read method with filtering and pagination
   */
  async read<T>(
    table: string, 
    filters: QueryFilters = {},
    select: string = '*'
  ): Promise<ApiResponse<T[]>> {
    try {
      let query = this.supabase.from(table).select(select, { count: 'exact' })

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'limit' && key !== 'offset' && 
            key !== 'order_by' && key !== 'order_direction' && key !== 'search') {
          query = query.eq(key, value)
        }
      })

      // Apply search
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%, name.ilike.%${filters.search}%, description.ilike.%${filters.search}%`)
      }

      // Apply ordering
      if (filters.order_by) {
        query = query.order(filters.order_by, { 
          ascending: filters.order_direction === 'asc' 
        })
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
      }

      const { data, error, count } = await query

      return {
        data: data || [],
        error: error?.message || null,
        count: count || 0,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        count: 0,
        success: false
      }
    }
  }

  /**
   * Generic update method
   */
  async update<T>(
    table: string, 
    id: string, 
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { data: result, error } = await this.supabase
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      return {
        data: result,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  /**
   * Generic delete method
   */
  async delete(table: string, id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id)

      return {
        data: true,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  /**
   * Get single record by ID
   */
  async getById<T>(
    table: string, 
    id: string, 
    select: string = '*'
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select(select)
        .eq('id', id)
        .single()

      return {
        data: data,
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // ========================================
  // ORGANIZATION OPERATIONS
  // ========================================

  async createOrganization(data: Omit<Organization, 'id'>): Promise<ApiResponse<Organization>> {
    return this.create<Organization>('organizations', data)
  }

  async getOrganizations(filters?: QueryFilters): Promise<ApiResponse<Organization[]>> {
    return this.read<Organization>('organizations', filters)
  }

  async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
    return this.getById<Organization>('organizations', id)
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<ApiResponse<Organization>> {
    return this.update<Organization>('organizations', id, data)
  }

  async deleteOrganization(id: string): Promise<ApiResponse<boolean>> {
    return this.delete('organizations', id)
  }

  // ========================================
  // USER OPERATIONS
  // ========================================

  async createUser(data: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    return this.create<User>('users', data)
  }

  async getUsers(filters?: QueryFilters): Promise<ApiResponse<User[]>> {
    const select = `
      *,
      organization:organizations(name, slug),
      department:departments(name),
      user_roles(role_name, hierarchy_level, permissions)
    `
    return this.read<User>('users', filters, select)
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    const select = `
      *,
      organization:organizations(name, slug),
      department:departments(name),
      user_roles(role_name, hierarchy_level, permissions)
    `
    return this.getById<User>('users', id, select)
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.update<User>('users', id, data)
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    return this.delete('users', id)
  }

  // ========================================
  // DEPARTMENT OPERATIONS
  // ========================================

  async createDepartment(data: Omit<Department, 'id'>): Promise<ApiResponse<Department>> {
    return this.create<Department>('departments', data)
  }

  async getDepartments(filters?: QueryFilters): Promise<ApiResponse<Department[]>> {
    const select = `
      *,
      organization:organizations(name),
      parent_department:departments!parent_department_id(name),
      head_user:users!head_user_id(full_name, email),
      child_departments:departments!parent_department_id(count)
    `
    return this.read<Department>('departments', filters, select)
  }

  async getDepartmentById(id: string): Promise<ApiResponse<Department>> {
    const select = `
      *,
      organization:organizations(name),
      parent_department:departments!parent_department_id(name),
      head_user:users!head_user_id(full_name, email),
      child_departments:departments!parent_department_id(*)
    `
    return this.getById<Department>('departments', id, select)
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<ApiResponse<Department>> {
    return this.update<Department>('departments', id, data)
  }

  async deleteDepartment(id: string): Promise<ApiResponse<boolean>> {
    return this.delete('departments', id)
  }

  // ========================================
  // TICKET OPERATIONS
  // ========================================

  async createTicket(data: Omit<Ticket, 'id' | 'ticket_number'>): Promise<ApiResponse<Ticket>> {
    // Generate ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    const ticketData = { ...data, ticket_number: ticketNumber }
    
    const result = await this.create<Ticket>('tickets', ticketData)
    
    // Log activity
    if (result.success && result.data) {
      await this.logActivity({
        organization_id: data.organization_id,
        user_id: data.reported_by_id,
        action: 'create',
        entity_type: 'ticket',
        entity_id: result.data.id!,
        details: { title: data.title, status: data.status }
      })
    }
    
    return result
  }

  async getTickets(filters?: QueryFilters): Promise<ApiResponse<Ticket[]>> {
    const select = `
      *,
      organization:organizations(name),
      department:departments(name),
      reported_by:users!reported_by_id(full_name, email),
      assignee:users!assignee_id(full_name, email),
      comments:ticket_comments(count)
    `
    return this.read<Ticket>('tickets', filters, select)
  }

  async getTicketById(id: string): Promise<ApiResponse<Ticket>> {
    const select = `
      *,
      organization:organizations(name),
      department:departments(name),
      reported_by:users!reported_by_id(full_name, email),
      assignee:users!assignee_id(full_name, email),
      comments:ticket_comments(*, user:users(full_name, email))
    `
    return this.getById<Ticket>('tickets', id, select)
  }

  async updateTicket(id: string, data: Partial<Ticket>): Promise<ApiResponse<Ticket>> {
    const result = await this.update<Ticket>('tickets', id, data)
    
    // Log activity
    if (result.success && result.data) {
      await this.logActivity({
        organization_id: result.data.organization_id,
        action: 'update',
        entity_type: 'ticket',
        entity_id: id,
        details: data
      })
    }
    
    return result
  }

  async deleteTicket(id: string): Promise<ApiResponse<boolean>> {
    return this.delete('tickets', id)
  }

  // ========================================
  // TICKET COMMENT OPERATIONS
  // ========================================

  async addTicketComment(data: Omit<TicketComment, 'id'>): Promise<ApiResponse<TicketComment>> {
    return this.create<TicketComment>('ticket_comments', data)
  }

  async getTicketComments(ticketId: string): Promise<ApiResponse<TicketComment[]>> {
    const select = `
      *,
      user:users(full_name, email)
    `
    return this.read<TicketComment>('ticket_comments', { ticket_id: ticketId }, select)
  }

  // ========================================
  // USER ROLE OPERATIONS
  // ========================================

  async assignUserRole(data: Omit<UserRole, 'id'>): Promise<ApiResponse<UserRole>> {
    return this.create<UserRole>('user_roles', data)
  }

  async getUserRoles(filters?: QueryFilters): Promise<ApiResponse<UserRole[]>> {
    const select = `
      *,
      user:users(full_name, email),
      organization:organizations(name)
    `
    return this.read<UserRole>('user_roles', filters, select)
  }

  async updateUserRole(id: string, data: Partial<UserRole>): Promise<ApiResponse<UserRole>> {
    return this.update<UserRole>('user_roles', id, data)
  }

  async deleteUserRole(id: string): Promise<ApiResponse<boolean>> {
    return this.delete('user_roles', id)
  }

  // ========================================
  // KNOWLEDGE BASE OPERATIONS
  // ========================================

  async createKnowledgeArticle(data: Omit<KnowledgeArticle, 'id'>): Promise<ApiResponse<KnowledgeArticle>> {
    return this.create<KnowledgeArticle>('knowledge_articles', data)
  }

  async getKnowledgeArticles(filters?: QueryFilters): Promise<ApiResponse<KnowledgeArticle[]>> {
    const select = `
      *,
      author:users!author_id(full_name, email),
      organization:organizations(name)
    `
    return this.read<KnowledgeArticle>('knowledge_articles', filters, select)
  }

  async getKnowledgeArticleById(id: string): Promise<ApiResponse<KnowledgeArticle>> {
    // Increment view count
    await this.supabase.rpc('increment_article_views', { article_id: id })
    
    const select = `
      *,
      author:users!author_id(full_name, email),
      organization:organizations(name)
    `
    return this.getById<KnowledgeArticle>('knowledge_articles', id, select)
  }

  async updateKnowledgeArticle(id: string, data: Partial<KnowledgeArticle>): Promise<ApiResponse<KnowledgeArticle>> {
    return this.update<KnowledgeArticle>('knowledge_articles', id, data)
  }

  async deleteKnowledgeArticle(id: string): Promise<ApiResponse<boolean>> {
    return this.delete('knowledge_articles', id)
  }

  // ========================================
  // ACTIVITY LOG OPERATIONS
  // ========================================

  async logActivity(data: Omit<ActivityLog, 'id'>): Promise<ApiResponse<ActivityLog>> {
    return this.create<ActivityLog>('activity_logs', data)
  }

  async getActivityLogs(filters?: QueryFilters): Promise<ApiResponse<ActivityLog[]>> {
    const select = `
      *,
      user:users(full_name, email),
      organization:organizations(name)
    `
    return this.read<ActivityLog>('activity_logs', filters, select)
  }

  // ========================================
  // ANALYTICS & REPORTING
  // ========================================

  async getTicketAnalytics(organizationId: string, dateRange?: { from: string; to: string }) {
    try {
      let query = this.supabase
        .from('tickets')
        .select('status, priority, type, created_at, resolved_at')
        .eq('organization_id', organizationId)

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to)
      }

      const { data, error } = await query

      if (error) throw error

      // Process analytics data
      const analytics = {
        total_tickets: data.length,
        by_status: this.groupBy(data, 'status'),
        by_priority: this.groupBy(data, 'priority'),
        by_type: this.groupBy(data, 'type'),
        resolved_count: data.filter(t => t.resolved_at).length,
        avg_resolution_time: this.calculateAvgResolutionTime(data)
      }

      return {
        data: analytics,
        error: null,
        success: true
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  async getDepartmentAnalytics(organizationId: string) {
    try {
      const { data, error } = await this.supabase
        .from('departments')
        .select(`
          *,
          users(count),
          tickets(count)
        `)
        .eq('organization_id', organizationId)

      return {
        data: data || [],
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: [],
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  private groupBy(array: any[], key: string) {
    return array.reduce((result, item) => {
      const group = item[key] || 'Unknown'
      result[group] = (result[group] || 0) + 1
      return result
    }, {})
  }

  private calculateAvgResolutionTime(tickets: any[]) {
    const resolvedTickets = tickets.filter(t => t.resolved_at && t.created_at)
    if (resolvedTickets.length === 0) return 0

    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      const created = new Date(ticket.created_at).getTime()
      const resolved = new Date(ticket.resolved_at).getTime()
      return sum + (resolved - created)
    }, 0)

    return Math.round(totalTime / resolvedTickets.length / (1000 * 60 * 60)) // Hours
  }

  // ========================================
  // SEARCH OPERATIONS
  // ========================================

  async globalSearch(organizationId: string, query: string, limit: number = 20) {
    try {
      const searchTerm = `%${query}%`
      
      // Search across multiple tables
      const [tickets, users, departments, articles] = await Promise.all([
        this.supabase
          .from('tickets')
          .select('id, title, description, type, status')
          .eq('organization_id', organizationId)
          .or(`title.ilike.${searchTerm}, description.ilike.${searchTerm}`)
          .limit(limit / 4),
        
        this.supabase
          .from('users')
          .select('id, full_name, email')
          .eq('organization_id', organizationId)
          .or(`full_name.ilike.${searchTerm}, email.ilike.${searchTerm}`)
          .limit(limit / 4),
        
        this.supabase
          .from('departments')
          .select('id, name, description')
          .eq('organization_id', organizationId)
          .or(`name.ilike.${searchTerm}, description.ilike.${searchTerm}`)
          .limit(limit / 4),
        
        this.supabase
          .from('knowledge_articles')
          .select('id, title, content, category')
          .eq('organization_id', organizationId)
          .or(`title.ilike.${searchTerm}, content.ilike.${searchTerm}`)
          .limit(limit / 4)
      ])

      const results = {
        tickets: tickets.data?.map(item => ({ ...item, type: 'ticket' })) || [],
        users: users.data?.map(item => ({ ...item, type: 'user' })) || [],
        departments: departments.data?.map(item => ({ ...item, type: 'department' })) || [],
        articles: articles.data?.map(item => ({ ...item, type: 'article' })) || []
      }

      return {
        data: results,
        error: null,
        success: true
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  // ========================================
  // BATCH OPERATIONS
  // ========================================

  async batchUpdate(table: string, updates: Array<{ id: string; data: any }>) {
    try {
      const promises = updates.map(({ id, data }) => 
        this.update(table, id, data)
      )
      
      const results = await Promise.all(promises)
      const successful = results.filter(r => r.success)
      const failed = results.filter(r => !r.success)

      return {
        data: {
          successful: successful.length,
          failed: failed.length,
          results
        },
        error: failed.length > 0 ? `${failed.length} operations failed` : null,
        success: failed.length === 0
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }

  async batchDelete(table: string, ids: string[]) {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .in('id', ids)

      return {
        data: { deleted_count: ids.length },
        error: error?.message || null,
        success: !error
      }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Unknown error',
        success: false
      }
    }
  }
}

// ========================================
// CLIENT INSTANCE
// ========================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const bsmClient = new UnifiedBSMClient(supabaseUrl, supabaseAnonKey)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default UnifiedBSMClient
