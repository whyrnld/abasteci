import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get the token from the URL hash
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const error = hashParams.get("error");
    const errorDescription = hashParams.get("error_description");

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorDescription?.replace(/\+/g, ' ') || "Link inválido ou expirado",
      });
      navigate("/auth/login");
      return;
    }

    // If we have an access token, we can proceed with the password reset
    if (accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: "",
      }).catch((error) => {
        console.error("Error setting session:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível validar sua sessão. Tente novamente.",
        });
        navigate("/auth/login");
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Link inválido ou expirado",
      });
      navigate("/auth/login");
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi alterada com sucesso. Você já pode fazer login.",
      });
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível alterar sua senha.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-6 py-6">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Nova senha
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="password">Nova senha (6 números)</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  pattern="[0-9]{6}"
                  title="A senha deve conter 6 números"
                  maxLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Digite sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Alterando..." : "Alterar senha"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;