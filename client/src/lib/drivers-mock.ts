/**
 * Brazukas Delivery - Mock Drivers Data
 */

export interface Driver {
  id: string;
  nome: string;
  veiculo: string;
  score: number;
}

export const DRIVERS: Driver[] = [
  {
    id: "d1",
    nome: "Carlos Silva",
    veiculo: "Moto ABC-123",
    score: 4.8,
  },
  {
    id: "d2",
    nome: "Marina Lopes",
    veiculo: "Moto XYZ-456",
    score: 4.6,
  },
  {
    id: "d3",
    nome: "João Paz",
    veiculo: "Bike #21",
    score: 4.4,
  },
  {
    id: "d4",
    nome: "Ana Costa",
    veiculo: "Moto DEF-789",
    score: 4.9,
  },
  {
    id: "d5",
    nome: "Pedro Oliveira",
    veiculo: "Bike #15",
    score: 4.5,
  },
];

/**
 * Busca todos os entregadores
 */
export async function fetchDrivers(): Promise<Driver[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DRIVERS), 300);
  });
}

/**
 * Busca um entregador por ID
 */
export async function fetchDriver(id: string): Promise<Driver | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DRIVERS.find((d) => d.id === id)), 300);
  });
}
