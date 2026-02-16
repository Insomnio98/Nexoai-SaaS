# 🔧 FIX: Google OAuth Error 400 - redirect_uri_mismatch

## The Problem

Error: `Error 400: redirect_uri_mismatch`

This happens because Google Cloud Console redirect URIs don't match what Supabase is sending.

---

## ⚡ QUICK FIX (5 Minutes)

### Step 1: Update Google Cloud Console (2 minutes)

1. **Go to**: https://console.cloud.google.com/apis/credentials

2. **Click on your OAuth Client ID**:
   ```
   42202192374-hq4c2vvjuifaaahjhafbeh5a4t6o9883.apps.googleusercontent.com
   ```

3. **Under "Authorized redirect URIs", ADD THIS EXACT URL**:
   ```
   https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
   ```

   ⚠️ **CRITICAL**: This is the Supabase URL, NOT your app URL!

   ⚠️ **MUST BE EXACT**: No trailing slash, must be https

4. **Under "Authorized JavaScript origins", ensure these exist**:
   ```
   https://nexoai-sigma.vercel.app
   https://btxkfuecplntpavvexxp.supabase.co
   ```

5. **Click "SAVE"**

6. **Wait 2-3 minutes** for Google to propagate changes

---

### Step 2: Verify Supabase Configuration (1 minute)

1. **Go to**: https://app.supabase.com/project/btxkfuecplntpavvexxp/auth/url-configuration

2. **Verify "Site URL" is**:
   ```
   https://nexoai-sigma.vercel.app
   ```

3. **Verify "Redirect URLs" contains**:
   ```
   https://nexoai-sigma.vercel.app/**
   https://nexoai-sigma.vercel.app/auth/callback
   ```

4. **Go to**: https://app.supabase.com/project/btxkfuecplntpavvexxp/auth/providers

5. **Click "Google" provider**

6. **Verify these are filled**:
   - **Enabled**: Toggle should be ON (green)
   - **Client ID**: `42202192374-hq4c2vvjuifaaahjhafbeh5a4t6o9883.apps.googleusercontent.com`
   - **Client Secret**: Your Google OAuth client secret

7. **Click "Save"** if you made any changes

---

### Step 3: Test (1 minute)

1. **Clear browser cookies** or use Incognito mode

2. **Go to**: https://nexoai-sigma.vercel.app/auth/login

3. **Click "Google" button**

4. **Should work now!** ✅

---

## 🔍 Understanding the OAuth Flow

This is WHY you need the Supabase URL in Google Console:

```
User clicks "Sign in with Google"
    ↓
Your app redirects to Supabase
    ↓
Supabase redirects to Google with callback: btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
    ↓
Google authenticates user
    ↓
Google redirects BACK to: btxkfuecplntpavvexxp.supabase.co/auth/v1/callback ← THIS MUST BE IN GOOGLE CONSOLE
    ↓
Supabase processes auth
    ↓
Supabase redirects to your app: nexoai-sigma.vercel.app/auth/callback
    ↓
Your app creates session and redirects to /dashboard
```

---

## ❌ Common Mistakes

### ❌ WRONG: Adding app URL to Google Console
```
DON'T ADD: https://nexoai-sigma.vercel.app/auth/callback
```
This won't work because Google redirects to Supabase, not your app.

### ✅ CORRECT: Adding Supabase URL to Google Console
```
DO ADD: https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
```
This is where Google actually redirects.

---

## 📋 Complete Configuration Checklist

### Google Cloud Console
- [ ] Authorized redirect URIs contains:
  - `https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback` ← CRITICAL
- [ ] Authorized JavaScript origins contains:
  - `https://nexoai-sigma.vercel.app`
  - `https://btxkfuecplntpavvexxp.supabase.co`
- [ ] Saved and waited 2-3 minutes

### Supabase Dashboard
- [ ] Site URL = `https://nexoai-sigma.vercel.app`
- [ ] Redirect URLs contains:
  - `https://nexoai-sigma.vercel.app/**`
  - `https://nexoai-sigma.vercel.app/auth/callback`
- [ ] Google provider is enabled
- [ ] Client ID and Secret are correct
- [ ] Saved all changes

---

## 🐛 Still Not Working?

### Check 1: View Google's Error Page
When you get the error, Google shows:
- **The redirect URI that was attempted** (should be btxkfuecplntpavvexxp.supabase.co)
- **Your configured redirect URIs**

Make sure they match EXACTLY.

### Check 2: Browser Network Tab
1. Open DevTools (F12) → Network tab
2. Click "Sign in with Google"
3. Look for the redirect to Google
4. Check the `redirect_uri` parameter in the URL
5. Should be: `https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback`

### Check 3: Try Incognito Mode
Sometimes cached auth states cause issues.

### Check 4: Verify Environment Variables in Vercel
Make sure `NEXT_PUBLIC_APP_URL` is set correctly:
```
NEXT_PUBLIC_APP_URL=https://nexoai-sigma.vercel.app
```

---

## 🎯 Quick Copy-Paste

For Google Cloud Console "Authorized redirect URIs":
```
https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
```

For Google Cloud Console "Authorized JavaScript origins":
```
https://nexoai-sigma.vercel.app
https://btxkfuecplntpavvexxp.supabase.co
```

For Supabase "Site URL":
```
https://nexoai-sigma.vercel.app
```

For Supabase "Redirect URLs":
```
https://nexoai-sigma.vercel.app/**
https://nexoai-sigma.vercel.app/auth/callback
```

---

## ✅ After It Works

Once Google OAuth works:
1. Test session persistence (refresh page)
2. Test logout and login again
3. Check that user profile is created in Supabase
4. Verify dashboard loads correctly

---

**This should fix your Google OAuth issue!** Follow Step 1 first, wait 2-3 minutes, then test.
