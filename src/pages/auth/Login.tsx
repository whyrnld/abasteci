import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { maskCPF } from "@/lib/utils";
import { Link } from "react-router-dom";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cpfError, setCpfError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setCpf(value);
    setCpfError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCpfError("");

    try {
      const cleanCPF = cpf.replace(/\D/g, "");
      
      if (!validateCPF(cleanCPF)) {
        setCpfError("CPF inválido");
        toast({
          variant: "destructive",
          title: "CPF inválido",
          description: "Por favor, insira um CPF válido.",
        });
        setLoading(false);
        return;
      }

      const email = `${cleanCPF}@fuelfolio.app`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Erro ao fazer login",
            description: "CPF ou senha incorretos.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao fazer login",
            description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
          });
          console.error("Login error details:", error);
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, "");
    
    if (cleanCPF.length !== 11) {
      return false;
    }

    if (
      cleanCPF === "00000000000" ||
      cleanCPF === "11111111111" ||
      cleanCPF === "22222222222" ||
      cleanCPF === "33333333333" ||
      cleanCPF === "44444444444" ||
      cleanCPF === "55555555555" ||
      cleanCPF === "66666666666" ||
      cleanCPF === "77777777777" ||
      cleanCPF === "88888888888" ||
      cleanCPF === "99999999999"
    ) {
      return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/auth")}
          className="mr-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Acessar conta</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              inputMode="numeric"
              value={maskCPF(cpf)}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              required
              className={`mt-2 ${cpfError ? 'border-red-500' : ''}`}
            />
            {cpfError && (
              <p className="text-sm text-red-500 mt-1">{cpfError}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
                maxLength={6}
                className="pr-10"
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

          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
