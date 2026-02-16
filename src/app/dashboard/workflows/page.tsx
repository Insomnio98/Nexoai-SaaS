import { Header } from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function WorkflowsPage() {
  const workflows = [
    {
      id: 1,
      name: 'User Onboarding',
      description: 'Automated welcome emails and account setup',
      status: 'active',
      executions: 2341,
      lastRun: '5 minutes ago',
      successRate: 99.5,
      icon: '👋',
    },
    {
      id: 2,
      name: 'Document Processing',
      description: 'AI-powered document analysis and summarization',
      status: 'active',
      executions: 3456,
      lastRun: '2 minutes ago',
      successRate: 98.2,
      icon: '📄',
    },
    {
      id: 3,
      name: 'Email Campaign',
      description: 'Automated email marketing campaigns',
      status: 'active',
      executions: 1987,
      lastRun: '15 minutes ago',
      successRate: 95.8,
      icon: '📧',
    },
    {
      id: 4,
      name: 'Data Sync',
      description: 'Sync data with external systems',
      status: 'paused',
      executions: 1543,
      lastRun: '1 hour ago',
      successRate: 97.3,
      icon: '🔄',
    },
    {
      id: 5,
      name: 'Payment Processing',
      description: 'Handle subscription and payment events',
      status: 'active',
      executions: 892,
      lastRun: '30 minutes ago',
      successRate: 99.9,
      icon: '💳',
    },
    {
      id: 6,
      name: 'Report Generation',
      description: 'Generate and send weekly reports',
      status: 'scheduled',
      executions: 456,
      lastRun: '2 days ago',
      successRate: 100,
      icon: '📊',
    },
  ];

  const recentExecutions = [
    {
      id: 1,
      workflow: 'Document Processing',
      status: 'success',
      duration: '2.3s',
      time: '2 min ago',
      credits: 10,
    },
    {
      id: 2,
      workflow: 'User Onboarding',
      status: 'success',
      duration: '1.8s',
      time: '5 min ago',
      credits: 5,
    },
    {
      id: 3,
      workflow: 'Email Campaign',
      status: 'success',
      duration: '3.1s',
      time: '8 min ago',
      credits: 3,
    },
    {
      id: 4,
      workflow: 'Document Processing',
      status: 'error',
      duration: '0.5s',
      time: '12 min ago',
      credits: 0,
    },
    {
      id: 5,
      workflow: 'Payment Processing',
      status: 'success',
      duration: '1.2s',
      time: '18 min ago',
      credits: 2,
    },
  ];

  return (
    <div className="flex flex-col">
      <Header
        title="Workflows"
        description="Manage and monitor your automation workflows"
        action={
          <Button>
            <span className="mr-2">+</span>
            New Workflow
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Workflows Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Active Workflows</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{workflow.icon}</div>
                      <div>
                        <CardTitle className="text-base">
                          {workflow.name}
                        </CardTitle>
                        <Badge
                          variant={
                            workflow.status === 'active'
                              ? 'success'
                              : workflow.status === 'paused'
                              ? 'warning'
                              : 'default'
                          }
                          className="mt-1"
                        >
                          {workflow.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {workflow.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Executions</span>
                      <span className="font-medium">
                        {workflow.executions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-green-600">
                        {workflow.successRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Run</span>
                      <span className="font-medium">{workflow.lastRun}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Executions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Executions</CardTitle>
            <CardDescription>
              Latest workflow runs and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExecutions.map((execution) => (
                <div
                  key={execution.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        execution.status === 'success'
                          ? 'success'
                          : 'destructive'
                      }
                    >
                      {execution.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{execution.workflow}</p>
                      <p className="text-sm text-muted-foreground">
                        {execution.time} • {execution.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {execution.credits} credits
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Load More
            </Button>
          </CardContent>
        </Card>

        {/* Workflow Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Templates</CardTitle>
            <CardDescription>
              Pre-built workflows you can deploy instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: 'Lead Scoring',
                  description: 'Automatically score and route new leads',
                  icon: '🎯',
                },
                {
                  name: 'Customer Feedback',
                  description: 'Collect and analyze customer feedback',
                  icon: '💬',
                },
                {
                  name: 'Inventory Sync',
                  description: 'Keep inventory synchronized across platforms',
                  icon: '📦',
                },
                {
                  name: 'Social Media Publishing',
                  description: 'Schedule and publish social media content',
                  icon: '📱',
                },
              ].map((template, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Deploy</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
