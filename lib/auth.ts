import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@swastikbikes.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// Session token (simple approach - in production, use JWT or secure sessions)
const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'swastik-bikes-secret-2024';

export interface AdminUser {
  email: string;
  isAdmin: true;
}

export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  if (email !== ADMIN_EMAIL) {
    return false;
  }

  // If no hash is set, use plain text comparison (for initial setup)
  if (!ADMIN_PASSWORD_HASH) {
    console.warn('⚠️ ADMIN_PASSWORD_HASH not set. Using plain text password comparison.');
    return password === process.env.ADMIN_PASSWORD;
  }

  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function createSession(email: string): Promise<void> {
  const sessionData = JSON.stringify({
    email,
    isAdmin: true,
    createdAt: Date.now(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Validate session age (optional)
    const sessionAge = Date.now() - sessionData.createdAt;
    const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in ms
    
    if (sessionAge > maxAge) {
      await deleteSession();
      return null;
    }

    return {
      email: sessionData.email,
      isAdmin: sessionData.isAdmin,
    };
  } catch (error) {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAdmin(): Promise<AdminUser> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

// Utility to generate password hash (run this once to generate hash)
export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
