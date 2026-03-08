export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        {children}
      </div>
    </div>
  );
}
