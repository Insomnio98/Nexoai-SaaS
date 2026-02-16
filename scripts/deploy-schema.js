#!/usr/bin/env node

/**
 * Deploy Database Schema to Supabase
 *
 * This script reads the migration SQL file and executes it directly
 * on the Supabase database using the service role client.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deploySchema() {
  console.log('🚀 Starting database schema deployment...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240101000000_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📏 SQL size:', migrationSQL.length, 'characters\n');

    // Split the SQL into individual statements
    // (Supabase RPC can handle multiple statements but we'll split for better error reporting)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📦 Found ${statements.length} SQL statements to execute\n`);

    // Execute using Supabase's SQL editor API
    console.log('⚙️  Executing migration via Supabase...');

    // Note: We'll use the direct SQL execution approach
    // This requires using fetch to call Supabase's SQL API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: migrationSQL })
    });

    if (!response.ok) {
      // If direct SQL execution fails, we'll need to use an alternative approach
      console.log('⚠️  Direct SQL execution not available via REST API');
      console.log('📋 Please execute the migration manually:\n');
      console.log('1. Go to https://app.supabase.com/project/btxkfuecplntpavvexxp/sql/new');
      console.log('2. Copy the SQL from: supabase/migrations/20240101000000_initial_schema.sql');
      console.log('3. Paste and run it in the SQL editor\n');

      // Alternative: Write a simplified version using Supabase client queries
      console.log('🔄 Attempting alternative approach using Supabase client...\n');

      // Check if tables already exist
      const { data: tables, error: tablesError } = await supabase
        .from('organizations')
        .select('id')
        .limit(1);

      if (!tablesError) {
        console.log('✅ Database tables already exist! Schema is deployed.');
        return true;
      }

      console.log('⚠️  Tables do not exist. Manual migration required.');
      return false;
    }

    console.log('✅ Migration executed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Error deploying schema:', error.message);
    console.error('\n📋 Manual deployment required:');
    console.error('1. Go to: https://app.supabase.com/project/btxkfuecplntpavvexxp/sql/new');
    console.error('2. Copy SQL from: supabase/migrations/20240101000000_initial_schema.sql');
    console.error('3. Paste and execute in SQL editor');
    return false;
  }
}

// Verify deployment by checking tables
async function verifyDeployment() {
  console.log('\n🔍 Verifying deployment...\n');

  const tablesToCheck = ['organizations', 'users', 'usage_events', 'workflow_executions'];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Table "${table}": NOT FOUND`);
        console.log(`   Error: ${error.message}`);
      } else {
        console.log(`✅ Table "${table}": EXISTS`);
      }
    } catch (error) {
      console.log(`❌ Table "${table}": ERROR - ${error.message}`);
    }
  }
}

// Run deployment
(async () => {
  const success = await deploySchema();
  await verifyDeployment();

  if (success) {
    console.log('\n✨ Database schema deployment completed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Manual deployment may be required. See instructions above.\n');
    process.exit(1);
  }
})();
