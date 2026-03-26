# API Design Principles
When designing routes, interfaces, or internal tRPC/Supabase APIs, follow these strict principles:

- **RESTful semantics:** Use standard HTTP methods appropriately (GET, POST, PUT, DELETE, PATCH).
- **Resource Naming:** Nouns not verbs. `/api/users/123/posts` not `/api/getPostsForUser`.
- **Versioning:** Always prefix external APIs with a version (e.g., `/api/v1/...`) to prevent breaking changes.
- **Consistent Envelopes:** Return data in a predictable format:
```json
{
  "data": { ... },
  "error": null,
  "meta": { "pagination": ... }
}
```
- **Idempotency:** PUT and DELETE must be idempotent.
- **Granular Errors:** Provide standard HTTP status codes and detailed internal error codes.
