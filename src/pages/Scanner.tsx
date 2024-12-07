import { QrCode, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useToast } from "@/components/ui/use-toast";
import { useReceipts } from "@/hooks/useReceipts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const Scanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [manualKey, setManualKey] = useState("");
  const { toast } = useToast();
  const { submitReceipt } = useReceipts();

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    if (showScanner) {
      html5QrCode = new Html5Qrcode("reader");
      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            html5QrCode.stop();
            setShowScanner(false);
            try {
              await submitReceipt.mutateAsync({
                invoice_key: decodedText,
                amount: 0, // This will be calculated by the backend
                station_id: 1, // This should be determined by the QR code
                status: 'processing'
              });
            } catch (error: any) {
              console.error('Error submitting receipt:', error);
              const errorMessage = error?.message?.includes('3 receipts per week')
                ? "Você atingiu o limite de 3 notas por semana. Torne-se premium para enviar mais!"
                : "Não foi possível registrar o cupom fiscal.";
              
              toast({
                variant: "destructive",
                title: "Erro",
                description: errorMessage,
              });
            }
          },
          (error) => {
            console.error(error);
          }
        )
        .catch((err) => {
          console.error(err);
        });
    }

    return () => {
      if (html5QrCode) {
        html5QrCode
          .stop()
          .catch((err) => console.error("Error stopping QR Code scanner:", err));
      }
    };
  }, [showScanner, toast, submitReceipt]);

  const handleManualKeySubmit = async () => {
    if (!manualKey) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira uma chave válida.",
      });
      return;
    }
    
    try {
      await submitReceipt.mutateAsync({
        invoice_key: manualKey,
        amount: 0, // This will be calculated by the backend
        station_id: 1, // This should be determined by the invoice key
        status: 'processing'
      });
      
      setManualKey("");
      toast({
        title: "Chave registrada com sucesso!",
        description: "O cupom fiscal foi registrado e está em análise.",
      });
    } catch (error: any) {
      console.error('Error submitting receipt:', error);
      const errorMessage = error?.message?.includes('3 receipts per week')
        ? "Você atingiu o limite de 3 notas por semana. Torne-se premium para enviar mais!"
        : "Não foi possível registrar o cupom fiscal.";
      
      toast({
        variant: "destructive",
        title: "Erro",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Scanner QR Code</h1>
      </section>

      {!showScanner ? (
        <div className="space-y-4">
          <Card className="p-6 text-center space-y-4">
            <QrCode className="w-16 h-16 text-primary mx-auto" />
            <p className="text-gray-600">Escolha uma das opções abaixo</p>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => setShowScanner(true)}>
                Ler QR Code
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Digitar chave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Digite a chave do cupom fiscal</DialogTitle>
                    <DialogDescription>
                      Insira a chave do cupom fiscal para registrar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Digite a chave aqui"
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value)}
                    />
                    <Button 
                      className="w-full" 
                      onClick={handleManualKeySubmit}
                    >
                      Enviar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>

          <Card className="p-4 space-y-2">
            <h3 className="font-medium">Regras</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Limite de 3 cupons por semana (usuários não premium)</li>
              <li>• R$ 0,10 de cashback por cupom</li>
              <li>• Processamento em até 15 dias</li>
              <li>• Saque mínimo: R$ 20,00 (usuários não premium)</li>
            </ul>
          </Card>
        </div>
      ) : (
        <div id="reader" className="w-full"></div>
      )}
    </div>
  );
};

export default Scanner;