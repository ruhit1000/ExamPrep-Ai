const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * authHeader — builds the Authorization header object from a Bearer token
 * @param {string} token
 * @returns {Object}
 */
export function authHeader(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * protectedFetch — wraps fetch with an Authorization header
 * Use for GET requests to protected endpoints
 * @param {string} endpoint - relative path e.g. '/api/modules/mine'
 * @param {string} token - Bearer token
 * @param {RequestInit} options - additional fetch options
 */
export async function protectedFetch(endpoint, token, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...authHeader(token),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * serverMutation — wraps fetch for POST / PATCH / DELETE with auth header
 * @param {string} endpoint - relative path e.g. '/api/modules'
 * @param {string} token - Bearer token
 * @param {'POST'|'PATCH'|'DELETE'} method
 * @param {Object} body - request body (will be JSON stringified)
 */
export async function serverMutation(endpoint, token, method = 'POST', body = null) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    credentials: 'include',
    headers: authHeader(token),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * publicFetch — plain GET request without auth (for public endpoints)
 * @param {string} endpoint - relative path
 * @param {RequestInit} options
 */
export async function publicFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}
