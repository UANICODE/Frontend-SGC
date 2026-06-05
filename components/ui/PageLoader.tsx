import { Skeleton } from "./Skeleton";

export function PageLoader() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}