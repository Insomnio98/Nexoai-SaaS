# 🔐 Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create a New Project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name: "Nexoai" or your preferred name
   - Click "Create"

3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" → Click "Create"
   - Fill in:
     - App name: Nexoai
     - User support email: your email
     - App logo: (optional - upload your logo)
     - Authorized domains: `vercel.app`
     - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Click "Add or Remove Scopes"
     - Select: `openid`, `profile`, `email`
   - Click "Save and Continue"
   - Test users: Add your email (for testing)
   - Click "Save and Continue"

5. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: "Nexoai Web Client"
   - Authorized JavaScript origins:
     ```
     https://nexoai-sigma.vercel.app
     https://btxkfuecplntpavvexxp.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
     ```
   - Click "Create"

6. **Copy Credentials**:
   - Copy the **Client ID** (looks like: xxx.apps.googleusercontent.com)
   - Copy the **Client Secret**

---

## Step 2: Configure Supabase

1. **Go to Supabase Dashboard**:
   - Navigate to: https://app.supabase.com/project/btxkfuecplntpavvexxp

2. **Enable Google Provider**:
   - Go to: Authentication → Providers
   - Find "Google" in the list
   - Toggle it ON
   - Paste your:
     - **Client ID**: (from Google Console)
     - **Client Secret**: (from Google Console)
   - Click "Save"

3. **Verify Redirect URL**:
   - Ensure the Callback URL shows:
     ```
     https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
     ```

---

## Step 3: Test Google Login

1. **Go to your app**: https://nexoai-sigma.vercel.app/auth/login

2. **Click "Google" button**

3. **You should be redirected to Google login**

4. **After login, you'll be redirected back to /dashboard**

---

## Troubleshooting

### Error: "Access Denied"
- Check that your email is added to "Test users" in Google Console
- OR publish your OAuth consent screen (move from Testing to Production)

### Error: "Redirect URI mismatch"
- Verify the redirect URI in Google Console exactly matches:
  `https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback`

### Google login works but no profile created
- Check Supabase logs: https://app.supabase.com/project/btxkfuecplntpavvexxp/logs
- The callback route should auto-create organization and user profile

---

## Quick Copy-Paste Values

**Google Authorized Redirect URIs:**
```
https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
```

**Google Authorized JavaScript Origins:**
```
https://nexoai-sigma.vercel.app
https://btxkfuecplntpavvexxp.supabase.co
```

---

## Alternative: Use GitHub OAuth

If Google is too complex, you can use GitHub OAuth instead:

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: Nexoai
   - Homepage URL: https://nexoai-sigma.vercel.app
   - Authorization callback URL: `https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret
5. In Supabase → Authentication → Providers → GitHub
6. Paste credentials and Save

---

**Done! Your Google/GitHub OAuth should now work!** 🎉
