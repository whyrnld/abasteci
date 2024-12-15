import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthIndex = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/lovable-uploads/e1bf47e1-a5db-4e98-b28e-186214d302c4.png")' }}
    >
      <div className="flex-1 flex flex-col justify-end">
        <div className="bg-white rounded-t-2xl p-6 w-full">
          <Button
            onClick={() => navigate("/auth/register")}
            className="w-full bg-primary text-white mb-4"
          >
            Criar conta
          </Button>
          
          <Button
            variant="ghost"
            className="w-full text-primary"
            onClick={() => navigate("/auth/login")}
          >
            Acessar minha conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthIndex;