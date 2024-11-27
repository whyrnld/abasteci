import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock notification data - In a real app, fetch this based on the ID
  const notification = {
    id: 1,
    title: "Nota fiscal aprovada",
    message: "Sua nota fiscal do Posto Shell foi aprovada e você recebeu R$ 0,10 de cashback!",
    date: "12/03/2024 às 15:30",
    read: false,
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:text-white/80">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white text-lg font-medium">Notificação</h1>
        </div>
      </section>

      <Card className="p-6">
        <h2 className="text-xl font-medium mb-2">{notification.title}</h2>
        <p className="text-gray-500 text-sm mb-4">{notification.date}</p>
        <p className="text-gray-700">{notification.message}</p>
      </Card>
    </div>
  );
};

export default NotificationDetails;