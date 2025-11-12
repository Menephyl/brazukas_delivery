/**
 * Brazukas Delivery - LoyaltyCard Component
 * Componente para exibir status do programa de fidelidade
 */

import { useState, useEffect } from "react";
import { Zap, Gift, TrendingUp, Loader2 } from "lucide-react";

interface LoyaltyStatus {
  points: number;
  cashback: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  totalSpent: number;
  nextTier: string;
  progressToNextTier: number;
  pointsPerDollar: number;
  cashbackPercent: number;
}

interface LoyaltyCardProps {
  userId: string | number;
}

const tierColors = {
  bronze: "from-amber-600 to-amber-700",
  silver: "from-slate-400 to-slate-500",
  gold: "from-yellow-400 to-yellow-600",
  platinum: "from-purple-400 to-purple-600",
};

const tierNames = {
  bronze: "Bronze",
  silver: "Prata",
  gold: "Ouro",
  platinum: "Platina",
};

export default function LoyaltyCard({ userId }: LoyaltyCardProps) {
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoyaltyStatus();
  }, [userId]);

  const loadLoyaltyStatus = async () => {
    setLoading(true);
    try {
      // Simular carregamento de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data
      setLoyalty({
        points: 450,
        cashback: 12.5,
        tier: "silver",
        totalSpent: 1200,
        nextTier: "gold",
        progressToNextTier: 40,
        pointsPerDollar: 1.5,
        cashbackPercent: 1,
      });
    } catch (error) {
      console.error("Erro ao carregar status de fidelidade:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!loyalty) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Main Card */}
      <div
        className={`rounded-lg bg-gradient-to-r ${tierColors[loyalty.tier]} p-6 text-white shadow-lg`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Seu Nível</p>
            <h2 className="text-3xl font-bold">{tierNames[loyalty.tier]}</h2>
          </div>
          <div className="text-4xl">
            {loyalty.tier === "bronze" && "🥉"}
            {loyalty.tier === "silver" && "🥈"}
            {loyalty.tier === "gold" && "🥇"}
            {loyalty.tier === "platinum" && "💎"}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso para {tierNames[loyalty.nextTier as keyof typeof tierNames]}</span>
            <span>{loyalty.progressToNextTier}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${loyalty.progressToNextTier}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Pontos</p>
            <p className="text-2xl font-bold">{loyalty.points}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Cashback</p>
            <p className="text-2xl font-bold">R$ {loyalty.cashback.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="font-medium text-sm">Pontos por Real</span>
          </div>
          <p className="text-2xl font-bold text-primary">{loyalty.pointsPerDollar}x</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-5 w-5 text-pink-500" />
            <span className="font-medium text-sm">Cashback</span>
          </div>
          <p className="text-2xl font-bold text-primary">{loyalty.cashbackPercent}%</p>
        </div>
      </div>

      {/* Total Spent */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-medium">Total Gasto</span>
          </div>
          <p className="text-xl font-bold text-primary">R$ {loyalty.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full rounded-lg bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition">
        Ver Histórico de Pontos
      </button>
    </div>
  );
}
