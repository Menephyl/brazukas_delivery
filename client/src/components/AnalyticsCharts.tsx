/**
 * Brazukas Delivery - Analytics Charts
 * Componentes de gráficos para painel de análise
 */

import { useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface ChartData {
  date?: string;
  hour?: string;
  orders?: number;
  revenue?: number;
  name?: string;
  value?: number;
  sales?: number;
}

interface AnalyticsChartsProps {
  data: ChartData[];
  type: "line" | "bar" | "pie";
  title: string;
  dataKey: string;
  color?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function SalesChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="orders" stroke="#3b82f6" name="Pedidos" />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Receita (R$)" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function HourlyChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#3b82f6" name="Pedidos" />
          <Bar dataKey="revenue" fill="#10b981" name="Receita (R$)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TopProductsChart({ data, title }: { data: any[]; title: string }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">R$ {product.revenue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">⭐ {product.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function PaymentMethodsChart({ data, title }: { data: any; title: string }) {
  const chartData = [
    { name: "PIX", value: data.pixTransactions, color: "#3b82f6" },
    { name: "Dinheiro", value: data.moneyTransactions, color: "#10b981" },
    { name: "Cartão", value: data.cardTransactions, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  icon?: React.ReactNode;
  color?: string;
}) {
  const isPositive = trend && trend.startsWith("+");

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {unit && <p className="text-sm text-muted-foreground">{unit}</p>}
          </div>
          {trend && (
            <p className={`text-xs mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${color || "bg-blue-100 text-blue-600"}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
