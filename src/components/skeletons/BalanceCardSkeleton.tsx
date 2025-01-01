import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BalanceCardSkeleton = () => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <Skeleton className="w-6 h-6 rounded" />
      </div>
    </Card>
  );
};