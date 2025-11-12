/**
 * Brazukas Delivery - Ratings Management
 * Gerenciamento de avaliações de lojas e produtos
 */

export interface Rating {
  id: string;
  merchantId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  userName?: string;
}

// Simulação de dados de avaliações
const mockRatings: Rating[] = [
  {
    id: "1",
    merchantId: "1",
    userId: "user1",
    rating: 5,
    comment: "Excelente atendimento e comida deliciosa!",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "João Silva",
  },
  {
    id: "2",
    merchantId: "1",
    userId: "user2",
    rating: 4,
    comment: "Muito bom, entrega rápida",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Maria Santos",
  },
  {
    id: "3",
    merchantId: "2",
    userId: "user3",
    rating: 5,
    comment: "Sushi fresco e saboroso!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userName: "Pedro Costa",
  },
];

let ratingsData = [...mockRatings];

export async function fetchRatings(merchantId: string): Promise<Rating[]> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 300));
  return ratingsData.filter((r) => r.merchantId === merchantId);
}

export async function getAverageRating(merchantId: string): Promise<number> {
  const ratings = await fetchRatings(merchantId);
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
}

export async function submitRating(
  merchantId: string,
  rating: number,
  comment: string,
  userName: string = "Usuário Anônimo"
): Promise<Rating> {
  // Simular delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (rating < 1 || rating > 5) {
    throw new Error("Avaliação deve estar entre 1 e 5");
  }

  const newRating: Rating = {
    id: `rating-${Date.now()}`,
    merchantId,
    userId: `user-${Date.now()}`,
    rating,
    comment: comment || undefined,
    createdAt: new Date().toISOString(),
    userName,
  };

  ratingsData.push(newRating);
  return newRating;
}

export function getRatingStats(merchantId: string) {
  const ratings = ratingsData.filter((r) => r.merchantId === merchantId);
  const total = ratings.length;

  if (total === 0) {
    return {
      average: 0,
      total: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  ratings.forEach((r) => {
    sum += r.rating;
    distribution[r.rating as keyof typeof distribution]++;
  });

  return {
    average: sum / total,
    total,
    distribution,
  };
}
