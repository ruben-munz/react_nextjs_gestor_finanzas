'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { clearSessionUsername, setSessionUsername } from '../../infrastructure/auth/session';

const LoginSchema = z.object({
  username: z.string().trim().min(1, 'Introduce un nombre de usuario'),
  password: z.string().trim().min(1, 'Introduce una contraseña'),
});

export interface AuthActionState {
  error?: string;
}

/**
 * Server Action para el "Fake Login".
 * Permite el acceso con cualquier usuario y cualquier contraseña siempre que no estén vacíos.
 */
export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawUsername = formData.get('username');
  const rawPassword = formData.get('password');

  const parsed = LoginSchema.safeParse({
    username: typeof rawUsername === 'string' ? rawUsername : '',
    password: typeof rawPassword === 'string' ? rawPassword : '',
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { error: firstIssue?.message || 'Completa todos los campos para continuar.' };
  }

  await setSessionUsername(parsed.data.username);
  redirect('/');
}

export async function logoutAction(): Promise<void> {
  await clearSessionUsername();
  redirect('/login');
}
