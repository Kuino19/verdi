# API Documentation

## Overview

VERDI API provides endpoints for legal education features including AI assistance, exam generation, flashcard creation, and more. All API endpoints require authentication via session cookies.

## Authentication

All protected endpoints require a valid session cookie set to `session`. The session cookie is obtained during login and contains an encoded Firebase ID token.

### Headers Required
```
Cookie: session=<session-token>
```

## Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)",
  "statusCode": 400
}
```

### Status Codes
- `200`: Success
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid session
- `403`: Forbidden - User lacks required permissions
- `404`: Not Found - Resource not found
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error

---

## Endpoints

### AI Assistant API

#### POST `/api/ai`

Generate AI responses for various types of requests (chat, case summarization, exam questions).

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Explain the rule against perpetuities" }
  ],
  "type": "assistant" // OR "summarize" OR "exam"
}
```

**Message Schema:**
- `role`: `"user"` | `"assistant"` | `"system"`
- `content`: String (1-10,000 characters)
- `messages` array: 1-20 items

**Type Options:**
- `"assistant"`: General legal AI assistance
- `"summarize"`: AI case law summarizer (formats output with Facts, Issues, Rule of Law, etc.)
- `"exam"`: AI exam question generator

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "content": "The rule against perpetuities is a common law rule..."
  },
  "statusCode": 200
}
```

**Rate Limits:**
- Free users: 50 queries per day
- Premium users: Unlimited

---

### Flashcard Generation API

#### POST `/api/flashcards/generate`

Generate educational flashcards from legal text.

**Request:**
```json
{
  "text": "The facts of the case were... [full case text]",
  "count": 5,
  "difficulty": "medium"
}
```

**Parameters:**
- `text`: String (10-50,000 characters) - Required
- `count`: Number (1-50, default: 5)
- `difficulty`: `"easy"` | `"medium"` | `"hard"` (default: `"medium"`)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "flashcards": [
      {
        "question": "What was the primary legal issue?",
        "answer": "Whether the defendant breached their fiduciary duty..."
      }
    ]
  },
  "statusCode": 200
}
```

---

### Exam Generation API

#### POST `/api/exams`

Generate practice exam questions from legal content.

**Request:**
```json
{
  "text": "Supply the full legal text or case law...",
  "questionCount": 5,
  "difficulty": "medium",
  "questionType": "mcq"
}
```

**Parameters:**
- `text`: String (10-50,000 characters) - Required
- `questionCount`: Number (1-100, default: 5)
- `difficulty`: `"easy"` | `"medium"` | `"hard"` (default: `"medium"`)
- `questionType`: `"essay"` | `"mcq"` | `"mixed"` (default: `"mcq"`)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "quiz": [
      {
        "question": "Which of the following best describes...",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": 2,
        "explanation": "The correct answer is Option C because..."
      }
    ]
  },
  "statusCode": 200
}
```

**Rate Limits:**
- Free users: 2 exams per day
- Premium users: Unlimited

---

### Study Planner API

#### POST `/api/planner`

Generate an optimized study schedule.

**Request:**
```json
{
  "topic": "Nigerian Constitutional Law",
  "daysAvailable": 7,
  "syllabus": "Optional syllabus document..."
}
```

**Parameters:**
- `topic`: String - Required
- `daysAvailable`: Number (1-365)
- `syllabus`: String (optional)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "plan": [
      {
        "dayOffset": 0,
        "title": "Introduction to Constitutional Framework",
        "focusAreas": ["Constitution basics", "Historical context"],
        "estimatedHours": 2
      }
    ]
  },
  "statusCode": 200
}
```

---

### OCR API

#### POST `/api/ocr`

Extract text from images or PDFs using Optical Character Recognition.

**Request (FormData):**
```
Content-Type: multipart/form-data

file: [PDF or Image file]
type: "exam" | "note" | "case"
language: "en" (optional)
```

**Parameters:**
- `file`: File - Required
- `type`: `"exam"` | `"note"` | `"case"` - Required
- `language`: String language code (default: `"en"`)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "confidence": 0.95
  },
  "statusCode": 200
}
```

---

### Admin APIs

#### POST `/api/admin/summarize`

Summarize multiple cases (Admin only).

**Request:**
```json
{
  "caseIds": ["case1", "case2"],
  "format": "markdown"
}
```

---

## Error Examples

### Invalid Data
```json
{
  "success": false,
  "error": "Bad Request",
  "details": "messages array must have at least 1 item",
  "statusCode": 400
}
```

### Authentication Error
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Session expired or invalid",
  "statusCode": 401
}
```

### Rate Limit Error
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "details": "You have reached your limit of 50 free daily AI queries. Upgrade to Premium for unlimited access.",
  "statusCode": 429
}
```

---

## Client Implementation

### Using the API Client

```typescript
import { apiClient } from '@/lib/api/client';

// POST request with auto-validation
const response = await apiClient.post('/api/ai', {
  messages: [{ role: 'user', content: 'Hello' }],
  type: 'assistant'
});

console.log(response.data.content);
```

### Error Handling

```typescript
try {
  const result = await apiClient.post('/api/flashcards/generate', {
    text: 'Legal text...',
    count: 10
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}
```

---

## Rate Limiting

- Free users: Subject to daily limits per feature
- Premium users: Unlimited access
- Rate limit errors return `429` status code
- Limits reset daily at UTC 00:00

---

## Security

- All endpoints validate session authentication
- Input is validated against Zod schemas
- Request IDs are tracked for debugging
- Security headers are applied to all responses
- Firebase Admin SDK prevents unauthorized access

---

## Testing

See `src/lib/__tests__` for test examples.

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```
