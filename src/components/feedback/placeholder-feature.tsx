import { cn } from '@/lib/utils';

interface PlaceholderFeatureProps {
  title?: string;
  className?: string;
}

/**
 * Placeholder shown for features not yet implemented.
 */
export function PlaceholderFeature({
  title = 'Feature currently under development',
  className,
}: PlaceholderFeatureProps) {
  return (
    <div
      className={cn(
        'flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
        <svg className="h-8 w-8 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H20.16" />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          This section is being built. Check back soon.
        </p>
      </div>
    </div>
  );
}
