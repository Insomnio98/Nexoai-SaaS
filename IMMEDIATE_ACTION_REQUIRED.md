# ⚡ IMMEDIATE ACTION REQUIRED - Fix localhost Redirect Issue

## What Was Fixed in Code (Already Deployed)

✅ Updated all production URL references from localhost to `https://nexoai-sigma.vercel.app`
✅ Fixed password reset redirect
✅ Fixed OAuth callback redirect
✅ Fixed Stripe checkout success/cancel URLs
✅ Committed and pushed to GitHub
✅ Vercel is deploying now (check: https://vercel.com/dashboard)

---

## 🔴 YOU MUST DO THESE 3 THINGS NOW

### 1. Update Vercel Environment Variable (2 minutes)

**This is CRITICAL - the app won't work without this!**

1. Go to: https://vercel.com
2. Select your project: **nexoai** (or nexoai-sigma)
3. Click **Settings** → **Environment Variables**
4. Find `NEXT_PUBLIC_APP_URL` or add it if missing
5. Set the value to:
   ```
   https://nexoai-sigma.vercel.app
   ```
6. Apply to: **Production**, **Preview**, **Development** (check all three)
7. Click **Save**
8. Go to **Deployments** tab
9. Find the latest deployment
10. Click **⋯** (three dots) → **Redeploy**
11. Wait 2-3 minutes for deployment to complete

---

### 2. Update Supabase Redirect URLs (1 minute)

1. Go to: https://app.supabase.com/project/btxkfuecplntpavvexxp/auth/url-configuration

2. **Update Site URL** to:
   ```
   https://nexoai-sigma.vercel.app
   ```

3. **Add Redirect URLs** (if not already there):
   ```
   https://nexoai-sigma.vercel.app/auth/callback
   https://nexoai-sigma.vercel.app/**
   ```

4. Click **Save**

---

### 3. Update Google OAuth (1 minute)

1. Go to: https://console.cloud.google.com/apis/credentials

2. Click on your OAuth Client ID:
   ```
   42202192374-hq4c2vvjuifaaahjhafbeh5a4t6o9883.apps.googleusercontent.com
   ```

3. Under **Authorized redirect URIs**, add:
   ```
   https://nexoai-sigma.vercel.app/auth/callback
   https://btxkfuecplntpavvexxp.supabase.co/auth/v1/callback
   ```

4. Under **Authorized JavaScript origins**, add:
   ```
   https://nexoai-sigma.vercel.app
   https://btxkfuecplntpavvexxp.supabase.co
   ```

5. Click **Save**

---

## 🧪 Test After Completing Above Steps

### Test 1: Password Reset (Should NOT go to localhost)
1. Go to: https://nexoai-sigma.vercel.app/auth/forgot-password
2. Enter your email
3. Check the reset email - URL should be `https://nexoai-sigma.vercel.app/...` NOT `localhost:3000`
4. Click the link - should stay on production domain

✅ **PASS**: Redirects to production
❌ **FAIL**: Redirects to localhost → Check Vercel environment variable

---

### Test 2: Google OAuth (Should NOT go to localhost)
1. Go to: https://nexoai-sigma.vercel.app/auth/login
2. Click "Sign in with Google"
3. Complete Google sign-in
4. Should redirect to: `https://nexoai-sigma.vercel.app/dashboard` NOT localhost

✅ **PASS**: Redirects to production dashboard
❌ **FAIL**: Shows error → Check Google OAuth redirect URIs

---

### Test 3: Account Creation
1. Go to: https://nexoai-sigma.vercel.app/auth/signup
2. Fill in all fields:
   - Full Name: Test User
   - Email: test@example.com
   - Password: TestPass123!
   - Confirm Password: TestPass123!
3. Click "Create account"
4. Should redirect to: `https://nexoai-sigma.vercel.app/dashboard`

✅ **PASS**: Redirected to dashboard
❌ **FAIL**: Nothing happens → Check browser console (F12) for errors

**If account creation still doesn't work**, run this in Supabase SQL Editor:

```sql
-- Check if user was created
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check if organization was created
SELECT * FROM organizations ORDER BY created_at DESC LIMIT 5;

-- Check if user profile was created
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
```

If users exist but no organizations, the RLS policy might be blocking. See [CRITICAL_FIXES.md](./CRITICAL_FIXES.md) for RLS policy fixes.

---

## 🎯 Quick Checklist

- [ ] Updated `NEXT_PUBLIC_APP_URL` in Vercel to `https://nexoai-sigma.vercel.app`
- [ ] Redeployed app from Vercel dashboard
- [ ] Updated Supabase Site URL and Redirect URLs
- [ ] Updated Google OAuth redirect URIs
- [ ] Tested password reset - works correctly
- [ ] Tested Google OAuth - works correctly
- [ ] Tested account creation - works correctly
- [ ] Session persists after page refresh

---

## 📊 Expected Timeline

- **Step 1-3**: 5 minutes to update configurations
- **Vercel Deployment**: 2-3 minutes
- **Testing**: 5 minutes
- **Total**: ~15 minutes until everything works

---

## ❓ If Something Still Doesn't Work

### Password Reset Still Goes to Localhost
→ Check Vercel environment variable is set correctly and you redeployed

### Google OAuth Error
→ Check redirect URIs in Google Console match exactly (no trailing slash)

### Account Creation Does Nothing
→ Check browser console (F12) → Network tab for API errors
→ Check Supabase logs: https://app.supabase.com/project/btxkfuecplntpavvexxp/logs/explorer
→ Run the SQL queries above to see what's being created

### Session Doesn't Persist
→ Clear browser cookies and try again
→ Check Supabase session in localStorage (F12 → Application → Local Storage)

---

## 📝 Summary

**Code fixes**: ✅ DONE and deployed
**Your action needed**: Update 3 configurations (Vercel, Supabase, Google)
**Time needed**: 15 minutes total

Once you complete the 3 steps above and test, your app will be fully functional with:
- ✅ Password reset working
- ✅ Google OAuth working
- ✅ Account creation working
- ✅ Sessions persisting
- ✅ All redirects going to production

Let me know the results of your testing!
