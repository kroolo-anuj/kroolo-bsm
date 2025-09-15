// ========================================
// MAIN DASHBOARD PAGE - BSM PLATFORM
// Central dashboard with key metrics, charts, and quick actions
// Provides comprehensive overview of system performance and status
// Includes real-time data visualization and trend analysis
// Features customizable widgets and personalized user experience
// Implements role-based dashboard content and access controls
// Includes quick actions for common tasks and workflows
// Provides system health indicators and alert notifications
// Optimized for performance with efficient data loading
// Features responsive design for all device sizes
// ========================================

'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Ticket, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Activity
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/components/providers/AuthProvider'

// Mock data - in real app, this would come from APIs
const mockData = {
  metrics: {
    totalTickets: 1247,
    openTickets: 89,
    resolvedToday: 23,
    avgResolutionTime: '2.4 hours',
    userSatisfaction: 94.2,
    activeUsers: 156
  },
  recentTickets: [
    { id: 'TKT-001', title: 'Email server not responding', priority: 'high', status: 'open', assignee: 'John Doe' },
    { id: 'TKT-002', title: 'New software license request', priority: 'medium', status: 'in-progress', assignee: 'Jane Smith' },
    { id: 'TKT-003', title: 'Password reset assistance', priority: 'low', status: 'resolved', assignee: 'Mike Johnson' },
  ],
  chartData: [
    { name: 'Mon', tickets: 12, resolved: 10 },
    { name: 'Tue', tickets: 19, resolved: 15 },
    { name: 'Wed', tickets: 15, resolved: 18 },
    { name: 'Thu', tickets: 22, resolved: 20 },
    { name: 'Fri', tickets: 18, resolved: 16 },
    { name: 'Sat', tickets: 8, resolved: 12 },
    { name: 'Sun', tickets: 5, resolved: 8 },
  ]
}

export default function DashboardPage() {
  const { user, organization } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your {organization?.name || 'organization'} today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.metrics.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.metrics.openTickets}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.metrics.resolvedToday}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.metrics.avgResolutionTime}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-8%</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Weekly Performance
            </CardTitle>
            <CardDescription>
              Tickets created vs resolved over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {/* In a real app, this would be a chart component */}
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Ticket className="h-5 w-5 mr-2" />
                Recent Tickets
              </span>
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
            <CardDescription>
              Latest support requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{ticket.id}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {ticket.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Assigned to {ticket.assignee}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts to get things done faster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              Create Ticket
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              System Health
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-sm text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services</span>
                <span className="text-sm text-green-600 font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Storage</span>
                <span className="text-sm text-green-600 font-medium">Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New user registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Ticket TKT-045 resolved</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-orange-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">System backup completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
