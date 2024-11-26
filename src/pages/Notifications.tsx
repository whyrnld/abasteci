import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Nota fiscal aprovada",
      message: "Sua nota fiscal do Posto Shell foi aprovada",
      date: "Há 2 horas",
      read: false,
    },
    {
      id: 2,
      title: "Cashback recebido",
      message: "Você recebeu R$ 5,00 de cashback",
      date: "Há 1 dia",
      read: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-white/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white text-lg font-medium">Notificações</h1>
        </div>
      </section>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`p-4 ${!notification.read ? 'bg-primary/5' : ''}`}
          >
            <h3 className="font-medium">{notification.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-2">{notification.date}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;