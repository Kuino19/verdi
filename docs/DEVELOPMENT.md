# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn
- Firebase project set up
- Groq API key
- Google Cloud credentials

### Installation

```bash
git clone <repository>
cd verdi
npm install
npx husky install
```

### Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase config
- `GROQ_API_KEY` - Groq API key
- `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_ADMIN_SDK_PATH` - Firebase Admin

### Running Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the [Architecture Guide](./ARCHITECTURE.md) patterns.

### 3. Test Your Code

```bash
npm test                 # Run tests
npm run test:watch      # Watch mode
npm run lint            # Check linting
```

### 4. Commit (Pre-commit Hooks Run)

```bash
git add .
git commit -m "feat: Add new feature"
# Husky runs: eslint, tests, prettier
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

GitHub Actions runs:
- Linter
- Tests with coverage
- Build verification
- Type checking
- Security scans

## Common Tasks

### Add a New API Endpoint

1. Create validation schema in `src/lib/validators/schemas.ts`
2. Create route handler in `src/app/api/[feature]/route.ts`
3. Use standard error handling and response format
4. Add tests in `src/__tests__/`
5. Update `docs/API.md`

Example:

```typescript
// src/lib/validators/schemas.ts
export const NewFeatureSchema = z.object({
  data: z.string().min(1),
});

// src/app/api/new-feature/route.ts
import { NewFeatureSchema } from '@/lib/validators/schemas';
import { validateSessionCookie } from '@/lib/api/auth-middleware';
import { handleError, createSuccessResponse } from '@/lib/errors/handler';
import { AppError } from '@/lib/errors/AppError';

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const auth = await validateSessionCookie(req as any);
    if (!auth) throw AppError.unauthorized();

    const data = NewFeatureSchema.parse(await req.json());
    
    // Your logic here

    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleError(error, requestId);
  }
}
```

### Add a New Component

1. Create component in `src/components/`
2. Make sure it's 'use client' if it uses hooks/state
3. Add TypeScript types for props
4. Add test in `src/components/__tests__/`

### Add Database Function

1. Add type to `src/types/firestore.ts`
2. Implement in `src/lib/firebase/db.ts`
3. Use typed parameters and return values
4. Add error handling with AppError
5. Add logging

### Add Tests

```typescript
import { describe, it, expect } from '@jest/globals';

describe('Component/Function', () => {
  it('should do something', () => {
    const result = functionToTest();
    expect(result).toBe(expected);
  });
});
```

Run: `npm test`

## Debugging

### View Console Logs

```bash
npm run dev
# Logs appear in terminal
```

### Inspect Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Check request/response headers and body

### Check Database

[Firebase Console](https://console.firebase.google.com)

### View Server Logs

All server logs use structured JSON format:
```json
{
  "timestamp": "2026-04-05T10:30:45.123Z",
  "level": "ERROR",
  "message": "Failed to fetch user",
  "context": { "userId": "123" }
}
```

## Code Quality

### Linting

```bash
npm run lint              # Check all files
npm run lint -- --fix    # Auto-fix issues
```

Rules:
- ESLint configuration from Next.js
- No `any` types (use proper types)
- Consistent naming conventions
- No console logs in production code (use logger)

### Type Checking

```bash
npx tsc --noEmit
```

All files must pass TypeScript strict mode.

### Testing

- Aim for 80%+ coverage
- Test happy path and error cases
- Mock external dependencies
- Use meaningful test names

## Build & Deploy

### Local Build

```bash
npm run build
npm start
```

### Deployment Checklist

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linter passes
- [ ] No console errors
- [ ] Environment variables set
- [ ] Firebase rules updated
- [ ] Rate limits configured
- [ ] Analytics events checked

## Troubleshooting

### "Module not found" errors

Make sure paths in `tsconfig.json` aliases match your file structure:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Firebase authentication errors

1. Check session cookie is being sent
2. Verify Firebase Admin SDK credentials
3. Check user document exists in Firestore
4. Review Firebase security rules

### Test failures

```bash
npm test -- --verbose  # More details
npm test -- --no-coverage  # Faster
```

### Build failures

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Zod Validation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
