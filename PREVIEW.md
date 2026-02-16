# Nexoai - Live Preview Guide

## 🎨 Preview the Full Application

You can now see a complete, working preview of the Nexoai platform!

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Pages Available

### Public Pages

1. **Landing Page** - [http://localhost:3000](http://localhost:3000)
   - Hero section with value proposition
   - Features overview
   - Pricing tiers
   - Call-to-action buttons

2. **Login Page** - [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
   - Email/password authentication
   - Social login options (Google, GitHub)
   - Forgot password link
   - Demo mode enabled (just click "Sign in")

3. **Signup Page** - [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
   - Full registration form
   - Password confirmation
   - Terms acceptance
   - Social signup options

### Dashboard Pages (Demo Mode)

All dashboard pages work without authentication in demo mode!

1. **Dashboard Home** - [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Stats cards (credits, workflows, requests, success rate)
   - Recent activity feed
   - Quick actions
   - Usage alerts

2. **Analytics** - [http://localhost:3000/dashboard/analytics](http://localhost:3000/dashboard/analytics)
   - Key metrics overview
   - Weekly activity chart
   - Top workflows performance
   - Error tracking

3. **Workflows** - [http://localhost:3000/dashboard/workflows](http://localhost:3000/dashboard/workflows)
   - Active workflows grid
   - Workflow execution history
   - Pre-built templates
   - Create new workflow button

4. **Billing** - [http://localhost:3000/dashboard/billing](http://localhost:3000/dashboard/billing)
   - Current plan details
   - Usage progress bars
   - Plan comparison cards
   - Invoice history
   - Stripe integration ready

## 🎯 Features Demonstrated

### ✅ Completed UI Components

- **Button** - Multiple variants (default, outline, ghost, destructive)
- **Card** - Flexible card component with header, content, footer
- **Badge** - Status indicators (success, warning, destructive)
- **Progress** - Animated progress bars

### ✅ Layouts

- **Sidebar Navigation** - Persistent sidebar with route highlighting
- **Header** - Page headers with actions
- **Dashboard Layout** - Full dashboard structure

### ✅ Pages

- **Landing Page** - Professional marketing page
- **Authentication** - Login and signup flows
- **Dashboard** - Stats and activity overview
- **Analytics** - Data visualization
- **Workflows** - Automation management
- **Billing** - Subscription management

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Grid layouts adapt to screen size

### Dark Mode Ready
- CSS variables for theming
- Automatic dark mode support
- Tailwind dark: classes

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states

### Animations
- Smooth transitions
- Hover effects
- Loading states
- Progress animations

## 🧪 Demo Data

All pages use **mock data** to demonstrate functionality:

- User stats and metrics
- Workflow execution history
- Billing information
- Usage tracking
- Activity feeds

## 🎬 Try These Features

1. **Navigate Dashboard**
   - Click through sidebar menu items
   - See active route highlighting
   - Smooth page transitions

2. **Explore Stats**
   - View credit usage progress
   - Check success rates
   - See recent activity

3. **Billing Management**
   - Compare pricing plans
   - View usage breakdowns
   - Check invoice history

4. **Workflows**
   - Browse active workflows
   - View execution logs
   - Explore templates

## 🔧 Customize the Preview

### Change Theme Colors

Edit [tailwind.config.ts](tailwind.config.ts):

```typescript
colors: {
  primary: 'hsl(221.2 83.2% 53.3%)', // Change primary color
  // ... other colors
}
```

### Update Mock Data

Edit any dashboard page to change the demo data:
- [Dashboard](src/app/dashboard/page.tsx)
- [Analytics](src/app/dashboard/analytics/page.tsx)
- [Billing](src/app/dashboard/billing/page.tsx)
- [Workflows](src/app/dashboard/workflows/page.tsx)

### Add New Pages

```typescript
// Create new file: src/app/dashboard/your-page/page.tsx
import { Header } from '@/components/dashboard/header';

export default function YourPage() {
  return (
    <div className="flex flex-col">
      <Header title="Your Page" />
      {/* Your content */}
    </div>
  );
}
```

## 📸 Screenshots

### Landing Page
- Modern hero section
- Feature highlights
- Pricing comparison
- Professional footer

### Dashboard
- Sidebar navigation
- Stats cards
- Activity feed
- Quick actions

### Billing
- Plan overview
- Usage meters
- Plan comparison
- Invoice history

## 🎨 UI Component Library

Reusable components in [src/components/ui](src/components/ui):

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Use in your components
<Button variant="default">Click me</Button>
<Badge variant="success">Active</Badge>
<Progress value={75} max={100} />
```

## 🚀 Next Steps

### Connect Real Data

1. Set up Supabase (see [supabase/README.md](supabase/README.md))
2. Replace mock data with API calls
3. Add real authentication
4. Connect Stripe for billing

### Add More Features

- [ ] User settings page
- [ ] Team management
- [ ] API documentation
- [ ] Activity logs
- [ ] Notifications
- [ ] File uploads
- [ ] Search functionality

## 💡 Tips

- **Hot Reload**: Changes auto-refresh in browser
- **TypeScript**: Full type safety enabled
- **Tailwind**: Use utility classes for styling
- **Components**: Reuse UI components from `/components/ui`

## 🐛 Troubleshooting

### Port 3000 in use
```bash
PORT=3001 npm run dev
```

### Changes not showing
```bash
# Clear cache
rm -rf .next
npm run dev
```

### Build errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

## ✨ What's Included

- ✅ Fully functional UI
- ✅ Responsive design
- ✅ Dark mode support
- ✅ TypeScript types
- ✅ Reusable components
- ✅ Professional styling
- ✅ Mock data for demo
- ✅ Navigation structure
- ✅ Form handling
- ✅ Loading states

---

**Enjoy exploring the preview!** 🎉

When ready, connect real data from Supabase and start building your custom features.
