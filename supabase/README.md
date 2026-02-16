# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `nexoai-prod` (or your choice)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
4. Click "Create new project"

## 2. Local Development Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase (if not already done)
supabase init

# Start local Supabase instance
supabase start

# This will give you:
# - API URL: http://localhost:54321
# - GraphQL URL: http://localhost:54321/graphql/v1
# - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# - Studio URL: http://localhost:54323
# - Inbucket URL: http://localhost:54324
# - anon key: eyJhbGc...
# - service_role key: eyJhbGc...
```

## 3. Run Migrations

```bash
# Link to your remote project
supabase link --project-ref your-project-ref

# Push migrations to remote database
supabase db push

# Or run locally
supabase migration up
```

## 4. Configure Environment Variables

Add these to your `.env.local`:

```bash
# From Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# From Supabase Dashboard > Settings > API (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# From Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres
```

## 5. Set Up Row Level Security (RLS)

RLS is already configured in the migration file. Verify it's working:

1. Go to Supabase Dashboard > Authentication
2. Create a test user
3. Go to Table Editor
4. Try to view data - you should only see data for your organization

## 6. Configure Authentication

### Email Templates

Customize email templates:
1. Go to Dashboard > Authentication > Email Templates
2. Update:
   - Confirm signup
   - Invite user
   - Magic Link
   - Reset password

### OAuth Providers (Optional)

Enable Google/GitHub login:
1. Go to Dashboard > Authentication > Providers
2. Enable desired providers
3. Add OAuth credentials
4. Update redirect URLs

## 7. Storage Buckets

Create storage buckets for file uploads:

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('avatars', 'avatars', true);

-- Set up RLS policies for storage
CREATE POLICY "Users can upload their org documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view their org documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

## 8. Database Backups

Supabase Pro+ includes automatic daily backups.

### Manual Backup

```bash
# Backup to file
supabase db dump -f backup.sql

# Restore from file
psql $DATABASE_URL < backup.sql
```

## 9. Monitoring & Logs

- **Database**: Dashboard > Database > Logs
- **API**: Dashboard > Logs > API Logs
- **Auth**: Dashboard > Logs > Auth Logs

## 10. Production Checklist

- [ ] RLS policies enabled on all tables
- [ ] Service role key stored securely (Vercel env vars)
- [ ] Email templates customized
- [ ] OAuth providers configured (if using)
- [ ] Storage buckets created with RLS
- [ ] Database backups scheduled
- [ ] Monitoring alerts set up
- [ ] Connection pooling enabled for production
- [ ] SSL mode enabled for database connections

## Common Commands

```bash
# Generate TypeScript types from database
supabase gen types typescript --local > src/types/database.ts

# Create a new migration
supabase migration new my_migration_name

# Reset local database
supabase db reset

# View local database
psql postgresql://postgres:postgres@localhost:54322/postgres

# Stop local Supabase
supabase stop
```

## Troubleshooting

### Connection Issues
- Check firewall settings
- Verify DATABASE_URL is correct
- Ensure connection pooling is configured

### RLS Not Working
- Verify policies are created
- Check user authentication
- Test with service role key (bypasses RLS)

### Migration Errors
- Review migration file syntax
- Check for conflicts with existing data
- Use `supabase db reset` for local issues

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [CLI Reference](https://supabase.com/docs/reference/cli)
