/**
 * Brazukas Delivery - Route Stats Component
 * Painel de resumo com estatísticas da rota de rastreamento
 */

import { Card } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Gauge,
  Navigation,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface RouteStatsProps {
  stats?: {
    totalDistance: {
      km: number;
      m: number;
    };
    totalDuration: {
      seconds: number;
      minutes: number;
      hours: string;
    };
    averageSpeed: number;
    pointCount: number;
  };
  trackingPoints?: Array<{
    ts?: string | number | Date;
    lat: number;
    lng: number;
    speedKmh?: number;
    heading?: number;
  }>;
  isLoading?: boolean;
}

export default function RouteStats({
  stats,
  trackingPoints = [],
  isLoading = false,
}: RouteStatsProps) {
  // Calcular hora de início e fim
  const getStartTime = () => {
    if (!trackingPoints || trackingPoints.length === 0) return "N/A";
    const firstPoint = trackingPoints[0];
    if (!firstPoint.ts) return "N/A";
    return new Date(firstPoint.ts).toLocaleTimeString("pt-BR");
  };

  const getEndTime = () => {
    if (!trackingPoints || trackingPoints.length === 0) return "N/A";
    const lastPoint = trackingPoints[trackingPoints.length - 1];
    if (!lastPoint.ts) return "N/A";
    return new Date(lastPoint.ts).toLocaleTimeString("pt-BR");
  };

  const getStartDate = () => {
    if (!trackingPoints || trackingPoints.length === 0) return "N/A";
    const firstPoint = trackingPoints[0];
    if (!firstPoint.ts) return "N/A";
    return new Date(firstPoint.ts).toLocaleDateString("pt-BR");
  };

  // Componente para cada card de estatística
  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit = "",
    color = "blue",
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    unit?: string;
    color?: "blue" | "green" | "purple" | "orange" | "red";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 border-blue-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      orange: "bg-orange-50 border-orange-200",
      red: "bg-red-50 border-red-200",
    };

    const iconColorClasses = {
      blue: "text-blue-600",
      green: "text-green-600",
      purple: "text-purple-600",
      orange: "text-orange-600",
      red: "text-red-600",
    };

    return (
      <Card className={`p-4 ${colorClasses[color]} border`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-1 ${iconColorClasses[color]}`} />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? "..." : value}
              {unit && <span className="text-sm ml-1">{unit}</span>}
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold mb-2">Resumo da Rota</h3>
        <p className="text-sm text-muted-foreground">
          {getStartDate()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {/* Distância Total */}
        <StatCard
          icon={MapPin}
          label="Distância Total"
          value={stats?.totalDistance.km ?? 0}
          unit="km"
          color="blue"
        />

        {/* Tempo de Viagem */}
        <StatCard
          icon={Clock}
          label="Tempo de Viagem"
          value={
            stats?.totalDuration.minutes
              ? `${stats.totalDuration.minutes} min`
              : "0 min"
          }
          color="green"
        />

        {/* Velocidade Média */}
        <StatCard
          icon={Gauge}
          label="Velocidade Média"
          value={stats?.averageSpeed ?? 0}
          unit="km/h"
          color="purple"
        />

        {/* Pontos Rastreados */}
        <StatCard
          icon={Navigation}
          label="Pontos Rastreados"
          value={stats?.pointCount ?? 0}
          color="orange"
        />

        {/* Hora de Início */}
        <StatCard
          icon={Calendar}
          label="Hora de Início"
          value={getStartTime()}
          color="blue"
        />

        {/* Hora de Término */}
        <StatCard
          icon={TrendingUp}
          label="Hora de Término"
          value={getEndTime()}
          color="red"
        />
      </div>

      {/* Resumo Adicional */}
      {stats && (
        <Card className="p-4 bg-gray-50 border">
          <h4 className="font-semibold text-sm mb-3">Detalhes Adicionais</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Distância (metros):</span>
              <span className="font-medium">{stats.totalDistance.m.toLocaleString("pt-BR")} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duração (horas):</span>
              <span className="font-medium">{stats.totalDuration.hours} h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duração (segundos):</span>
              <span className="font-medium">
                {stats.totalDuration.seconds.toLocaleString("pt-BR")} s
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
