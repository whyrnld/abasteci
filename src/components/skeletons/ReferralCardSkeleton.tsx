import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ReferralCardSkeleton = () => {
  return (
    <Card className="p-6 bg-gradient-to-r from-white to-gray-50">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-6 h-6 rounded" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <Skeleton className="h-4 w-20 mx-auto mb-1" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Card>
  );
};