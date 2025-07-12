# Auth0 Setup Guide

This project supports both Auth0 authentication (for production) and mock authentication (for development).

## 🔧 Setup

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/vconnect
PORT=4000

# JWT Configuration (for local development)
JWT_SECRET=your-secret-key-here

# Auth0 Configuration (for production)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Optional: Set to 'true' to force Auth0 authentication (disable mock auth)
FORCE_AUTH0=false
```

### 2. Auth0 Application Setup

1. **Create an Auth0 Application:**
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new application
   - Choose "Single Page Application" or "Regular Web Application"

2. **Configure Application Settings:**
   - **Allowed Callback URLs:** `http://localhost:3000/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - **Allowed Web Origins:** `http://localhost:3000`

3. **Create an API:**
   - Go to "APIs" section
   - Create a new API
   - Set the identifier (this will be your `AUTH0_AUDIENCE`)

4. **Get Your Configuration:**
   - **Domain:** Found in your application settings
   - **Client ID:** Found in your application settings
   - **Client Secret:** Found in your application settings
   - **Audience:** The API identifier you created

## 🔄 Authentication Flow

### Development Mode (Default)
- Uses **mock authentication** for easy development
- Mock tokens: `mock-token-john`, `mock-token-jane`, etc.
- No Auth0 configuration required

### Production Mode
- Uses **Auth0 authentication** when configured
- Falls back to mock auth if Auth0 fails
- Requires proper Auth0 setup

## 🧪 Testing

### Mock Authentication
```bash
# Use these tokens in your Authorization header
Authorization: Bearer mock-token-john
Authorization: Bearer mock-token-jane
Authorization: Bearer mock-token-alice
```

### Auth0 Authentication
```bash
# Get a real token from Auth0
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6...
```

## 🔍 How It Works

1. **Token Detection:** The context checks for an Authorization header
2. **Auth0 Priority:** If Auth0 is configured, it tries to verify the token first
3. **Fallback:** If Auth0 fails or isn't configured, it falls back to mock authentication
4. **User Context:** The verified user is available in all resolvers

## 🚀 Usage in Resolvers

```typescript
// In your resolvers, you can access the user like this:
resolve: async (_parent: unknown, args: any, context: { user?: AuthUser }) => {
  if (!context.user) {
    throw new Error('Unauthorized');
  }
  
  // context.user.sub contains the user ID
  // context.user.name contains the user name
  // context.user.email contains the user email
  
  return await User.findOne({ auth0Id: context.user.sub });
}
```

## 🔧 Troubleshooting

### Auth0 Not Working
1. Check your environment variables
2. Verify your Auth0 application settings
3. Check the console logs for authentication status
4. Ensure your token is valid and not expired

### Mock Auth Not Working
1. Check that you're using the correct mock tokens
2. Verify the mock tokens in `src/middleware/mockauth.ts`
3. Check that Auth0 is not configured (or set `FORCE_AUTH0=false`)

## 📝 Notes

- Mock authentication is perfect for development and testing
- Auth0 provides enterprise-grade security for production
- The system automatically chooses the best authentication method
- You can switch between modes by configuring/unconfiguring Auth0 