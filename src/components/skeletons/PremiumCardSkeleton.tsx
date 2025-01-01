import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PremiumCardSkeleton = () => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-900 to-black">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-6 h-6 rounded bg-gray-700" />
        <div className="flex-1">
          <Skeleton className="h-6 w-24 mb-2 bg-gray-700" />
          <Skeleton className="h-4 w-48 bg-gray-700" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full bg-gray-700" />
        <Skeleton className="h-4 w-3/4 bg-gray-700" />
        <Skeleton className="h-4 w-5/6 bg-gray-700" />
      </div>
      <Skeleton className="h-10 w-full bg-gray-700" />
    </Card>
  );
};