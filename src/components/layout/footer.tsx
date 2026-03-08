import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
              <span className="text-xs font-bold text-white">D</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Dzeecommerce
            </span>
          </div>

          <nav className="flex gap-6">
            <Link
              href="/products"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Cart
            </Link>
            <Link
              href="/orders"
              className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Orders
            </Link>
          </nav>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {year} Dzeecommerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
