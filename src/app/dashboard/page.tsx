import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  // Mock data - in real app, fetch from Supabase
  const stats = {
    creditsUsed: 2347,
    creditsLimit: 10000,
    activeWorkflows: 8,
    totalRequests: 1234,
    successRate: 98.5,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'workflow',
      name: 'Document Processing',
      status: 'success',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'workflow',
      name: 'User Onboarding',
      status: 'success',
      time: '5 minutes ago',
    },
    {
      id: 3,
      type: 'api',
      name: 'AI Completion',
      status: 'success',
      time: '12 minutes ago',
    },
    {
      id: 4,
      type: 'workflow',
      name: 'Email Campaign',
      status: 'running',
      time: '15 minutes ago',
    },
  ];

  const usagePercentage = (stats.creditsUsed / stats.creditsLimit) * 100;

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description="Welcome back! Here's what's happening with your projects."
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Credits Used
              </CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.creditsUsed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                of {stats.creditsLimit.toLocaleString()} credits
              </p>
              <Progress
                value={stats.creditsUsed}
                max={stats.creditsLimit}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Workflows
              </CardTitle>
              <span className="text-2xl">⚡</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeWorkflows}</div>
              <p className="text-xs text-muted-foreground">
                Running automations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <span className="text-2xl">🚀</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRequests.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Successful executions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest workflow executions and API calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        {activity.type === 'workflow' ? '⚡' : '🤖'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.status === 'success'
                          ? 'success'
                          : activity.status === 'running'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 w-full">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">⚡</span>
                Create New Workflow
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">📄</span>
                Process Document
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">🤖</span>
                Run AI Task
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">📊</span>
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Usage Warning */}
        {usagePercentage > 80 && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚠️</span>
                Usage Alert
              </CardTitle>
              <CardDescription>
                You've used {usagePercentage.toFixed(0)}% of your monthly
                credits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Consider upgrading your plan to avoid service interruption.
              </p>
              <Button className="mt-4" size="sm">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
