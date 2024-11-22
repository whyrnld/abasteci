import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Stations = () => {
  const { id } = useParams();
  const isDetailView = !!id;

  const stations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      address: "Av. Paulista, 1000",
      prices: {
        regular: 5.49,
        premium: 6.29,
        ethanol: 3.99,
        diesel: 6.29,
      },
      priceHistory: [
        { date: '2024-03-01', regular: 5.39, premium: 6.19, ethanol: 3.89, diesel: 6.19 },
        { date: '2024-03-15', regular: 5.49, premium: 6.29, ethanol: 3.99, diesel: 6.29 },
      ],
      lastUpdate: "Há 2 horas",
    },
  ];

  const station = stations.find(s => s.id === Number(id));

  const filterOptions = [
    { label: "7 dias", value: "7" },
    { label: "15 dias", value: "15" },
    { label: "30 dias", value: "30" },
    { label: "60 dias", value: "60" },
    { label: "90 dias", value: "90" },
  ];

  if (isDetailView && station) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <section className="bg-primary p-6 -mx-6 -mt-6">
          <div className="flex items-center gap-2 text-white mb-4">
            <Link to="/stations">
              <Button variant="ghost" className="text-white hover:text-white/80">
                Voltar
              </Button>
            </Link>
            <h1 className="text-lg font-medium">{station.name}</h1>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{station.address}</p>
                  <p className="text-sm text-gray-500">{station.distance}</p>
                  <p className="text-xs text-gray-400 mt-1">Última atualização: {station.lastUpdate}</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-4">Preços Atuais</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(station.prices).map(([type, price]) => (
              <Card key={type} className="p-4">
                <p className="text-sm text-gray-500 capitalize">{type}</p>
                <p className="text-lg font-medium">R$ {price.toFixed(2)}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Histórico de Preços</h2>
            <select className="text-sm border rounded-md p-1">
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Card className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={station.priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="regular" stroke="#8884d8" name="Gasolina Comum" />
                <Line type="monotone" dataKey="premium" stroke="#82ca9d" name="Gasolina Premium" />
                <Line type="monotone" dataKey="ethanol" stroke="#ffc658" name="Etanol" />
                <Line type="monotone" dataKey="diesel" stroke="#ff7300" name="Diesel" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Postos Próximos</h1>
      </section>

      <div className="space-y-3">
        {stations.map((station) => (
          <Link key={station.id} to={`/stations/${station.id}`}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-500">{station.address}</p>
                      <p className="text-xs text-gray-400 mt-1">{station.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-medium">
                        R$ {station.prices.regular.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{station.distance}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stations;