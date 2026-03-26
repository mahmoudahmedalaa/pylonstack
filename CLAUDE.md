## Code Review Standards
After completing any implementation, review the code for:
- Functions longer than 30 lines (likely doing too much)
- Logic duplicated more than twice (extract to utility)
- Any `any` type usage in TypeScript (replace with real types)
- Components with more than 3 props that could be grouped into an object
- Missing error handling on async operations

Run /simplify before presenting code to the user.

Example catch:

// Before code review
const getUser = async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return data;
};

const getPost = async (id: string) => {
  const res = await fetch(`/api/posts/${id}`);
  const data = await res.json();
  return data;
};

// After code review. Pattern extracted
const fetchResource = async (path: string) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

const getUser = (id: string) => fetchResource(`/api/users/${id}`);
const getPost = (id: string) => fetchResource(`/api/posts/${id}`);
