/**
 * Brazukas Delivery - useServerCart Hook
 * Hook para gerenciar carrinho persistente no servidor
 */

import { useState, useCallback, useEffect } from "react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  qty: number;
  merchantId?: string | number;
  foto?: string;
}

interface CartData {
  items: CartItem[];
  couponCode?: string;
  totalAmount: number;
}

export function useServerCart(userId: string | number) {
  const [cart, setCart] = useState<CartData>({
    items: [],
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from server
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular carregamento do servidor
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Em produção, chamar API: const response = await fetch(`/api/cart/${userId}`);
      setCart({
        items: [],
        totalAmount: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar carrinho");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add item to cart
  const addItem = useCallback(
    async (item: CartItem) => {
      setLoading(true);
      setError(null);
      try {
        // Simular adição ao servidor
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existingItem = cart.items.find((i) => i.id === item.id);

        let newItems: CartItem[];
        if (existingItem) {
          newItems = cart.items.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
          );
        } else {
          newItems = [...cart.items, item];
        }

        const totalAmount = newItems.reduce((sum, i) => sum + i.preco * i.qty, 0);

        setCart({
          ...cart,
          items: newItems,
          totalAmount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao adicionar item");
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (itemId: string) => {
      setLoading(true);
      setError(null);
      try {
        // Simular remoção do servidor
        await new Promise((resolve) => setTimeout(resolve, 300));

        const newItems = cart.items.filter((i) => i.id !== itemId);
        const totalAmount = newItems.reduce((sum, i) => sum + i.preco * i.qty, 0);

        setCart({
          ...cart,
          items: newItems,
          totalAmount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao remover item");
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (itemId: string, qty: number) => {
      if (qty < 1) {
        await removeItem(itemId);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Simular atualização do servidor
        await new Promise((resolve) => setTimeout(resolve, 300));

        const newItems = cart.items.map((i) =>
          i.id === itemId ? { ...i, qty } : i
        );
        const totalAmount = newItems.reduce((sum, i) => sum + i.preco * i.qty, 0);

        setCart({
          ...cart,
          items: newItems,
          totalAmount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao atualizar quantidade");
      } finally {
        setLoading(false);
      }
    },
    [cart, removeItem]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular limpeza do servidor
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCart({
        items: [],
        totalAmount: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao limpar carrinho");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply coupon
  const applyCoupon = useCallback(
    async (couponCode: string) => {
      setLoading(true);
      setError(null);
      try {
        // Simular aplicação de cupom do servidor
        await new Promise((resolve) => setTimeout(resolve, 300));

        setCart({
          ...cart,
          couponCode: couponCode.toUpperCase(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao aplicar cupom");
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  // Remove coupon
  const removeCoupon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular remoção de cupom do servidor
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCart({
        ...cart,
        couponCode: undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao remover cupom");
    } finally {
      setLoading(false);
    }
  }, [cart]);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return {
    cart,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    loadCart,
  };
}
