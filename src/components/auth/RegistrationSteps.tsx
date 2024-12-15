import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Info } from "lucide-react";
import { maskCPF, maskPhone } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface RegistrationData {
  email: string;
  referralCode: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  cpf: string;
  phone: string;
  birthDate: string;
}

interface RegistrationStepsProps {
  formData: RegistrationData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  formatBirthDateForDisplay: (value: string) => string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const RegistrationSteps = ({
  formData,
  handleChange,
  currentStep,
  setCurrentStep,
  showPassword,
  setShowPassword,
  formatBirthDateForDisplay,
  loading,
  handleSubmit,
}: RegistrationStepsProps) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Crie sua conta</h2>
        <p className="text-gray-500">E comece a economizar em seus abastecimentos</p>
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
        <Label htmlFor="referralCode">Código de indicação (opcional)</Label>
        <Input
          id="referralCode"
          name="referralCode"
          type="text"
          value={formData.referralCode}
          onChange={handleChange}
          className="mt-2"
          placeholder="Digite o código de indicação"
        />
      </div>

      <p className="text-sm text-gray-500">
        Ao continuar você declara que leu e concorda com os{" "}
        <Link to="/terms" className="text-primary hover:underline">
          Termos e Condições
        </Link>
      </p>

      <Button 
        className="w-full" 
        onClick={() => setCurrentStep(2)}
        disabled={!formData.email}
      >
        Continuar
      </Button>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Crie sua senha de acesso</h2>
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

      <div>
        <Label htmlFor="confirmPassword">Confirme sua senha</Label>
        <div className="relative mt-2">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            pattern="[0-9]{6}"
            maxLength={6}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pr-10"
            placeholder="Confirme sua senha"
          />
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={() => setCurrentStep(3)}
        disabled={!formData.password || !formData.confirmPassword}
      >
        Continuar
      </Button>
    </div>
  );

  const Step3 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Informe seus dados</h2>
      </div>

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
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          name="cpf"
          type="text"
          required
          maxLength={11}
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
          maxLength={11}
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
          type="text"
          required
          value={formatBirthDateForDisplay(formData.birthDate)}
          onChange={handleChange}
          className="mt-2"
          placeholder="DD/MM/AAAA"
        />
      </div>

      <Button 
        type="button" 
        variant="ghost" 
        className="w-full text-primary"
        onClick={() => setShowInfoModal(true)}
      >
        <Info className="w-4 h-4 mr-2" />
        Por que pedimos seu CPF e celular?
      </Button>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Por que precisamos dessas informações?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              É através do seu CPF que garantimos a sua segurança e conseguimos ter certeza que todo valor ganho através do Abasteci será transferido somente para sua conta bancária.
            </p>
            <p>
              O telefone é importante para que você se identifique durante o envio de suas notas para receber seu cashback.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );

  return (
    <div className="w-full max-w-sm mx-auto">
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
    </div>
  );
};
