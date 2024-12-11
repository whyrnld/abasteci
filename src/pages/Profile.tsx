import { useProfile } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nome completo</label>
            <p className="font-medium">{profile?.full_name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">CPF</label>
            <p className="font-medium">{profile?.cpf}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Telefone</label>
            <p className="font-medium">{profile?.phone}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{profile?.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={() => navigate("/settings")} className="w-full">
            Editar Perfil
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;