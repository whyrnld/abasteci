import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Check, Clock, X } from "lucide-react";

interface ReceiptCardProps {
  id: number;
  station: string;
  amount: number;
  date: string;
  status: "processing" | "approved" | "rejected";
}

const ReceiptCard = ({ id, station, amount, date, status }: ReceiptCardProps) => {
  const statusIcons = {
    processing: <Clock className="w-5 h-5 text-gray-500" />,
    approved: <Check className="w-5 h-5 text-black" />,
    rejected: <X className="w-5 h-5 text-black" />
  };

  return (
    <Link to={`/receipts/${id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          {statusIcons[status]}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{station}</p>
                <p className="text-sm text-gray-500">{date}</p>
              </div>
              <p className="text-black font-medium">
                {formatCurrency(amount)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ReceiptCard;