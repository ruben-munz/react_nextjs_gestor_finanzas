import { redirect } from 'next/navigation';
import { getSessionUsername } from '../../infrastructure/auth/session';
import { LoginForm } from '../../presentation/components/LoginForm';

export default async function LoginPage() {
  const username = await getSessionUsername();
  if (username) {
    redirect('/');
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      {/* Efectos ambientales de fondo estilo Fintech */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

      <LoginForm />
    </main>
  );
}
