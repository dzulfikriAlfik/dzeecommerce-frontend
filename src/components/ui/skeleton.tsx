import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse-soft rounded-lg bg-zinc-200 dark:bg-zinc-800',
        className,
      )}
    />
  );
}

/**
 * Pre-built skeleton for a card layout.
 */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <Skeleton className="mb-4 h-40 w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-1/2" />
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
  );
}

/**
 * Pre-built skeleton for a table row.
 */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  );
}
