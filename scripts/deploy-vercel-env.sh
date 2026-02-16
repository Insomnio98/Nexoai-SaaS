#!/bin/bash

# Deploy all environment variables to Vercel

echo "🚀 Deploying environment variables to Vercel..."

# Read from .env.local and push to Vercel
while IFS='=' read -r key value; do
  # Skip comments and empty lines
  if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
    continue
  fi
  
  # Remove quotes from value
  value=$(echo "$value" | sed 's/^"//' | sed 's/"$//')
  
  # Skip Vercel's own tokens
  if [[ $key == VERCEL_* ]]; then
    continue
  fi
  
  echo "Setting $key..."
  echo "$value" | vercel env add "$key" production --yes 2>/dev/null || true
done < .env.local

echo "✅ All environment variables deployed!"
echo "Now run: vercel --prod"
