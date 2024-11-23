import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PriceHistoryProps {
  stationId: number;
  selectedFuel: string;
}

export const PriceHistory = ({ stationId, selectedFuel }: PriceHistoryProps) => {
  const [period, setPeriod] = useState(7);

  // Mock data - replace with actual API call
  const data = Array.from({ length: period }, (_, i) => ({
    date: new Date(Date.now() - (period - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    price: 5 + Math.random() * 0.5,
  }));

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[7, 15, 30, 60, 90].map((days) => (
            <Button
              key={days}
              variant={period === days ? "default" : "outline"}
              onClick={() => setPeriod(days)}
              className="whitespace-nowrap"
            >
              {days} dias
            </Button>
          ))}
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#9b87f5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};