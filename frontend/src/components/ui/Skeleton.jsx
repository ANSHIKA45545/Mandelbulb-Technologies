export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`} />
  );
}

export function BoardCardSkeleton() {
  return (
    <div className="card p-5">
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-full" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
