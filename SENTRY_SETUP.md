# Sentry Setup Guide

## ✅ What's Already Configured

### Frontend (React)
- ✅ `@sentry/react` installed
- ✅ Sentry initialized in `src/main.tsx` with:
  - Browser performance monitoring
  - Session replay
  - Error tracking
- ✅ React Router integrated with Sentry
- ✅ Error boundary wrapping the entire app

### Backend (Node.js)
- ✅ `@sentry/node` installed
- ✅ Sentry initialized in `server/index.js` with:
  - Express.js integration
  - HTTP tracing
  - Performance monitoring
  - Error handler middleware

## 🔐 Environment Variables Required

Add these to your `.env` file (create one if it doesn't exist):

```env
# Sentry DSNs
SENTRY_DSN_FRONTEND=https://43706f904960fa31803a681ee8c10cac@o4510346823335936.ingest.us.sentry.io/4510346872160256
SENTRY_DSN_BACKEND=https://4cb9fb95efb152c43a3a6874b0d837e2@o4510346823335936.ingest.us.sentry.io/4510346955587584

# Other existing vars (keep your current values)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
VITE_APP_URL=http://localhost:8080
PORT=3001
NODE_ENV=development
```

## 📋 Sentry Projects Created

1. **Frontend Project**: `javascript-react`
   - Platform: JavaScript/React
   - URL: https://llama-travel.sentry.io/projects/javascript-react/

2. **Backend Project**: `llama-trip-backend`
   - Platform: Node.js
   - URL: https://llama-travel.sentry.io/projects/llama-trip-backend/

## 🧪 Testing Your Sentry Integration

### Test Frontend Errors

A test component has been created at `src/components/SentryTestButton.tsx`. You can add it to any page to test error tracking:

```tsx
import SentryTestButton from '@/components/SentryTestButton';

// In your component
<SentryTestButton />
```

This will add buttons to:
- Trigger a frontend error
- Test Sentry breadcrumbs
- Capture a test message

### Test Backend Errors

Test backend error tracking by accessing:
```
GET http://localhost:3001/api/sentry-test
```

Or use curl:
```bash
curl http://localhost:3001/api/sentry-test
```

## 🎯 What Sentry Will Capture

### Frontend
- ✅ Unhandled React errors
- ✅ Promise rejections
- ✅ Console errors
- ✅ Network request failures
- ✅ Performance metrics
- ✅ User interactions (breadcrumbs)
- ✅ Session replays (when errors occur)

### Backend
- ✅ Unhandled exceptions
- ✅ HTTP request errors
- ✅ Express route errors
- ✅ Performance metrics
- ✅ Database errors
- ✅ Stripe API errors

## 🚀 Production Configuration

Before deploying to production:

1. **Adjust Sample Rates** in `src/main.tsx`:
   ```typescript
   tracesSampleRate: 0.1, // Reduce from 1.0 to 10%
   replaysSessionSampleRate: 0.01, // 1% of sessions
   ```

2. **Adjust Sample Rates** in `server/index.js`:
   ```javascript
   tracesSampleRate: 0.1, // Reduce from 1.0 to 10%
   ```

3. **Update Environment Variables**:
   - Set `NODE_ENV=production`
   - Update `tracePropagationTargets` with your production API URLs

4. **Enable Source Maps** (optional but recommended):
   - Add Sentry Vite plugin for automatic source map upload
   - Configure release tracking

## 📊 Viewing Errors in Sentry

1. Go to https://llama-travel.sentry.io
2. Select project: `javascript-react` (frontend) or `llama-trip-backend` (backend)
3. View:
   - **Issues**: Grouped errors
   - **Performance**: Transaction traces and slow requests
   - **Replays**: Video-like session recordings (when errors occur)

## 🔧 Cursor MCP Integration

With the Sentry MCP server configured in Cursor, you can:

```
# Query recent issues
"Show me the latest issues in llama-travel"

# Analyze specific errors
"What's causing issue JAVASCRIPT-REACT-123?"

# Get error trends
"Show me error trends from the last week"

# Search for specific errors
"Find all TypeError issues in the frontend"
```

## 📚 Resources

- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Sentry Node.js Docs](https://docs.sentry.io/platforms/javascript/guides/node/)
- [Sentry Dashboard](https://llama-travel.sentry.io)
- [Cursor MCP Blog Post](https://blog.sentry.io/smarter-debugging-sentry-mcp-cursor/)


