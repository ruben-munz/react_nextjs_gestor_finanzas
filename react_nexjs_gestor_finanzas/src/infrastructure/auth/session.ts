import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'gf_session_user';

export async function getSessionUsername(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return value && value.trim() ? value.trim() : null;
}

export async function setSessionUsername(username: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, username.trim(), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}

export async function clearSessionUsername(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
