/**
 * Brazukas Delivery - Coupons Management
 * Gerenciamento de cupons de desconto
 */

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  coupon?: Coupon;
  discount?: number;
}

// Mock data de cupons disponíveis
const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "PROMO20",
    description: "20% de desconto em qualquer pedido",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 0,
    maxUses: 100,
    usedCount: 45,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    code: "DESCONTO10",
    description: "R$ 10 de desconto em pedidos acima de R$ 50",
    discountType: "fixed",
    discountValue: 10,
    minOrderValue: 50,
    maxUses: 200,
    usedCount: 120,
    isActive: true,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    code: "FRETE5",
    description: "R$ 5 de desconto no frete",
    discountType: "fixed",
    discountValue: 5,
    minOrderValue: 30,
    maxUses: 500,
    usedCount: 250,
    isActive: true,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    code: "PRIMEIRA15",
    description: "15% de desconto no primeiro pedido",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 25,
    maxUses: 1000,
    usedCount: 750,
    isActive: true,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function fetchAvailableCoupons(): Promise<Coupon[]> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const now = new Date();
  return mockCoupons.filter((coupon) => {
    const isNotExpired = !coupon.expiresAt || new Date(coupon.expiresAt) > now;
    const isActive = coupon.isActive;
    const hasUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
    return isNotExpired && isActive && hasUses;
  });
}

export async function validateCoupon(
  code: string,
  orderTotal: number
): Promise<CouponValidationResult> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));

  const coupon = mockCoupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) {
    return {
      valid: false,
      error: "Cupom não encontrado",
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      error: "Cupom inativo",
    };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return {
      valid: false,
      error: "Cupom expirado",
    };
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return {
      valid: false,
      error: "Limite de usos do cupom atingido",
    };
  }

  if (orderTotal < coupon.minOrderValue) {
    return {
      valid: false,
      error: `Valor mínimo do pedido é R$ ${coupon.minOrderValue.toFixed(2)}`,
    };
  }

  const discount = calculateDiscount(orderTotal, coupon);

  return {
    valid: true,
    coupon,
    discount,
  };
}

export function calculateDiscount(orderTotal: number, coupon: Coupon): number {
  if (coupon.discountType === "percentage") {
    return (orderTotal * coupon.discountValue) / 100;
  } else {
    return Math.min(coupon.discountValue, orderTotal);
  }
}

export function formatCouponDescription(coupon: Coupon): string {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}% de desconto`;
  } else {
    return `R$ ${coupon.discountValue.toFixed(2)} de desconto`;
  }
}

export function getCouponStatus(coupon: Coupon): {
  status: "active" | "expiring" | "expired" | "limited";
  message: string;
} {
  if (!coupon.isActive) {
    return { status: "expired", message: "Inativo" };
  }

  if (coupon.expiresAt) {
    const expiresDate = new Date(coupon.expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.floor(
      (expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) {
      return { status: "expired", message: "Expirado" };
    }

    if (daysUntilExpiry <= 7) {
      return {
        status: "expiring",
        message: `Expira em ${daysUntilExpiry} dia(s)`,
      };
    }
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { status: "limited", message: "Limite atingido" };
  }

  return { status: "active", message: "Ativo" };
}
