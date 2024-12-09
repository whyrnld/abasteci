import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      // Send custom email using our edge function
      await supabase.functions.invoke('send-email', {
        body: {
          to: [email],
          subject: "Redefinição de senha - Abasteci",
          html: `
            <h2>Redefinição de senha</h2>
            <p>Você solicitou a redefinição de sua senha no aplicativo Abasteci.</p>
            <p>Clique no link que enviamos para seu email para definir uma nova senha.</p>
            <p>Se você não solicitou esta alteração, ignore este email.</p>
          `,
        },
      });

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      navigate("/auth/login");
    } catch (error: any) {
      console.error("Error in password reset:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação.",
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
            Recuperar senha
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                placeholder="Digite seu e-mail"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar email de recuperação"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Lembrou sua senha?{" "}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Voltar ao login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;