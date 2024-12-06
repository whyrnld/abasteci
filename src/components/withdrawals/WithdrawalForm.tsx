import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProfile } from "@/hooks/useProfile";

interface WithdrawalFormProps {
  pixKeyType: string;
  setPixKeyType: (value: string) => void;
  pixKey: string;
  setPixKey: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  walletBalance: number;
  onSubmit: (e: React.FormEvent) => void;
}

export const WithdrawalForm = ({
  pixKeyType,
  setPixKeyType,
  pixKey,
  setPixKey,
  amount,
  setAmount,
  walletBalance,
  onSubmit
}: WithdrawalFormProps) => {
  const { profile } = useProfile();

  useEffect(() => {
    if (profile) {
      setPixKeyType(profile.pix_key_type || "cpf");
      setPixKey(profile.pix_key || "");
    }
  }, [profile, setPixKeyType, setPixKey]);

  const handleWithdrawAll = () => {
    if (walletBalance) {
      setAmount(walletBalance.toString());
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label>Valor disponível para saque</Label>
            <p className="text-2xl font-bold mt-1">
              R$ {walletBalance?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div>
            <Label>Valor do saque</Label>
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Digite o valor"
                step="0.01"
                min="0"
                max={walletBalance || 0}
              />
              <Button type="button" variant="outline" onClick={handleWithdrawAll}>
                Sacar tudo
              </Button>
            </div>
          </div>

          <div>
            <Label>Tipo de Chave PIX</Label>
            <RadioGroup
              value={pixKeyType}
              onValueChange={setPixKeyType}
              className="grid grid-cols-2 gap-4 mt-2"
            >
              <div>
                <RadioGroupItem value="cpf" id="cpf" className="peer sr-only" />
                <Label
                  htmlFor="cpf"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  CPF
                </Label>
              </div>
              <div>
                <RadioGroupItem value="email" id="email" className="peer sr-only" />
                <Label
                  htmlFor="email"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Email
                </Label>
              </div>
              <div>
                <RadioGroupItem value="phone" id="phone" className="peer sr-only" />
                <Label
                  htmlFor="phone"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Celular
                </Label>
              </div>
              <div>
                <RadioGroupItem value="random" id="random" className="peer sr-only" />
                <Label
                  htmlFor="random"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Aleatória
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Chave PIX</Label>
            <Input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="Digite sua chave PIX"
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      <Button type="submit" className="w-full">
        Solicitar Saque
      </Button>
    </form>
  );
};