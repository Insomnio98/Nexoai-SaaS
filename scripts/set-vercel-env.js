#!/usr/bin/env node

/**
 * Set all environment variables in Vercel
 */

const { execSync } = require('child_process');
const fs = require('path');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = require('fs').readFileSync(envPath, 'utf8');

const envVars = {};
const lines = envContent.split('\n');

for (const line of lines) {
  const trimmed = line.trim();

  // Skip comments and empty lines
  if (!trimmed || trimmed.startsWith('#')) continue;

  // Parse key=value
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (!match) continue;

  const key = match[1].trim();
  let value = match[2].trim();

  // Remove quotes
  value = value.replace(/^["'](.*)["']$/, '$1');

  // Skip Vercel's own vars
  if (key.startsWith('VERCEL_')) continue;

  envVars[key] = value;
}

console.log('🚀 Setting environment variables in Vercel...\n');

Object.entries(envVars).forEach(([key, value]) => {
  try {
    console.log(`Setting: ${key}`);

    // Use Vercel CLI to set environment variable
    execSync(`echo "${value}" | vercel env add ${key} production`, {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    // Variable might already exist, try to remove and re-add
    try {
      execSync(`vercel env rm ${key} production --yes`, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      });
      execSync(`echo "${value}" | vercel env add ${key} production`, {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      });
      console.log(`  ✓ Updated ${key}`);
    } catch (err) {
      console.log(`  ⚠️  ${key} (may already exist)`);
    }
  }
});

console.log('\n✅ All environment variables configured!');
console.log('\nNext steps:');
console.log('1. Run: vercel --prod');
console.log('2. Update Stripe webhook URL to your Vercel URL');
console.log('3. Configure Google OAuth in Supabase');
