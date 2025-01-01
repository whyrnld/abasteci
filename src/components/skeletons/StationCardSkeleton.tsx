import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StationCardSkeleton = () => {
  return (
    <Card className="p-4 w-full">
      <div className="flex gap-4 w-full">
        <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
        <div className="flex-1 flex justify-between min-w-0">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="text-right ml-4">
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
};