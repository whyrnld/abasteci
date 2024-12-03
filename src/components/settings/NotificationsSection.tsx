import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationsSectionProps {
  priceAlerts: boolean;
  receiptAlerts: boolean;
  setPriceAlerts: (value: boolean) => void;
  setReceiptAlerts: (value: boolean) => void;
}

export const NotificationsSection = ({
  priceAlerts,
  receiptAlerts,
  setPriceAlerts,
  setReceiptAlerts,
}: NotificationsSectionProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Notificações
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-500">
            Atualizações de preço
          </label>
          <Switch
            checked={priceAlerts}
            onCheckedChange={setPriceAlerts}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-500">
            Status do recibo
          </label>
          <Switch
            checked={receiptAlerts}
            onCheckedChange={setReceiptAlerts}
          />
        </div>
      </div>
    </Card>
  );
};