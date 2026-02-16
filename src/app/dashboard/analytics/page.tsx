import { Header } from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsPage() {
  const stats = {
    totalUsers: 1234,
    activeUsers: 892,
    revenue: 15678,
    growth: 23.5,
  };

  const topWorkflows = [
    { name: 'Document Processing', executions: 3456, successRate: 98.2 },
    { name: 'User Onboarding', executions: 2341, successRate: 99.5 },
    { name: 'Email Campaign', executions: 1987, successRate: 95.8 },
    { name: 'Data Sync', executions: 1543, successRate: 97.3 },
  ];

  const dailyStats = [
    { day: 'Mon', requests: 245, success: 240 },
    { day: 'Tue', requests: 312, success: 308 },
    { day: 'Wed', requests: 289, success: 285 },
    { day: 'Thu', requests: 356, success: 351 },
    { day: 'Fri', requests: 401, success: 395 },
    { day: 'Sat', requests: 178, success: 176 },
    { day: 'Sun', requests: 156, success: 154 },
  ];

  return (
    <div className="flex flex-col">
      <Header
        title="Analytics"
        description="Track your usage and performance metrics"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+{stats.growth}%</span> from
                last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <span className="text-2xl">🔥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.revenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.growth}%</div>
              <p className="text-xs text-muted-foreground">Month over month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>API requests over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyStats.map((day) => {
                  const maxRequests = Math.max(...dailyStats.map((d) => d.requests));
                  const width = (day.requests / maxRequests) * 100;
                  const successRate = (day.success / day.requests) * 100;

                  return (
                    <div key={day.day}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{day.day}</span>
                        <span className="text-muted-foreground">
                          {day.requests} requests
                        </span>
                      </div>
                      <div className="relative h-8 w-full overflow-hidden rounded-lg bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${width}%` }}
                        >
                          <span className="flex h-full items-center px-2 text-xs text-primary-foreground">
                            {successRate.toFixed(1)}% success
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Top Workflows</CardTitle>
              <CardDescription>Most executed workflows this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topWorkflows.map((workflow, index) => (
                  <div
                    key={workflow.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{workflow.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {workflow.executions.toLocaleString()} executions
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">
                      {workflow.successRate.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Error Tracking</CardTitle>
            <CardDescription>Recent errors and failures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  workflow: 'Document Processing',
                  error: 'File too large',
                  count: 3,
                  time: '2 hours ago',
                },
                {
                  workflow: 'Email Campaign',
                  error: 'Rate limit exceeded',
                  count: 1,
                  time: '5 hours ago',
                },
                {
                  workflow: 'Data Sync',
                  error: 'Connection timeout',
                  count: 2,
                  time: '1 day ago',
                },
              ].map((error, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
                >
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">
                      {error.workflow}
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error.error}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{error.count}x</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {error.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
