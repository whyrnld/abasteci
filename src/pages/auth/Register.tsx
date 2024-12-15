import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { RegistrationSteps } from "@/components/auth/RegistrationSteps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get("ref");
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    referralCode: referralCode || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "cpf") {
      processedValue = value.replace(/\D/g, "").slice(0, 11);
    } else if (name === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 11);
    } else if (name === "birthDate") {
      processedValue = value.replace(/\D/g, "");
      if (processedValue.length > 8) {
        processedValue = processedValue.slice(0, 8);
      }
      if (processedValue.length >= 8) {
        const day = processedValue.slice(0, 2);
        const month = processedValue.slice(2, 4);
        const year = processedValue.slice(4, 8);
        processedValue = `${year}-${month}-${day}`;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const canProceedToStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  const canProceedToStep3 = () => {
    return (
      formData.password.length === 6 &&
      formData.confirmPassword === formData.password
    );
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !canProceedToStep2()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um e-mail válido.",
      });
      return;
    }

    if (currentStep === 2 && !canProceedToStep3()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas devem ter 6 dígitos e serem iguais.",
      });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const formatBirthDateForDisplay = (value: string) => {
    if (!value) return "";
    if (value.includes("-")) {
      const [year, month, day] = value.split("-");
      return `${day}/${month}/${year}`;
    }
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
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
      console.error("Error registering:", error);
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
        <h1 className="text-xl font-semibold">Criar conta</h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <RegistrationSteps
          formData={formData}
          handleChange={handleChange}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          formatBirthDateForDisplay={formatBirthDateForDisplay}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Register;