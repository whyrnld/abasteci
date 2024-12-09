import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { maskCPF, maskPhone } from "@/lib/utils";

const Register = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref");
  const [referrerId, setReferrerId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateReferralCode = async () => {
      if (!referralCode) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", referralCode)
        .single();
      
      if (error || !data) {
        toast({
          variant: "destructive",
          title: "Código de indicação inválido",
          description: "O código informado não existe.",
        });
        return;
      }
      
      setReferrerId(data.id);
      toast({
        title: "Código de indicação válido!",
        description: "Você receberá R$ 5,00 ao se cadastrar.",
      });
    };
    
    validateReferralCode();
  }, [referralCode, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "cpf") {
      processedValue = value.replace(/\D/g, "");
    } else if (name === "phone") {
      processedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            cpf: formData.cpf,
            phone: formData.phone,
            birth_date: formData.birthDate,
            email: formData.email,
            referred_by: referrerId,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você já pode fazer login.",
        });
        navigate("/auth/login");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
        description: error.message,
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
            Criar nova conta
          </h2>
          
          {referralCode && referrerId && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center">
              Você foi indicado e receberá R$ 5,00 ao se cadastrar!
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-2"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                required
                value={maskCPF(formData.cpf)}
                onChange={handleChange}
                className="mt-2"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                required
                value={maskPhone(formData.phone)}
                onChange={handleChange}
                className="mt-2"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Data de nascimento</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha (6 números)</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  pattern="[0-9]{6}"
                  title="A senha deve conter 6 números"
                  maxLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                  placeholder="Digite sua senha"
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
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Já tem uma conta?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;