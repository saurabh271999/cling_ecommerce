# Google OAuth Setup Guide

## Error: "Access blocked: Shynora's request is invalid"

This error occurs when Google OAuth is not properly configured. Follow these steps to fix it:

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first

## Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: **Shynora** (or your app name)
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (if app is in testing mode):
   - Add your email and any test user emails
   - **Important**: Only test users can sign in when app is in testing mode

## Step 3: Create OAuth Client ID

1. Application type: **Web application**
2. Name: **Shynora Web Client** (or any name)
3. **Authorized redirect URIs** - Add these:
   ```
   http://localhost:8000/api/auth/callback/google
   ```
   For production, also add:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
4. Click "Create"
5. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

Create or update your `.env` file in the `ecommerce-backend` directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/callback/google

# Backend URL (optional, defaults to http://localhost:8000)
BACKEND_URL=http://localhost:8000

# Other required variables
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret_key
PORT=8000
```

## Step 5: Common Issues and Solutions

### Issue 1: "Access blocked" error
**Solution:**
- Make sure the redirect URI in Google Cloud Console **exactly matches** the one in your `.env` file
- Check that your email is added as a test user (if app is in testing mode)
- Verify the OAuth consent screen is published or you're using a test user email

### Issue 2: "redirect_uri_mismatch" error
**Solution:**
- The redirect URI in Google Cloud Console must match exactly (including http/https, port, and path)
- Check for trailing slashes
- Make sure you're using the correct environment (localhost vs production)

### Issue 3: App is in testing mode
**Solution:**
- Add your email to "Test users" in OAuth consent screen
- Or publish the app (requires verification for production use)

### Issue 4: Invalid client ID
**Solution:**
- Double-check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure there are no extra spaces or quotes in the `.env` file
- Restart your backend server after updating `.env`

## Step 6: Test the Configuration

1. Make sure your backend server is running:
   ```bash
   cd ecommerce-backend
   yarn start-dev
   ```

2. Try logging in with Google from your frontend

3. Check the backend console for any error messages

## Production Setup

For production:

1. Update the redirect URI in Google Cloud Console to your production URL
2. Update `.env`:
   ```env
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/callback/google
   BACKEND_URL=https://yourdomain.com
   NODE_ENV=production
   ```
3. Make sure your OAuth consent screen is published (may require verification)

## Verification Checklist

- [ ] Google+ API is enabled
- [ ] OAuth consent screen is configured
- [ ] OAuth client ID is created (Web application type)
- [ ] Redirect URI is added in Google Cloud Console
- [ ] Redirect URI matches the one in `.env` file
- [ ] Test users are added (if app is in testing mode)
- [ ] Environment variables are set correctly
- [ ] Backend server is restarted after `.env` changes

