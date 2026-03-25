---
name: Supabase + Next.js Integration
description: Official Supabase AI prompts for Next.js auth, RLS policies, migrations, and database best practices. Source: supabase.com/docs/guides/getting-started/ai-prompts
---

# Supabase + Next.js Integration

> Source: [Supabase Official AI Prompts](https://supabase.com/docs/guides/getting-started/ai-prompts) — verified, maintained by Supabase team.

---

## 1. Next.js + Supabase Auth SSR

### Overview
1. Install `@supabase/supabase-js` and `@supabase/ssr` packages
2. Set up environment variables
3. Write two utility functions with `createClient` — browser client and server client
4. Hook up middleware proxy to refresh auth tokens

### 🚨 CRITICAL: Deprecated Patterns That Break the Application

```typescript
// ❌ NEVER USE — breaks production
{
  cookies: {
    get(name: string) { return cookieStore.get(name) },
    set(name: string, value: string) { cookieStore.set(name, value) },
    remove(name: string) { cookieStore.remove(name) }
  }
}

// ❌ NEVER import from auth-helpers-nextjs — it's deprecated
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
```

### ✅ The ONLY Correct Pattern

```typescript
{
  cookies: {
    getAll() {
      return cookieStore.getAll()
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
      })
    }
  }
}
```

### Absolute Requirements
1. MUST use `@supabase/ssr` (not `auth-helpers-nextjs`)
2. MUST use ONLY `getAll` and `setAll`
3. MUST NEVER use individual `get`, `set`, or `remove`
4. MUST NEVER import from `@supabase/auth-helpers-nextjs`

### Browser Client

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

### Server Client

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — safe to ignore with proxy
          }
        },
      },
    }
  )
}
```

### Middleware Proxy (Token Refresh)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // CRITICAL: Do not run code between createServerClient and auth.getUser()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // MUST return supabaseResponse — never create a new response without copying cookies
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

### Verification Checklist
Before generating any Supabase auth code:
1. Are you using ONLY `getAll` and `setAll`? If not, STOP and FIX.
2. Are you importing from `@supabase/ssr`? If not, STOP and FIX.
3. Do you see ANY instance of `get`, `set`, or `remove`? If yes, STOP and FIX.
4. Are you importing from `auth-helpers-nextjs`? If yes, STOP and FIX.

---

## 2. RLS Policies

### Rules for Writing RLS Policies
- Generated SQL must be valid SQL
- Use only CREATE POLICY or ALTER POLICY queries
- Always use `auth.uid()` instead of `current_user`
- SELECT → USING (no WITH CHECK)
- INSERT → WITH CHECK (no USING)
- UPDATE → both USING and WITH CHECK
- DELETE → USING (no WITH CHECK)
- Never use `FOR ALL` — create separate policies per operation
- Policy names should be short, descriptive, in double quotes
- Encourage PERMISSIVE policies, discourage RESTRICTIVE

### Supabase Roles
- `anon` — unauthenticated request
- `authenticated` — authenticated request

### Correct Syntax Order
```sql
-- ✅ Correct: for → to
create policy "Public profiles viewable by authenticated"
on profiles
for select
to authenticated
using ( true );

-- ❌ Wrong: to → for (will error)
create policy "..."
on profiles
to authenticated
for select
using ( true );
```

### Helper Functions
- `auth.uid()` — returns the ID of the requesting user
- `auth.jwt()` — returns the JWT; use `raw_app_meta_data` for authorization data (not `raw_user_meta_data`)

### Performance Recommendations
1. **Add indexes** on columns used in policies
2. **Wrap functions in `select`** — `(select auth.uid()) = user_id` (not `auth.uid() = user_id`)
3. **Minimize joins** — use `IN` or `ANY` instead of joining source and target tables
4. **Always specify roles** with `TO` clause

---

## 3. Database Migrations

### File Naming
Format: `YYYYMMDDHHmmss_short_description.sql`
Example: `20240906123045_create_profiles.sql`

### SQL Guidelines
- Include header comment with migration metadata
- Write all SQL in lowercase
- Add comments for destructive commands (truncate, drop, column alterations)
- Always enable RLS on new tables, even for public access
- RLS policies must be granular: one per operation, one per role
- Include rationale comments for each security policy
- Generated SQL must be production-ready

---
