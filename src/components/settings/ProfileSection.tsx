import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

export const ProfileSection = () => {
  const { profile } = useProfile();

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Perfil</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Nome: {profile?.full_name}</p>
        <p className="text-sm text-gray-500">CPF: {profile?.cpf}</p>
        <p className="text-sm text-gray-500">Telefone: {profile?.phone}</p>
        <p className="text-sm text-gray-500">E-mail: {profile?.email}</p>
      </div>
    </Card>
  );
};