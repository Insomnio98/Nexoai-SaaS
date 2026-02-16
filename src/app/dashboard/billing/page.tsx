import { Header } from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function BillingPage() {
  // Mock data - in real app, fetch from Supabase + Stripe
  const currentPlan = {
    name: 'Pro',
    price: 29,
    credits: 10000,
    creditsUsed: 2347,
    billingCycle: 'monthly',
    nextBillingDate: '2024-03-01',
    status: 'active',
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      credits: 1000,
      features: [
        '1,000 credits/month',
        'Basic AI features',
        'Community support',
        '2 active workflows',
      ],
      current: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      credits: 10000,
      features: [
        '10,000 credits/month',
        'Advanced AI features',
        'Priority support',
        'Unlimited workflows',
        'Custom integrations',
      ],
      current: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      credits: 50000,
      features: [
        '50,000 credits/month',
        'All AI features',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'White-labeling',
      ],
      current: false,
    },
  ];

  const invoices = [
    {
      id: 'inv_001',
      date: '2024-02-01',
      amount: 29.0,
      status: 'paid',
      description: 'Pro Plan - Monthly',
    },
    {
      id: 'inv_002',
      date: '2024-01-01',
      amount: 29.0,
      status: 'paid',
      description: 'Pro Plan - Monthly',
    },
    {
      id: 'inv_003',
      date: '2023-12-01',
      amount: 29.0,
      status: 'paid',
      description: 'Pro Plan - Monthly',
    },
  ];

  const usagePercentage = (currentPlan.creditsUsed / currentPlan.credits) * 100;

  return (
    <div className="flex flex-col">
      <Header
        title="Billing & Usage"
        description="Manage your subscription and view usage"
        action={
          <Button variant="outline">
            <span className="mr-2">⚙️</span>
            Manage in Stripe
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You're on the {currentPlan.name} plan
                </CardDescription>
              </div>
              <Badge variant="success">{currentPlan.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Monthly Cost</p>
                <p className="text-3xl font-bold">${currentPlan.price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Next Billing Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentPlan.nextBillingDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">Credits Used This Month</p>
                <p className="text-sm text-muted-foreground">
                  {currentPlan.creditsUsed.toLocaleString()} /{' '}
                  {currentPlan.credits.toLocaleString()}
                </p>
              </div>
              <Progress
                value={currentPlan.creditsUsed}
                max={currentPlan.credits}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {usagePercentage.toFixed(1)}% used
              </p>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline">Cancel Subscription</Button>
            <Button>Upgrade Plan</Button>
          </CardFooter>
        </Card>

        {/* Available Plans */}
        <div>
          <h2 className="mb-4 text-xl font-bold">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={
                  plan.current ? 'border-primary shadow-lg' : undefined
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.current && <Badge>Current</Badge>}
                  </div>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.current ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : plan.price > currentPlan.price ? (
                    <Button className="w-full">Upgrade</Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Downgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
              Your recent billing invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                      <Badge variant="success" className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Details */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
            <CardDescription>
              Credits used by category this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'AI Completions', credits: 1200, icon: '🤖' },
                { name: 'Document Processing', credits: 850, icon: '📄' },
                { name: 'Workflow Executions', credits: 200, icon: '⚡' },
                { name: 'API Calls', credits: 97, icon: '🔌' },
              ].map((category) => (
                <div key={category.name}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.credits.toLocaleString()} credits
                    </span>
                  </div>
                  <Progress
                    value={category.credits}
                    max={currentPlan.credits}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
