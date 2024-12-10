import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import ReferralCard from "@/components/ReferralCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-medium">Bem-vindo, {profile?.full_name}!</h2>
      </Card>
      <ReferralCard />
    </div>
  );
};

export default Home;