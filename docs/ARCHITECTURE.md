# VERDI Architecture Guide

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── (app)/             # Protected routes
│   ├── auth/              # Auth routes
│   └── layout.tsx         # Root layout with Error Boundary
├── components/
│   ├── app/               # Application components
│   ├── landing/           # Landing page components
│   └── ErrorBoundary.tsx  # Error boundary wrapper
├── lib/
│   ├── api/               # API utilities
│   │   ├── client.ts      # API client with retry logic
│   │   ├── auth-middleware.ts
│   │   └── security-headers.ts
│   ├── errors/            # Error handling
│   │   ├── AppError.ts    # Custom error class
│   │   └── handler.ts     # Centralized error handler
│   ├── validators/        # Input validation
│   │   ├── schemas.ts     # Zod schemas
│   │   └── env.ts         # Environment validation
│   ├── firebase/          # Firebase config
│   ├── groq/              # Groq AI client
│   ├── vertex/            # Google Vertex AI
│   └── logger.ts          # Structured logging
└── types/
    ├── api.ts             # API request/response types
    └── firestore.ts       # Database schema types
```

## Key Patterns

### Error Handling

All errors are thrown as `AppError` instances with proper status codes:

```typescript
// Throw specific error types
throw AppError.unauthorized('Invalid session');
throw AppError.notFound('User not found');
throw AppError.tooManyRequests('Rate limit hit');

// Centralized handler in routes
return handleError(error, requestId);
```

### Input Validation

All API inputs are validated with Zod schemas:

```typescript
const validatedData = AIRequestSchema.parse(req.body);
// Type inference: validatedData is typed as AIRequest
```

### Logging

Structured logging for debugging:

```typescript
logger.info('Action completed', { userId, actionId });
logger.error('Database error', { error: error.message });
```

### Type Safety

- Firestore documents typed with `User`, `Task`, `Case` interfaces
- API requests/responses typed with Zod schemas
- Full TypeScript strict mode enabled

## API Route Pattern

Standard pattern for protected API routes:

```typescript
import { validateSessionCookie } from '@/lib/api/auth-middleware';
import { handleError, createSuccessResponse } from '@/lib/errors/handler';
import { YourSchema } from '@/lib/validators/schemas';
import { AppError } from '@/lib/errors/AppError';

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    // 1. Verify authentication
    const authData = await validateSessionCookie(req as any);
    if (!authData) throw AppError.unauthorized();

    // 2. Validate input
    const validatedData = YourSchema.parse(await req.json());

    // 3. Business logic
    // 4. Return success response
    return createSuccessResponse(data, 200);

  } catch (error) {
    return handleError(error, requestId);
  }
}
```

## Database Schema

Firestore collections use typed interfaces:

```typescript
interface User {
  uid: string;
  email: string;
  isPremium: boolean;
  points: number;
  createdAt: string;
  aiUsage?: AIUsageData;
}
```

## Testing Strategy

- Unit tests for utilities and libraries
- Component tests with React Testing Library
- Jest configuration with Next.js support
- GitHub Actions runs tests on PR

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Pre-commit Hooks

Husky + lint-staged runs on every commit:

```bash
- ESLint for TypeScript files
- Jest for related tests
- Prettier for JSON/Markdown
```

## Environment Variables

Validated at app startup with Zod schema. Required variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
...
```

See [env.ts](./src/lib/validators/env.ts) for full list.

## Security

- Session-based authentication with Firebase Admin SDK
- All API routes validate session cookie
- Input validation prevents injection attacks
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Rate limiting for free users
- Request IDs for audit trails

## Performance

- API client with automatic retries and exponential backoff
- Structured logging with proper log levels
- Type-safe code prevents runtime errors
- Next.js Image optimization configured
- Font optimization with next/font

## Monitoring

- All errors logged with context (userId, requestId)
- Firebase Analytics integrated
- Structured JSON logs for analysis
- Development vs production logging levels

## Contributing

1. Follow the patterns outlined above
2. Add types to `src/types/`
3. Add validation schemas to `src/lib/validators/`
4. Write tests in `src/__tests__/`
5. Commit checks will run linter and tests
