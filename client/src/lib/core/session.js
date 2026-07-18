import { getSession } from '../auth';

/**
 * getUserSession — returns the full session object (user + token)
 * Returns null if no active session
 */
export async function getUserSession() {
  try {
    const session = await getSession();
    return session?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * getUserToken — extracts the raw Bearer token from the session
 * Returns null if no active session
 */
export async function getUserToken() {
  try {
    const session = await getSession();
    return session?.data?.session?.token ?? null;
  } catch {
    return null;
  }
}
