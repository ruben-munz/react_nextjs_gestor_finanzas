export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl space-y-1.5 px-4 sm:px-6 lg:px-8">
        <p>
          FinanzasPro MVP · Clean Architecture · Next.js App Router + TypeScript + MySQL 8.0 (`Money` Integer Cents)
        </p>
        <p className="text-slate-400">
          © {currentYear} Rubén Muñoz. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
